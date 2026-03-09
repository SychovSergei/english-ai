import { Types } from 'mongoose';

import { Word } from 'app-old/core/domain/entities';
import { WordDbDto } from 'app-old/core/domain/entities/word';
import { CreateWordDto } from 'app-old/core/domain/entities/word/types/word.dto';

// /**
//  * Interface for mapping between different representations of a Word entity:
//  * domain model, database DTOs, and creation/update DTOs.
//  */
// interface WordDbMapper {
//   /**
//    * Maps a domain-level Word object to a database DTO (WordDbDto).
//    * Converts string IDs into MongoDB ObjectIds.
//    *
//    * @param domain - The domain Word object to convert.
//    * @returns The corresponding WordDto For database operations.
//    */
//   toEntity(domain: Word): WordDbDto;
// }
// : WordDbMapper
export const WordDbMapper = {
  toEntity(domain: Word): WordDbDto {
    if (!domain.owner) throw new Error('Owner is required');

    return {
      _id: domain.id ? new Types.ObjectId(domain.id) : undefined,
      text: domain.text,
      owner: new Types.ObjectId(domain.owner),
      isPublic: domain.isPublic,
      language: domain.language,
      sentences: domain.sentences?.map((id) => new Types.ObjectId(id)) ?? [],
      relatedForms: domain.relatedForms ?? [],
      translations: domain.translations.map((t) => ({
        _id: t.id ? new Types.ObjectId(t.id) : new Types.ObjectId(),
        text: t.text,
        description: t.description ?? '',
        language: t.language,
        difficultyLevel: t.difficultyLevel,
        lexicalCategory: t.lexicalCategory,
      })),
    };
  },

  toCreateWordEntity(dto: CreateWordDto, userId: string): WordDbDto {
    return {
      // _id: new Types.ObjectId(),
      text: dto.text,
      owner: new Types.ObjectId(userId),
      isPublic: false,
      language: dto.language,
      sentences: dto.sentences?.map((id: string) => new Types.ObjectId(id)) ?? [],
      relatedForms: dto.relatedForms ?? [],
      translations: dto.translations.map((t) => ({
        // _id: t.id ? new Types.ObjectId(t.id) : new Types.ObjectId(),
        _id: new Types.ObjectId(),
        text: t.text,
        description: t.description ?? '',
        language: t.language,
        difficultyLevel: t.difficultyLevel,
        lexicalCategory: t.lexicalCategory,
      })),
    };
  },
};
