/**
 * Defines user roles in the system.
 *
 * - `Admin`: Has full access to the system, can manage users and settings.
 * - `Teacher`: Can manage courses and students.
 * - `Student`: Can access learning materials and participate in courses.
 */
export enum EUserRole {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
}
