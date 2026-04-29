/**
 * Enum representing the visibility level of a word set.
 *
 * - `Public`: The word set is visible to everyone.
 * - `Password`: The word set is protected and requires a password to access.
 * - `Private`: The word set is only visible to the owner.
 */
export enum EWordSetVisibility {
  Public = 'public',
  Password = 'password',
  Private = 'private',
}
