export interface UpdateWordRequestDTO {
  value?: string;
  isPublic: boolean;

  translations?: Array<{
    id: string;
    value?: string;
    description?: string;
    difficultyLevel?: string;
    lexicalCategory?: string;
  }>;
}
