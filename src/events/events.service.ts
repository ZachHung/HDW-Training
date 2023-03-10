import { createError } from '../core/utils/helpers';
import { CreateEventDTO } from './events.dto';
import { Event, EventSchema } from './events.model';

export class EventService {
  async create(data: CreateEventDTO): Promise<EventSchema> {
    const newEvent = await Event.create(data);
    return newEvent;
  }

  async edit(userId: string, eventId: string): Promise<EventSchema> {
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $or: [{ editBy: null }, { editAt: { $gt: new Date().getTime() - 1000 * 60 * 5 } }],
      },
      { $set: { editBy: userId, editAt: Date.now() } },
      { new: true },
    )
      .populate('editBy')
      .lean();
    if (!event) throw createError(409, 'Event is being edited by someone else');
    return event;
  }

  async releaseEdit(userId: string, eventId: string): Promise<EventSchema> {
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

  async maintainEdit(userId: string, eventId: string): Promise<EventSchema> {
    let event: EventSchema | null;
    event = await Event.findOneAndUpdate(
      { _id: eventId, editBy: userId, editAt: { $gt: new Date().getTime() - 1000 * 60 * 5 } },
      { $set: { editAt: new Date() } },
      { new: true },
    )
      .populate('editBy')
      .lean();
    if (!event) event = await this.releaseEdit(userId, eventId);
    return event;
  }
}
