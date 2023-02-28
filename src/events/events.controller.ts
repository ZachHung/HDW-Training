import { Body, Controller, Post, Request, Route, Security, Tags } from 'tsoa';
import { EventRoutes, PostRoutes } from '../core/utils/constants/api';
import { createResponse, HttpResponse } from '../core/utils/helpers/response';
import { validate } from '../core/utils/helpers/validate';
import { CustomRequest } from '../core/utils/middleware/auth.middleware';
import { CreateEventDTO, createEventSchema } from './events.dto';
import { IEvent } from './events.model';
import { EventService } from './events.service';

@Route('events')
@Tags('Events')
export class EventController extends Controller {
  // @Security('jwt', [Roles.CUSTOMER])
  @Post(EventRoutes.POST_CREATE_EVENT)
  async create(
    @Request() req: CustomRequest,
    @Body() body: CreateEventDTO,
  ): Promise<HttpResponse<IEvent>> {
    const payload = validate<CreateEventDTO>(body, createEventSchema);
    // const { user } = req as CustomRequest;
    const newEvent = await new EventService().create(payload);
    return createResponse(this, newEvent, 201);
  }
}
