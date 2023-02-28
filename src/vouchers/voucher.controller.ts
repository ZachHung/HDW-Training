import { Body, Controller, Post, Request, Route, Security, Tags } from 'tsoa';
import { VoucherRoutes } from '../core/utils/constants/api';
import { Roles } from '../core/utils/constants/roles';
import { createResponse, HttpResponse } from '../core/utils/helpers/response';
import { validate } from '../core/utils/helpers/validate';
import { CustomRequest } from '../core/utils/middleware/auth.middleware';
import { CreateVoucherDTO, createVoucherSchema } from './voucher.dto';
import { VoucherService } from './voucher.service';
import { IVoucher } from './vouchers.model';

@Route('vouchers')
@Tags('Vouchers')
export class VoucherController extends Controller {
  @Security('jwt', [Roles.CUSTOMER])
  @Post(VoucherRoutes.POST_CREATE_VOUCHER)
  async create(
    @Request() req: CustomRequest,
    @Body() body: CreateVoucherDTO,
  ): Promise<HttpResponse<IVoucher[]>> {
    const payload = validate<CreateVoucherDTO>(body, createVoucherSchema);
    // const { user } = req as CustomRequest;
    const newVoucher = await new VoucherService().create(payload, req.user._id);
    return createResponse(this, newVoucher, 201);
  }
}
