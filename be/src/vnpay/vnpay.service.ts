// src/vnpay/vnpay.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';
import {
  buildVnpayUrl,
  formatDate,
  hmacSHA512,
  sortObject,
} from './utils/vnpay.util';

@Injectable()
export class VnpayService {
  private readonly secret = process.env.vnp_HashSecret!;

  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) {}
  async createPaymentUrl(
    code: string,
    amount: number,
    clientIp: string,
    forceQR = false,
  ) {
    let order = await this.orderRepo.findOne({ where: { code } });

    if (!order) {
      order = this.orderRepo.create({
        code,
        amount,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.orderRepo.save(order);
    } else if (order.status === 'paid') {
      throw new Error(`Order ${code} has already been paid.`);
    }

    const now = new Date();
    const params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: process.env.vnp_TmnCode!,
      vnp_Amount: order.amount * 100, // nhân 100 theo quy định VNPay
      vnp_CurrCode: 'VND',
      vnp_TxnRef: order.code,
      vnp_OrderInfo: `Thanh toan don hang ${order.code}`,
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_IpAddr: clientIp,
      vnp_ReturnUrl: process.env.vnp_ReturnUrl!, // nên để trong env
      vnp_IpnUrl: process.env.vnp_IpnUrl!, // URL IPN backend của bạn
      vnp_CreateDate: formatDate(now),
      vnp_ExpireDate: formatDate(new Date(now.getTime() + 15 * 60 * 1000)),
      vnp_BankCode: 'NCB',
    };

    const paymentUrl = buildVnpayUrl(
      params,
      process.env.vnp_HashSecret!,
      process.env.vnp_Url!,
    );

    console.log('VNPay payment URL:', paymentUrl);

    return paymentUrl;
  }

  verifyChecksum(allParams: Record<string, string>) {
    try {
      const { vnp_SecureHash, vnp_SecureHashType, ...rest } = allParams;
      const sorted = sortObject(rest);
      const signData = Object.entries(sorted)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
      const signed = hmacSHA512(this.secret, signData);

      console.log('VNPay verify >>>');
      console.log('signData:', signData);
      console.log('local:', signed);
      console.log('remote:', vnp_SecureHash);

      return (vnp_SecureHash || '').toLowerCase() === signed.toLowerCase();
    } catch (error) {
      console.error('Error verifying checksum:', error);
      return false;
    }
  }

  async confirmIpn(params: Record<string, string>) {
    try {
      const valid = this.verifyChecksum(params);
      console.log(valid);
      if (!valid) return { RspCode: '97', Message: 'Invalid signature' };

      const code = params['vnp_TxnRef'];
      const rsp = params['vnp_ResponseCode'];
      const amountFromVNPay = Number(params['vnp_Amount'] || 0) / 100;

      const order = await this.orderRepo.findOne({ where: { code } });
      if (!order) return { RspCode: '01', Message: 'Order not found' };

      if (order.amount !== amountFromVNPay) {
        console.log(order);
        return { RspCode: '04', Message: 'Invalid amount' };
      }

      if (order.status === 'paid') {
        console.log(order);
        return { RspCode: '02', Message: 'Order already confirmed' };
      }

      if (rsp === '00') {
        order.status = 'paid';
        order.vnpTransactionNo = params['vnp_TransactionNo'];
        order.bankCode = params['vnp_BankCode'];
        order.vnpPayDate = params['vnp_PayDate'];
        console.log(order);
        await this.orderRepo.save(order);
        return { RspCode: '00', Message: 'Confirm Success' };
      } else {
        if (order.status === 'pending') {
          order.status = 'failed';
          console.log(order);
          await this.orderRepo.save(order);
        }
        console.log(order);

        return { RspCode: '00', Message: 'Confirm Failed' };
      }
    } catch (error) {
      console.error('Error confirming IPN:', error);
      return { RspCode: '99', Message: 'Internal error' };
    }
  }
}
