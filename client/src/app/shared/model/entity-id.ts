export abstract class EntityId {
  protected constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Id cannot be empty');
    }
    if (value.includes('-')) {
      throw new Error(`ID "${value}" cannot contain hyphens. Ensure it is a compact UUID.`);
    }
  }

  equals(other: EntityId): boolean {
    return this.value === other.value;
  }
}
