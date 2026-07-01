export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string
          description: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          description: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          description?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      answers: {
        Row: {
          answered_at: string
          id: string
          is_correct: boolean
          points_earned: number
          question_id: string
          response_time_ms: number
          room_id: string
          selected_index: number | null
          user_id: string
        }
        Insert: {
          answered_at?: string
          id?: string
          is_correct?: boolean
          points_earned?: number
          question_id: string
          response_time_ms?: number
          room_id: string
          selected_index?: number | null
          user_id: string
        }
        Update: {
          answered_at?: string
          id?: string
          is_correct?: boolean
          points_earned?: number
          question_id?: string
          response_time_ms?: number
          room_id?: string
          selected_index?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      game_players: {
        Row: {
          correct_count: number
          id: string
          joined_at: string
          room_id: string
          score: number
          user_id: string
          wrong_count: number
        }
        Insert: {
          correct_count?: number
          id?: string
          joined_at?: string
          room_id: string
          score?: number
          user_id: string
          wrong_count?: number
        }
        Update: {
          correct_count?: number
          id?: string
          joined_at?: string
          room_id?: string
          score?: number
          user_id?: string
          wrong_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rooms: {
        Row: {
          category_id: string | null
          code: string
          created_at: string
          current_question: number
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          host_id: string
          id: string
          is_solo: boolean
          max_players: number
          question_count: number
          question_ids: string[] | null
          question_started_at: string | null
          status: Database["public"]["Enums"]["room_status"]
          time_per_question: number
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          code: string
          created_at?: string
          current_question?: number
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          host_id: string
          id?: string
          is_solo?: boolean
          max_players?: number
          question_count?: number
          question_ids?: string[] | null
          question_started_at?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          time_per_question?: number
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          code?: string
          created_at?: string
          current_question?: number
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          host_id?: string
          id?: string
          is_solo?: boolean
          max_players?: number
          question_count?: number
          question_ids?: string[] | null
          question_started_at?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          time_per_question?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_rooms_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          best_score: number
          correct_answers: number
          created_at: string
          games_played: number
          games_won: number
          id: string
          longest_streak: number
          total_points: number
          updated_at: string
          username: string
          wrong_answers: number
        }
        Insert: {
          avatar_url?: string | null
          best_score?: number
          correct_answers?: number
          created_at?: string
          games_played?: number
          games_won?: number
          id: string
          longest_streak?: number
          total_points?: number
          updated_at?: string
          username: string
          wrong_answers?: number
        }
        Update: {
          avatar_url?: string | null
          best_score?: number
          correct_answers?: number
          created_at?: string
          games_played?: number
          games_won?: number
          id?: string
          longest_streak?: number
          total_points?: number
          updated_at?: string
          username?: string
          wrong_answers?: number
        }
        Relationships: []
      }
      questions: {
        Row: {
          approved: boolean
          category_id: string
          choices: Json
          correct_index: number
          created_at: string
          created_by: string | null
          difficulty: Database["public"]["Enums"]["difficulty"]
          id: string
          image_url: string | null
          is_bonus: boolean
          question: string
          type: Database["public"]["Enums"]["question_type"]
        }
        Insert: {
          approved?: boolean
          category_id: string
          choices: Json
          correct_index: number
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"]
          id?: string
          image_url?: string | null
          is_bonus?: boolean
          question: string
          type?: Database["public"]["Enums"]["question_type"]
        }
        Update: {
          approved?: boolean
          category_id?: string
          choices?: Json
          correct_index?: number
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"]
          id?: string
          image_url?: string | null
          is_bonus?: boolean
          question?: string
          type?: Database["public"]["Enums"]["question_type"]
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      difficulty: "easy" | "medium" | "hard"
      question_type: "multiple_choice" | "true_false"
      room_status: "waiting" | "in_progress" | "finished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      difficulty: ["easy", "medium", "hard"],
      question_type: ["multiple_choice", "true_false"],
      room_status: ["waiting", "in_progress", "finished"],
    },
  },
} as const
