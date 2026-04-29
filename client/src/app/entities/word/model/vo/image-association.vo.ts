export class ImageAssociation {
  constructor(
    public readonly url: string,
    public readonly description?: string,
  ) {
    if (!url) {
      // TODO throw new Error('Image URL is required');
    }
  }
}
