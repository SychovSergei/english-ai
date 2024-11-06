import { Document, Types } from "mongoose";

export type DocResponseWithId<T> = Pick<Document<Types.ObjectId, unknown, T>, "_id"> & T;
