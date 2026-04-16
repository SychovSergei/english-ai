import { NextFunction, Request, Response } from 'express';

// import { requestContext } from '@core/application/context/RequestContext';
import { GuestActor } from '@core/application/identity/GuestActor';
import { GuestLimits } from '@core/application/limits/GuestLimits';
import { generateUuid } from '@core/application/ports/generate-uuid';
import { requestContext } from '@infrastructure/http/context/RequestContext';

// import { requestContext } from '@infrastructure/http/context/RequestContext';

// TODO наверно удалить, потому что нигде не использую??
export function guestMiddleware(req: Request, res: Response, next: NextFunction): void {
  const store = requestContext.getStore();
  if (!store) return next();

  const guestId = req.cookies.questId ?? req.headers['x-guest-id'];

  if (!guestId) {
    const newGuestId = generateUuid();
    res.cookie('guestId', newGuestId, { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 365 });
    store.actor = new GuestActor(newGuestId, GuestLimits.default());
    return next();
  }

  store.actor = new GuestActor(String(guestId), GuestLimits.default());

  next();
}
