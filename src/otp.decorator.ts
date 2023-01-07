import { SetMetadata } from '@nestjs/common';

export const OtpLevel = (...levels: string[]) => SetMetadata('otps', levels);
