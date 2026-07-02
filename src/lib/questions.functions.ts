import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const InputSchema = z.object({
  topic: z.string().trim().min(2).max(120),
  difficulty: z.enum(["easy", "medium", "hard", "mixed"]),
  count: z.number().int().min(5).max(20),
});

type GeneratedQuestion = {
  question: string;
  choices: [string, string, string, string];
  correct_index: number;
};

export const generateCustomQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const diffText =
      data.difficulty === "mixed"
        ? "רמות קושי מעורבות (חלק קל, חלק בינוני, חלק קשה)"
        : data.difficulty === "easy"
          ? "רמת קושי קלה"
          : data.difficulty === "medium"
            ? "רמת קושי בינונית"
            : "רמת קושי קשה";

    const systemPrompt = `אתה יוצר שאלות טריוויה איכותיות בעברית. חובה: כל שאלה עם בדיוק 4 תשובות, רק אחת נכונה. אל תוסיף הסברים. החזר JSON חוקי בלבד.`;

    const userPrompt = `צור ${data.count} שאלות טריוויה בעברית בנושא: "${data.topic}".
${diffText}.
כללים:
- שאלה קצרה וברורה
- 4 תשובות אפשריות (מחרוזות קצרות, ללא אות/מספור בהתחלה)
- תשובה אחת נכונה בלבד
- הימנע משאלות דו-משמעיות או עמומות
- ודא שהתשובה הנכונה מדויקת עובדתית`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_questions",
              description: "החזר את רשימת השאלות שנוצרו",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    minItems: data.count,
                    maxItems: data.count,
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        choices: {
                          type: "array",
                          minItems: 4,
                          maxItems: 4,
                          items: { type: "string" },
                        },
                        correct_index: { type: "integer", minimum: 0, maximum: 3 },
                      },
                      required: ["question", "choices", "correct_index"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["questions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_questions" } },
      }),
    });

    if (response.status === 429) throw new Error("החרגת מכסה זמנית — נסה שוב בעוד רגע");
    if (response.status === 402) throw new Error("נדרש קרדיט ב־Lovable AI");
    if (!response.ok) {
      const t = await response.text().catch(() => "");
      throw new Error(`AI request failed: ${response.status} ${t.slice(0, 200)}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{
        message?: {
          tool_calls?: Array<{ function?: { arguments?: string } }>;
        };
      }>;
    };
    const argsStr = payload.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!argsStr) throw new Error("תשובת ה־AI לא הכילה שאלות");

    let parsed: { questions: GeneratedQuestion[] };
    try {
      parsed = JSON.parse(argsStr);
    } catch {
      throw new Error("תשובת ה־AI לא בפורמט תקין");
    }

    const clean = parsed.questions
      .filter(
        (q) =>
          q &&
          typeof q.question === "string" &&
          Array.isArray(q.choices) &&
          q.choices.length === 4 &&
          q.choices.every((c) => typeof c === "string" && c.trim().length > 0) &&
          Number.isInteger(q.correct_index) &&
          q.correct_index >= 0 &&
          q.correct_index <= 3,
      )
      .slice(0, data.count);

    if (clean.length < Math.min(5, data.count)) {
      throw new Error("ה־AI לא הצליח לייצר מספיק שאלות תקינות — נסה נושא אחר");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const rows = clean.map((q) => ({
      question: q.question.trim(),
      choices: q.choices.map((c) => c.trim()),
      correct_index: q.correct_index,
      difficulty: (data.difficulty === "mixed" ? "medium" : data.difficulty) as
        | "easy"
        | "medium"
        | "hard",
      type: "multiple_choice" as const,
      approved: true,
      is_bonus: false,
      created_by: context.userId,
    }));

    const { data: inserted, error } = await supabaseAdmin
      .from("questions")
      .insert(rows)
      .select("id");
    if (error) throw new Error(error.message);

    return { question_ids: (inserted ?? []).map((r) => r.id) };
  });
