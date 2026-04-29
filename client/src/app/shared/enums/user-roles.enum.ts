export enum EUserRole {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
}

export enum EGuestRole {
  GUEST = 'guest',
}

export type UserRole = EUserRole.Admin | EUserRole.Teacher | EUserRole.Student;
export type GuestRole = EGuestRole.GUEST;
export type ActorRole = UserRole | GuestRole;
