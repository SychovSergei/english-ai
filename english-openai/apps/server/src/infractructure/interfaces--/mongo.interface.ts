import { Document } from "mongoose";

// export type DocResponseWithId<T> = Pick<Document<Types.ObjectId, unknown, T>, "_id"> & T;
export type DocResponseWithId<T> = Pick<Document<string, unknown, T>, "_id"> & T;
