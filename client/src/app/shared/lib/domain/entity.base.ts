export abstract class EntityBase<TId, TProps> {
  protected constructor(
    public readonly id: TId,
    protected props: TProps,
  ) {}

  // Getter for getting a copy of props (for using in mappings)
  public getProps(): TProps {
    return Object.freeze({ ...this.props });
  }
}
