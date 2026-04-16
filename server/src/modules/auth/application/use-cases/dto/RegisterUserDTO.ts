export interface RegisterUserDTO {
  email: string;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
}
export interface RegisterResponseDTO {
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
}
