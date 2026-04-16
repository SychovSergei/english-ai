interface ValueObjectProps {
  [key: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props); // объект неизменяем
  }

  public equals(vo: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false;
    if (vo.props === undefined) return false;

    //TODO use lodash or deep-equal lib
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
