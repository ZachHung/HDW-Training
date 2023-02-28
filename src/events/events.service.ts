import { CreateEventDTO } from './events.dto';
import { Event } from './events.model';

export class EventService {
  async create(data: CreateEventDTO) {
    const newEvent = await Event.create(data);
    return newEvent;
  }
}
