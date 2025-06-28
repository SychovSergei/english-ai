import { Types } from 'mongoose';

import { Word } from '@core/domain/entities';
import { WordDbDto } from '@core/domain/entities/word';
import { CreateWordDto, UpdateWordDto } from '@core/domain/entities/word/types/create-word.dto';
import { CreateWordSetWordDto, WordSetWordItem } from '@core/domain/entities/word-set/types/create-word-set.dto';
import { ELangs, ELevels, ELexicalCategory } from '@core/domain/enums';

/**
 * Interface for mapping between different representations of a Word entity:
 * domain model, database DTOs, and creation/update DTOs.
 */
interface WordMapper {
  /**
   * Maps a full create DTO to a domain Word object.
   *
   * @param dto - The full DTO containing complete word information (text, translations, etc.).
   * @param ownerId - The ID of the user who owns the word.
   * @returns The corresponding domain Word object.
   */
  toDomainFromCreateFull(dto: CreateWordDto, ownerId: string): Word;

  /**
   * Maps a simplified word item (e.g. from UI) to a domain Word object.
   *
   * @param dto - A basic or minimal representation of a word.
   * @param ownerId - The ID of the user who owns the word.
   * @returns The corresponding domain Word object.
   */
  toDomainFromCreateBasic(dto: WordSetWordItem, ownerId: string): Word;

  /**
   * Maps an update DTO to a domain Word object.
   *
   * @param dto - The DTO containing updated values for the word.
   * @param ownerId - The ID of the user who owns the word.
   * @returns The updated domain Word object.
   */
  toDomainFromUpdate(dto: UpdateWordDto, ownerId: string): Word;

  /**
   * Maps a domain-level Word object to a database DTO (WordDbDto).
   * Converts string IDs into MongoDB ObjectIds.
   *
   * @param domain - The domain Word object to convert.
   * @returns The corresponding WordDto For database operations.
   */
  toEntity(domain: Word): WordDbDto;

  /**
   * Converts a database DTO (retrieved from MongoDB) into a domain Word object.
   *
   * @param entity - The WordDbDto object from the database.
   * @returns The corresponding domain Word object.
   */
  fromEntityToDomain(entity: WordDbDto): Word;
}

export const WordMapper: WordMapper = {
  toDomainFromCreateFull(dto: CreateWordDto, ownerId: string): Word {
    return {
      owner: ownerId,
      text: dto.text,
      language: dto.language,
      relatedForms: dto.relatedForms ?? [],
      sentences: dto.sentences ?? [],
      isPublic: false,
      translations: dto.translations.map((t) => ({
        text: t.text,
        language: t.language,
        description: t.description || 'empty',
        difficultyLevel: t.difficultyLevel,
        lexicalCategory: t.lexicalCategory,
      })),
    };
  },

  toDomainFromUpdate(dto: UpdateWordDto, ownerId: string): Word {
    return {
      owner: ownerId,
      text: dto.text,
      language: dto.language,
      relatedForms: dto.relatedForms ?? [],
      sentences: dto.sentences ?? [],
      isPublic: false,
      translations: dto.translations.map((t) => ({
        id: t.id,
        text: t.text,
        language: t.language,
        description: t.description || 'empty',
        difficultyLevel: t.difficultyLevel,
        lexicalCategory: t.lexicalCategory,
      })),
    };
  },

  toEntity(domain: Word): WordDbDto {
    if (!domain.owner) throw new Error('Owner is required');

    return {
      _id: domain.id ? new Types.ObjectId(domain.id) : undefined,
      text: domain.text,
      owner: new Types.ObjectId(domain.owner),
      isPublic: domain.isPublic,
      language: domain.language,
      sentences: domain.sentences.map((id) => new Types.ObjectId(id)) ?? [],
      relatedForms: domain.relatedForms,
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

  // const updatedTranslations = translations.map((translation) => {
  //   return translation.id
  //     ? translation
  //     : {
  //       ...translation,
  //       id: new Types.ObjectId(),
  //     };
  // });

  toDomainFromCreateBasic(dto: WordSetWordItem, ownerId: string): Word {
    return {
      owner: ownerId,
      text: dto.term,
      language: ELangs.EN, // или определить явно в параметре
      translations: [
        {
          text: dto.definition,
          language: ELangs.RU, // например
          description: '',
          difficultyLevel: ELevels.Empty,
          lexicalCategory: ELexicalCategory.Empty,
        },
      ],
      relatedForms: [],
      sentences: [],
      isPublic: false,
    };
  },

  // toDomainFromUpdateBasic(dto: UpdateWordSetWordDto, ownerId: string): Word {
  //   return {
  //     owner: ownerId,
  //     text: dto.term,
  //     language: ELangs.EN, // или определить явно в параметре
  //     translations: [
  //       {
  //         text: dto.definition,
  //         language: ELangs.RU, // например
  //         description: '',
  //         difficultyLevel: ELevels.Empty,
  //         lexicalCategory: ELexicalCategory.Empty,
  //       },
  //     ],
  //     relatedForms: [],
  //     sentences: [],
  //     isPublic: false,
  //   };
  // },

  fromEntityToDomain(entity: WordDbDto): Word {
    console.log('Mapper fromEntityToDomain() ', entity);
    return {
      id: entity._id?.toString(),
      text: entity.text,
      owner: entity.owner.toString(),
      isPublic: entity.isPublic,
      language: entity.language,
      sentences: entity.sentences.map((s) => s.toString()) ?? [],
      relatedForms: entity.relatedForms ?? [],
      translations: entity.translations.map((t) => ({
        id: t._id?.toString(),
        text: t.text,
        description: t.description ?? '',
        language: t.language,
        difficultyLevel: t.difficultyLevel,
        lexicalCategory: t.lexicalCategory,
      })),
    };
  },
};
