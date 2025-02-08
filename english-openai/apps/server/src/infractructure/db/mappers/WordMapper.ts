import { Word } from "../../../core/entities/Word/word-schema";

interface DbMapper<D, E> {
  toDomain(entity: E): D;
  toEntity(domainModel: E): D;
}

export class WordMapper implements DbMapper<Word, any> {
  public static toDomain(entity: any): Word {
    return {} as Word;
  }

  public static toEntity(domainModel: any) {
    console.log("");
  }
}
