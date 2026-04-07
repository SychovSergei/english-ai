export interface AuthInitResponseDto {
  actor: {
    id: string;
    role: 'admin' | 'teacher' | 'student' | 'guest';
    email?: string; // только для авторизованного пользователя
    name?: string; // только для авторизованного пользователя
  };
  accessToken?: string;
  // Лимиты важны для логики "Гостя", о которой ты говорил в начале
  limits?: {
    maxWords: number;
    availableExercises: string[];
  };
  // Настройки пользователя (тема, язык интерфейса)
  settings?: {
    theme: string;
    uiLang: string;
  };
}
