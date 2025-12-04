// src/vnpay/vnpay.controller.ts
import { Controller, Get, Query, Req } from '@nestjs/common';
import { VnpayService } from './vnpay.service';
import { Public } from 'src/common/decorator/public.decorator';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';

@Controller('vnpay')
export class VnpayController {
  constructor(private readonly vnpay: VnpayService) {}

  @Get('create')
  async create(
    @Query('code') code: string,
    @Query('amount') amount: string,
    @Query('courseId') course: string,
    @CurrentUser() user?: any,
  ) {
    const clientIp = '127.0.0.1';
    const url = await this.vnpay.createPaymentUrl(
      code,
      Number(amount),
      clientIp,
      course,
      user
    );
    return { paymentUrl: url };
  }

  @Get('upgrade')
  async upgrade(
    @Query('code') code: string,
    @Query('amount') amount: string,
    @Query('courseId') course: string,
    @CurrentUser() user: any,
  ) {
    const clientIp = '127.0.0.1';
    const url = await this.vnpay.upgradeCourse(
      code,
      Number(amount),
      clientIp,
      course,
      user,
    );
    return { paymentUrl: url };
  }

  @Get('return')
  async handleReturn(@Query() query: Record<string, string>) {
    const valid = this.vnpay.verifyChecksum(query);
    const success = valid && query['vnp_ResponseCode'] === '00';

    const redirectUrl = new URL(process.env.VNP_RETURN_URL!);
    redirectUrl.searchParams.set('order', query['vnp_TxnRef']);
    redirectUrl.searchParams.set('success', success ? '1' : '0');

    return {
      redirectTo: redirectUrl.toString(),
      verified: valid,
      responseCode: query['vnp_ResponseCode'],
    };
  }

  @Get('ipn')
  @Public()
  async handleIpn(@Query() query: Record<string, string>) {
    const restoredQuery = Object.fromEntries(
      Object.entries(query).map(([k, v]) => [k, v.replace(/ /g, '+')]),
    );

    const result = await this.vnpay.confirmIpn(restoredQuery);
    return result;
  }
}
