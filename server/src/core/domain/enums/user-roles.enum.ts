/**
 * Defines user roles in the system.
 *
 * - `Admin`: Has full access to the system, can manage users and settings.
 * - `Teacher`: Can manage courses and students.
 * - `Student`: Can access learning materials and participate in courses.
 */
export enum EUserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  // GUEST = 'guest',
}
export enum EGuestRole {
  GUEST = 'guest',
}

export type UserRole = EUserRole;
export type GuestRole = EGuestRole;
export type ActorRole = UserRole | GuestRole;
