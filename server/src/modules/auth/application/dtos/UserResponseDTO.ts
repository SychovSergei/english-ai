export interface UserResponseDTO {
  id: string;
  email: string;
  fullName: string; // В базе этого поля нет, мы его вычисляем для фронтенда
  role: string;
}
