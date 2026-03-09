import { Types } from 'mongoose';

import { WordSet } from 'app-old/core/domain/entities';
import { CreateWordSetDto } from 'app-old/core/domain/entities/word-set/types/create-word-set.dto';
import { WordSetDbDto } from 'app-old/core/domain/entities/word-set/types/word-set-db.dto';

interface IWordSetMapper {
  toDomainFromCreate(dto: CreateWordSetDto, ownerId: string, words: string[]): WordSet;
  toEntity(domain: WordSet): WordSetDbDto;
  fromEntityToDomain(entity: WordSetDbDto): WordSet;
}

export const WordSetMapper: IWordSetMapper = {
  //// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  /** toDomain(dto) */
  toDomainFromCreate(dto: CreateWordSetDto, ownerId: string, words: string[]): WordSet {
    return {
      ownerId: ownerId,
      title: dto.title,
      description: dto.description,
      settings: {
        language: dto.settings.language,
        allowCopy: dto.settings.allowCopy,
        visibility: dto.settings.visibility,
        passwordHash: dto.settings.passwordHash,
      },
      words: words,
    };
  },

  /** toEntity(domainModel) // Превратили в данные для базы */
  // TODO toEntity(word: WordSet): WordSetDbDto
  toEntity(domain: WordSet): WordSetDbDto {
    return {
      _id: domain.id ? new Types.ObjectId(domain.id) : undefined,
      ownerId: new Types.ObjectId(domain.ownerId),
      title: domain.title,
      description: domain.description ?? '',
      settings: {
        allowCopy: domain.settings.allowCopy, // TODO destructure
        language: domain.settings.language,
        visibility: domain.settings.visibility,
        passwordHash: domain.settings.passwordHash,
      },
      words: domain.words, //?.map((id) => new Types.ObjectId(id)) ?? [],
    };
  },

  fromEntityToDomain(entity: WordSetDbDto): WordSet {
    return {
      id: entity._id?.toString(),
      ownerId: entity.ownerId.toString(),
      title: entity.title,
      description: entity.description,
      settings: entity.settings,
      words: entity.words,
    };
  },
};
