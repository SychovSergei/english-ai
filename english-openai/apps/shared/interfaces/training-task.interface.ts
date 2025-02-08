import { Schema } from "mongoose";
import { ETrainingType } from "../../server/src/core/enums/training-type.enum";
import { ELevels } from "@shared/enums/levels.enum";
import { ELangs } from "@shared/enums/langs.enum";

export interface ITrainingTask {
  user: Schema.Types.ObjectId;
  type: ETrainingType;
  wordSet: Schema.Types.ObjectId;
  difficultyLevel: ELevels;
  language: ELangs;
  sentences: Schema.Types.ObjectId[];
  createdAt: Date;
}
