import { EWordSetVisibility } from '@entities/word-set';
import { ELangs } from '@shared/enums';

export type WordSetSettingsProps = {
  readonly visibility: EWordSetVisibility;
  readonly language: ELangs;
  readonly allowCopy: boolean;
  readonly passwordHash?: string;
};

export class WordSetSettings {
  visibility: EWordSetVisibility;
  language: ELangs;
  allowCopy: boolean;
  passwordHash?: string;

  private constructor(props: WordSetSettingsProps) {
    this.visibility = props.visibility;
    this.language = props.language;
    this.allowCopy = props.allowCopy;
    this.passwordHash = props.passwordHash;
  }

  static create(props: WordSetSettingsProps): WordSetSettings {
    return new WordSetSettings(props);
  }

  static restore(settings: WordSetSettings): WordSetSettings {
    return new WordSetSettings(settings);
  }
}
