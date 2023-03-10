import { Body, Controller, Path, Post, Request, Route, Security, Tags } from 'tsoa';
import { VoucherRoutes } from '../core/utils/constants/api';
import { Roles } from '../core/utils/constants/roles';
import { createResponse, HttpResponse } from '../core/utils/helpers/response';
import { validate } from '../core/utils/helpers/validate';
import { CustomRequest } from '../core/utils/middleware/auth.middleware';
import {
  CreateVoucherDTO,
  createVoucherSchema,
  GetVoucherDTO,
  getVoucherSchema,
} from './vouchers.dto';
import { VoucherService } from './voucher.service';
import { VoucherSchema } from './vouchers.model';

@Route('vouchers')
@Tags('Vouchers')
export class VoucherController extends Controller {
  @Security('jwt', [Roles.ADMIN])
  @Post(VoucherRoutes.POST_CREATE_VOUCHER)
  async create(
    @Request() req: CustomRequest,
    @Body() body: CreateVoucherDTO,
  ): Promise<HttpResponse<VoucherSchema[]>> {
    const payload = validate<CreateVoucherDTO>(body, createVoucherSchema);
    // const { user } = req as CustomRequest;
    const newVoucher = await new VoucherService().create(payload);
    return createResponse(this, newVoucher, 201);
  }

  @Security('jwt', [Roles.CUSTOMER])
  @Post(VoucherRoutes.POST_ACTIVATE_VOUCHER)
  async activate(
    @Request() req: CustomRequest,
    @Path() eventId: string,
  ): Promise<HttpResponse<VoucherSchema>> {
    const payload = validate<GetVoucherDTO>({ event_id: eventId }, getVoucherSchema);
    const { user } = req as CustomRequest;
    const newVoucher = await new VoucherService().getVoucher(payload.event_id, user._id);
    return createResponse(this, newVoucher);
  }
}
