
UPDATE categories SET name='ידע כללי' WHERE slug='general';
UPDATE categories SET name='מדע' WHERE slug='science';
UPDATE categories SET name='היסטוריה' WHERE slug='history';
UPDATE categories SET name='גיאוגרפיה' WHERE slug='geography';
UPDATE categories SET name='סרטים' WHERE slug='movies';
UPDATE categories SET name='ספורט' WHERE slug='sports';
UPDATE categories SET name='מוזיקה' WHERE slug='music';
UPDATE categories SET name='טכנולוגיה' WHERE slug='technology';

UPDATE achievements SET name='ניצחון ראשון', description='נצח במשחק הראשון שלך' WHERE code='first_win';
UPDATE achievements SET name='משחק מושלם', description='ענה נכון על כל השאלות' WHERE code='perfect_game';
UPDATE achievements SET name='מאה', description='ענה נכון על 100 שאלות' WHERE code='hundred_correct';
UPDATE achievements SET name='אלוף', description='נצח ב-10 משחקים' WHERE code='ten_wins';
UPDATE achievements SET name='מרתונאי', description='שחק 50 משחקים' WHERE code='fifty_games';
UPDATE achievements SET name='אמן טריוויה', description='הגע ל-1000 נקודות' WHERE code='trivia_master';
UPDATE achievements SET name='אלוף המהירות', description='ממוצע פחות מ-3 שניות לתשובה נכונה' WHERE code='speed_champion';
UPDATE achievements SET name='על האש', description='רצף של 5 תשובות נכונות' WHERE code='streak_5';

UPDATE questions SET question='איזה צבע מתקבל מערבוב אדום וכחול?', choices='["ירוק","סגול","כתום","צהוב"]'::jsonb WHERE id='090491b4-7890-44d6-90b8-673ce3f7e545';
UPDATE questions SET question='בשנה מעוברת יש 366 ימים.', choices='["נכון","לא נכון"]'::jsonb WHERE id='1e49fcda-753c-466e-99c3-ea3df2543293';
UPDATE questions SET question='מהו הבניין הגבוה בעולם (נכון ל-2024)?', choices='["מגדל שנחאי","בורג׳ ח׳ליפה","מרדקה 118","וואן וורלד טרייד"]'::jsonb WHERE id='54b3f1e5-16b8-4bf9-9062-1644df58ed14';
UPDATE questions SET question='כמה צלעות יש למשושה?', choices='["5","6","7","8"]'::jsonb WHERE id='64b6da2c-38ac-418c-894b-65392a5b8424';
UPDATE questions SET question='כמה יבשות יש?', choices='["5","6","7","8"]'::jsonb WHERE id='99a32209-6f2c-4e1f-8d98-c87855714c2c';
UPDATE questions SET question='מהו המטבע של יפן?', choices='["יואן","ין","וון","רינגיט"]'::jsonb WHERE id='a01ee0f3-313b-4b86-9e59-f8be8712f95b';
UPDATE questions SET question='כמה עצמות יש בגוף האדם הבוגר?', choices='["196","206","216","226"]'::jsonb WHERE id='afe41ae4-839a-4c12-a5f3-216a030a5f7e';
UPDATE questions SET question='מהי המדינה הקטנה בעולם?', choices='["מונקו","קריית הוותיקן","סן מרינו","ליכטנשטיין"]'::jsonb WHERE id='cb3ae1a6-a5c8-4767-9ae0-39be6731c7db';
UPDATE questions SET question='השמש זורחת במזרח.', choices='["נכון","לא נכון"]'::jsonb WHERE id='d9433919-40ba-47d8-8647-093c9d6e66fc';
UPDATE questions SET question='לאיזו שפה יש הכי הרבה דוברים ילידיים?', choices='["אנגלית","ספרדית","מנדרינית","הינדי"]'::jsonb WHERE id='ff15d5de-af2c-4654-aa95-8ca1c99205d4';

UPDATE questions SET question='מהו הנהר הארוך בעולם?', choices='["אמזונס","נילוס","יאנגצה","מיסיסיפי"]'::jsonb WHERE id='28eef3df-63f3-4a40-92ce-a16f98d20ef2';
UPDATE questions SET question='אוסטרליה היא גם מדינה וגם יבשת.', choices='["נכון","לא נכון"]'::jsonb WHERE id='30db8c74-0087-40b6-8078-9e91b065faf1';
UPDATE questions SET question='איזו מדינה אפריקאית נקראה בעבר חבש?', choices='["אתיופיה","סודן","סומליה","אריתריאה"]'::jsonb WHERE id='36283e9a-def5-4fdd-b7a1-47407ea70cb1';
UPDATE questions SET question='מהי תעלת האוקיינוס העמוקה ביותר?', choices='["פוארטו ריקו","ג׳אווה","מריאנה","טונגה"]'::jsonb WHERE id='5505455b-844b-45ec-9192-b2fa7f2ac0fb';
UPDATE questions SET question='לאיזו מדינה הכי הרבה אזורי זמן?', choices='["רוסיה","ארה״ב","סין","צרפת"]'::jsonb WHERE id='9f9a2ef7-8900-4584-bc6b-ba468da8bc63';
UPDATE questions SET question='איזה מדבר הוא המדבר החם הגדול ביותר?', choices='["גובי","קלהארי","סהרה","ערב"]'::jsonb WHERE id='b6916b7c-b99a-437f-8716-6d261d651396';
UPDATE questions SET question='מהי בירת צרפת?', choices='["ברלין","מדריד","פריז","רומא"]'::jsonb WHERE id='d2553384-2d11-417e-acff-baa8b2dcdea6';
UPDATE questions SET question='הר האוורסט נמצא על גבול נפאל ו…?', choices='["הודו","סין","בוטאן","פקיסטן"]'::jsonb WHERE id='fcc41717-e2a9-479b-84a0-451ef5a25174';

UPDATE questions SET question='איזה פלא עולם עתיק שכן במצרים?', choices='["הקולוסוס","הפירמידה הגדולה","הגנים התלויים","מגדלור רודוס"]'::jsonb WHERE id='014ad565-3d62-4ddf-8c13-12d0df8ea797';
UPDATE questions SET question='מי היה הנשיא הראשון של ארה״ב?', choices='["לינקולן","ג׳פרסון","וושינגטון","אדמס"]'::jsonb WHERE id='182ec898-1e8c-445c-bfb0-aea9ea21b45d';
UPDATE questions SET question='מי הייתה הפרעונית האחרונה של מצרים?', choices='["נפרטיטי","חתשפסות","קליאופטרה השביעית","רעמסס השני"]'::jsonb WHERE id='4a522c11-b4ff-4c07-acab-5e44225320ff';
UPDATE questions SET question='איזו אימפריה בנתה את מאצ׳ו פיצ׳ו?', choices='["אצטקים","מאיה","אינקה","אולמקים"]'::jsonb WHERE id='4dd937b4-a7c4-46ef-b87e-f0a3683ac2d2';
UPDATE questions SET question='באיזו שנה שקעה הטיטאניק?', choices='["1905","1912","1918","1923"]'::jsonb WHERE id='7d0a8a86-17a8-451b-ae33-8ccc835c7fc6';
UPDATE questions SET question='מלחמת העולם השנייה הסתיימה ב-1945.', choices='["נכון","לא נכון"]'::jsonb WHERE id='80d85e5f-c7b8-4044-bdac-256e35dbddd1';
UPDATE questions SET question='מי צייר את תקרת הקפלה הסיסטינית?', choices='["דה וינצ׳י","רפאל","מיכלאנג׳לו","דונטלו"]'::jsonb WHERE id='e3d93b43-49d4-4731-84f2-df3acc87c890';
UPDATE questions SET question='באיזו שנה נפלה חומת ברלין?', choices='["1987","1989","1991","1993"]'::jsonb WHERE id='e79933f9-6854-4b62-b472-383bd1ef0a9b';

UPDATE questions SET question='מי ביים את "פאלפ פיקשן"?', choices='["טרנטינו","סקורסזה","פינצ׳ר","האחים כהן"]'::jsonb WHERE id='485791c8-ab86-42a0-8c40-ede0aa7ccf88';
UPDATE questions SET question='איזה אולפן הפיק את "צעצוע של סיפור"?', choices='["דרימוורקס","פיקסאר","דיסני","אילומינייטד"]'::jsonb WHERE id='4f5e55ea-7a63-45be-823e-eb58bd8ba62c';
UPDATE questions SET question='מי גילם את ג׳ק ב"טיטאניק"?', choices='["בראד פיט","לאונרדו דיקפריו","מאט דיימון","טום קרוז"]'::jsonb WHERE id='5217fa46-4c66-4c08-9554-a84ffd2ece89';
UPDATE questions SET question='מי ביים את "פארק היורה" (1993)?', choices='["ספילברג","קמרון","נולאן","סקורסזה"]'::jsonb WHERE id='747f17d4-ac7e-4a0e-9a6d-6d461ce86a23';
UPDATE questions SET question='באיזו שנה יצא "הסנדק"?', choices='["1970","1972","1974","1976"]'::jsonb WHERE id='7a6eb57f-516f-443f-973c-b8a42d7125e4';
UPDATE questions SET question='ב"לשבור את הקרח", מה שם אחותה של אלסה?', choices='["אנה","אריאל","אורורה","אליס"]'::jsonb WHERE id='80e7a875-304f-49e1-84c5-62fdb546d2d3';
UPDATE questions SET question='מהו הסרט המכניס ביותר בכל הזמנים?', choices='["הנוקמים: סוף המשחק","אווטאר","טיטאניק","מלחמת הכוכבים 7"]'::jsonb WHERE id='9fd2ade1-97a7-4ed9-8c26-be7e7476dd78';
UPDATE questions SET question='"טיטאניק" זכה באוסקר לסרט הטוב ביותר.', choices='["נכון","לא נכון"]'::jsonb WHERE id='d78390c3-e302-45a8-a20b-d48ac33e839f';

UPDATE questions SET question='כמה מיתרים יש לגיטרה סטנדרטית?', choices='["4","5","6","7"]'::jsonb WHERE id='1d5bbbc7-256d-4112-8882-3bb1dd2bba59';
UPDATE questions SET question='באיזה סולם כתובה ה"רקוויאם" של מוצרט?', choices='["רה מינור","דו מז׳ור","לה מינור","סול מז׳ור"]'::jsonb WHERE id='3641712f-2345-48d7-8d97-984f9facc93e';
UPDATE questions SET question='איזו להקה הוציאה את "בוהמיאן ראפסודי"?', choices='["הביטלס","קווין","לד זפלין","פינק פלויד"]'::jsonb WHERE id='63a67c5c-505a-4c2f-b4f4-c6196a054475';
UPDATE questions SET question='בפסנתר יש 88 קלידים.', choices='["נכון","לא נכון"]'::jsonb WHERE id='81f10f0e-8166-4276-aae3-282a4b57b8ad';
UPDATE questions SET question='בטהובן נולד באיזו מדינה?', choices='["אוסטריה","גרמניה","צרפת","איטליה"]'::jsonb WHERE id='eafd4781-6508-4679-ba4d-9eeb14a0215f';

UPDATE questions SET question='איזה חלקיק חסר מטען חשמלי?', choices='["פרוטון","אלקטרון","נייטרון","פוזיטרון"]'::jsonb WHERE id='02ab5cdb-57c9-46e1-ad07-950899e3d10a';
UPDATE questions SET question='מהו החומר הטבעי הקשה ביותר?', choices='["פלדה","ברזל","יהלום","קוורץ"]'::jsonb WHERE id='09a17404-555d-4fe8-958f-f570182186b8';
UPDATE questions SET question='איזה כוכב לכת מכונה "הכוכב האדום"?', choices='["נוגה","מאדים","צדק","כוכב חמה"]'::jsonb WHERE id='3044942b-5281-44d7-abb0-73ee23a187ba';
UPDATE questions SET question='מהי מהירות האור בוואקום (בקירוב)?', choices='["300,000 קמ״ש","150,000 קמ״ש","1,000,000 קמ״ש","30,000 קמ״ש"]'::jsonb WHERE id='6fc04e3f-3ca4-46a4-ab38-bbd07f152f90';
UPDATE questions SET question='ברק חם יותר מפני השמש.', choices='["נכון","לא נכון"]'::jsonb WHERE id='7bd436a7-c8c0-4b60-bae8-41c0dd08c26f';
UPDATE questions SET question='מהו הגז הנפוץ ביותר באטמוספירת כדור הארץ?', choices='["חמצן","מימן","חנקן","ארגון"]'::jsonb WHERE id='8e3ad234-923b-41c7-a103-9719b5778638';
UPDATE questions SET question='מים רותחים ב-100°C בגובה פני הים.', choices='["נכון","לא נכון"]'::jsonb WHERE id='ac67021d-0265-4f7d-9100-64324fc5e2d6';
UPDATE questions SET question='כמה חדרים יש בלב האדם?', choices='["2","3","4","5"]'::jsonb WHERE id='af7b3b66-fd84-4201-92a0-2e31f0b36f71';
UPDATE questions SET question='מהו הסמל הכימי לזהב?', choices='["Go","Gd","Au","Ag"]'::jsonb WHERE id='ebbb77d7-7803-40d4-9da2-8c32abf5e091';
UPDATE questions SET question='איזה גז צמחים סופגים מהאטמוספירה?', choices='["חמצן","חנקן","פחמן דו־חמצני","מימן"]'::jsonb WHERE id='f5d56902-e94a-4ac1-b4d6-6d803035380b';

UPDATE questions SET question='מי מחזיק בשיא הגראנד סלאם היחידים (גברים, 2024)?', choices='["פדרר","נדאל","ג׳וקוביץ׳","סמפרס"]'::jsonb WHERE id='45af3921-894d-4849-ad59-01e7052c0c5e';
UPDATE questions SET question='איזו מדינה אירחה את אולימפיאדת הקיץ 2016?', choices='["סין","בריטניה","ברזיל","יפן"]'::jsonb WHERE id='71563f72-6dbf-4b47-b63d-11103ed5da37';
UPDATE questions SET question='מייקל ג׳ורדן שיחק בייסבול מקצועני.', choices='["נכון","לא נכון"]'::jsonb WHERE id='a2f13c1c-d1da-45e1-9389-3fc557c9e117';
UPDATE questions SET question='כמה שחקנים יש בקבוצת כדורגל על המגרש?', choices='["9","10","11","12"]'::jsonb WHERE id='b6959d8c-6361-4faa-9129-5501d998fa5e';
UPDATE questions SET question='בטניס, איזו תוצאה באה אחרי 30?', choices='["35","40","45","דיוס"]'::jsonb WHERE id='c79918f4-114b-4df4-9c41-42bcf19fbe7b';
UPDATE questions SET question='איזה ענף ספורט משוחק בווימבלדון?', choices='["גולף","קריקט","טניס","רוגבי"]'::jsonb WHERE id='e75d4729-ed1d-489e-a75f-5556c8d2baaa';

UPDATE questions SET question='HTML היא שפת תכנות.', choices='["נכון","לא נכון"]'::jsonb WHERE id='01530c44-a481-4b34-b892-bdf894ba40eb';
UPDATE questions SET question='ראשי התיבות "CPU" הם…?', choices='["Central Processing Unit","Computer Personal Unit","Central Program Utility","Core Processor Unit"]'::jsonb WHERE id='1c0cccdc-bf0d-4877-a1ad-419c27e773eb';
UPDATE questions SET question='ראשי התיבות "SQL" הם…?', choices='["Structured Query Language","Simple Query Language","Server Query Logic","System Query Layer"]'::jsonb WHERE id='4f529e40-ec0e-44c1-ba5d-2547c5d9bb56';
UPDATE questions SET question='מי נחשב לאבי מדעי המחשב?', choices='["אלן טיורינג","ג׳ון פון נוימן","עדה לאבלייס","צ׳ארלס באבג׳"]'::jsonb WHERE id='6909e050-8620-4f5b-b20b-3ec9dc5e1b86';
UPDATE questions SET question='מי ייסד את אפל יחד עם סטיב ג׳ובס?', choices='["ביל גייטס","סטיב ווזניאק","אילון מאסק","לארי פייג׳"]'::jsonb WHERE id='a164f00d-a26b-473b-bf4b-dafecefda59c';
UPDATE questions SET question='באיזו שנה יצא האייפון הראשון?', choices='["2005","2007","2009","2011"]'::jsonb WHERE id='b3d1f230-be10-4c74-b18a-b15a1ab99527';
UPDATE questions SET question='איזו חברה יצרה את מערכת ההפעלה אנדרואיד?', choices='["אפל","מיקרוסופט","גוגל","סמסונג"]'::jsonb WHERE id='b5fd1c35-1d8a-4d3b-8e69-3766c098a5cf';
