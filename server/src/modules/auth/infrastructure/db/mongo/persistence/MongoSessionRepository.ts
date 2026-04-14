import { injectable } from 'inversify';

import { Session } from '@modules/auth/domain/entities';

import { SessionRepositoryPort } from '@modules/auth/application/ports';

import { MongoSessionModel } from '@modules/auth/infrastructure/db/mongo/models/SessionModel';

@injectable()
export class MongoSessionRepository implements SessionRepositoryPort {
  constructor() {}

  async save(session: Session): Promise<void> {
    await MongoSessionModel.findOneAndUpdate(
      { _id: session.id },
      {
        $set: {
          userId: session.props.userId,
          refreshToken: session.props.refreshToken,
          fingerprint: session.props.fingerprint,
          userAgent: session.props.userAgent,
          ip: session.props.ip,

          expiresAt: session.props.expiresAt,
          lastActive: session.props.lastActiveAt,
        },
        // _id: session.id,
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async findByToken(token: string): Promise<Session | null> {
    const doc = await MongoSessionModel.findOne({ refreshToken: token });
    if (!doc) return null;

    const sessionDoc = doc.toObject();

    return new Session(sessionDoc._id, {
      userId: sessionDoc.userId.toString(),
      refreshToken: sessionDoc.refreshToken,
      ip: sessionDoc.ip,
      userAgent: sessionDoc.userAgent,
      fingerprint: sessionDoc.fingerprint,
      expiresAt: sessionDoc.expiresAt,
      lastActiveAt: sessionDoc.lastActive,
    });
  }

  async findByUserAndFingerprint(userId: string, fingerprint: string): Promise<Session | null> {
    console.log('[MongoSessionRepository] findOne', userId, fingerprint);
    const doc = await MongoSessionModel.findOne({ userId, fingerprint }).exec();
    if (!doc) return null;

    const sessionDoc = doc.toObject();

    return new Session(sessionDoc._id, {
      userId: sessionDoc.userId.toString(),
      refreshToken: sessionDoc.refreshToken,
      ip: sessionDoc.ip,
      userAgent: sessionDoc.userAgent,
      fingerprint: sessionDoc.fingerprint,
      expiresAt: sessionDoc.expiresAt,
      lastActiveAt: sessionDoc.lastActive,
    });
  }

  // async findByUserId(userId: string): Promise<Session | null> {
  //   const doc = await MongoSessionModel.findOne({ userId });
  //   if (!doc) return null;
  //
  //   const sessionDoc = doc.toObject();
  //
  //   return new Session(sessionDoc._id, {
  //     userId: sessionDoc.userId.toString(),
  //     refreshToken: sessionDoc.refreshToken,
  //     ip: sessionDoc.ip,
  //     userAgent: sessionDoc.userAgent,
  //     fingerprint: sessionDoc.fingerprint,
  //     expiresAt: sessionDoc.expiresAt,
  //     lastActiveAt: sessionDoc.lastActive,
  //   });
  // }

  async deleteByToken(token: string): Promise<void> {
    await MongoSessionModel.deleteOne({ refreshToken: token });
  }

  async delete(id: string): Promise<void> {
    await MongoSessionModel.deleteOne({ _id: id });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await MongoSessionModel.deleteMany({ userId });
  }
}
