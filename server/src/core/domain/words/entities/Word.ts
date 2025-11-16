import { ELangs } from '@core/domain/enums';
import { ImageAssociation } from '@core/domain/words/value-objects/ImageAssociation';
import { Translation } from '@core/domain/words/value-objects/Translation';

export class Word {
  constructor(
    public readonly id: string,
    public readonly text: string,

    public owner: string,
    public language: ELangs,
    public translations: Translation[],

    public isPublic: boolean,
    public relatedForms: string[],
    public sentenceIndexes: string[],
    public image?: ImageAssociation,
  ) {}

  addTranslation(translation: Translation): void {
    this.translations.push(translation);
  }

  addExample(index: string) {
    this.sentenceIndexes.push(index);
  }

  setImage(image: ImageAssociation): void {
    this.image = image;
  }
}
