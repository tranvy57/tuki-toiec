import * as crypto from 'crypto';

export function sortObject(obj: Record<string, string | number>) {
  const sorted: Record<string, string> = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = String(obj[key]);
    });
  return sorted;
}

export function encodeVnpValue(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, '+');
}

export function hmacSHA512(secret: string, data: string) {
  return crypto.createHmac('sha512', secret).update(data).digest('hex');
}

export function yyyymmddHHMMss(d = new Date()) {
  const pad = (n: number) => `${n}`.padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export function formatDate(d = new Date()): string {
  const pad = (n: number) => `${n}`.padStart(2, '0');
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

export function buildVnpayUrl(
  params: Record<string, string | number>,
  secretKey: string,
  baseUrl: string,
): string {
  // sort keys alphabetically (localeCompare ensures VN character safety)
  const sortedKeys = Object.keys(params).sort((a, b) => a.localeCompare(b));
  const redirectUrl = new URL(baseUrl);

  // append params (skip empty)
  for (const key of sortedKeys) {
    const value = params[key];
    if (value === undefined || value === null || value === '') continue;
    redirectUrl.searchParams.append(key, value.toString());
  }

  // build raw string to sign (slice(1) removes '?')
  const signData = redirectUrl.search.slice(1);
  const signed = crypto
    .createHmac('sha512', secretKey)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');

  redirectUrl.searchParams.append('vnp_SecureHashType', 'SHA512');
  redirectUrl.searchParams.append('vnp_SecureHash', signed);

  return redirectUrl.toString();
}