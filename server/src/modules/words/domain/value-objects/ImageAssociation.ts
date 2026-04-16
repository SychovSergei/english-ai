export type ImageAssociationProps = {
  url: string;
  description?: string;
};

export class ImageAssociation {
  private constructor(
    public readonly url: string,
    public readonly description?: string,
  ) {
    // if (!url) throw new Error('Image URL is required');
  }

  public static create(props: ImageAssociationProps): ImageAssociation {
    return new ImageAssociation(props.url, props.description);
  }
}
