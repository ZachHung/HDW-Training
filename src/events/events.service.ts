import { createError } from '../core/utils/helpers';
import { CreateEventDTO } from './events.dto';
import { Event, IEvent } from './events.model';

export class EventService {
  async create(data: CreateEventDTO) {
    const newEvent = await Event.create(data);
    return newEvent;
  }

  async edit(userId: string, eventId: string) {
    const event = await Event.findOneAndUpdate(
      { _id: eventId, $or: [{ editBy: null }, { editBy: userId }] },
      { $set: { editBy: userId, editAt: Date.now() } },
      { new: true },
    )
      .populate('editBy')
      .lean();
    if (!event) throw createError(409, 'Event is being edited by someone else');
    return event;
  }

  async releaseEdit(userId: string, eventId: string) {
    const event = await Event.findOneAndUpdate(
      { _id: eventId, editBy: userId },
      { $set: { editBy: null, editAt: null } },
      { new: true },
    )
      .populate('editBy')
      .lean();
    if (!event) throw createError(409, 'Event is being edited by someone else');
    return event;
  }

  async maintainEdit(userId: string, eventId: string) {
    let event: IEvent | null;
    event = await Event.findOneAndUpdate(
      { _id: eventId, editBy: userId, editAt: { $gt: new Date().getTime() - 1000 } },
      { $set: { editAt: new Date() } },
      { new: true },
    );
    if (!event) event = await this.releaseEdit(userId, eventId);
    return event;
  }
}
