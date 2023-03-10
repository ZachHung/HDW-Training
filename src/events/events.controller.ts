import { Body, Controller, Path, Post, Request, Route, Security, Tags } from 'tsoa';
import { EventRoutes } from '../core/utils/constants/api';
import { Roles } from '../core/utils/constants/roles';
import { createResponse, HttpResponse } from '../core/utils/helpers/response';
import { validate } from '../core/utils/helpers/validate';
import { CustomRequest } from '../core/utils/middleware/auth.middleware';
import { CreateEventDTO, createEventSchema, EditEventDTO, editEventSchema } from './events.dto';
import { EventSchema } from './events.model';
import { EventService } from './events.service';

@Route('events')
@Tags('Events')
export class EventController extends Controller {
  @Security('jwt', [Roles.CUSTOMER])
  @Post(EventRoutes.POST_CREATE_EVENT)
  async create(
    @Request() req: CustomRequest,
    @Body() body: CreateEventDTO,
  ): Promise<HttpResponse<EventSchema>> {
    const payload = validate<CreateEventDTO>(body, createEventSchema);
    // const { user } = req as CustomRequest;
    const newEvent = await new EventService().create(payload);
    return createResponse(this, newEvent, 201);
  }

  @Security('jwt', [Roles.CUSTOMER])
  @Post(EventRoutes.POST_EDIT_ME)
  async editMe(
    @Request() req: CustomRequest,
    @Path() eventId: string,
  ): Promise<HttpResponse<EventSchema>> {
    const { user } = req;
    const payload = validate<EditEventDTO>({ event_id: eventId }, editEventSchema);
    const updateEvent = await new EventService().edit(user._id, payload.event_id);
    return createResponse(this, updateEvent);
  }

  @Security('jwt', [Roles.CUSTOMER])
  @Post(EventRoutes.POST_EDIT_RELEASE)
  async editRelease(
    @Request() req: CustomRequest,
    @Path() eventId: string,
  ): Promise<HttpResponse<EventSchema>> {
    const { user } = req;
    const payload = validate<EditEventDTO>({ event_id: eventId }, editEventSchema);
    const updateEvent = await new EventService().releaseEdit(user._id, payload.event_id);
    return createResponse(this, updateEvent);
  }

  @Security('jwt', [Roles.CUSTOMER])
  @Post(EventRoutes.POST_EDIT_MAINTAIN)
  async editMaintain(
    @Request() req: CustomRequest,
    @Path() eventId: string,
  ): Promise<HttpResponse<EventSchema>> {
    const { user } = req;
    const payload = validate<EditEventDTO>({ event_id: eventId }, editEventSchema);
    const updateEvent = await new EventService().maintainEdit(user._id, payload.event_id);
    return createResponse(this, updateEvent);
  }
}
