export class PasswordHash {
  private constructor(public readonly value: string) {}

  // static async create(rawPassword: string, hasher: PasswordHasher): Promise<PasswordHash> {
  //   if (rawPassword.length < 8) {
  //     throw new Error('Password must be at least 8 characters long');
  //   }
  //
  //   const hashed = await hasher.hash(rawPassword);
  //   if (!hashed || hashed.length < 20) {
  //     throw new Error('Invalid password hash');
  //   }
  //
  //   return new PasswordHash(hashed);
  // }

  // Используется маппером (восстанавливаем из БД)
  static fromValue(hash: string): PasswordHash {
    return new PasswordHash(hash);
  }

  /**
   * Этот метод мы используем ВНУТРИ слоя Domain (например, в UseCase),
   * когда мы ТОЧНО знаем, что строка уже захеширована техническим сервисом.
   */
  static fromHash(hashedValue: string): PasswordHash {
    if (!hashedValue || hashedValue.length < 20) {
      throw new Error('Invalid hash format');
    }
    return new PasswordHash(hashedValue);
  }

  public equals(otherHash: PasswordHash): boolean {
    return this.value === otherHash.value;
  }
}
