import * as crypto from 'crypto';

export class PaginationDto {
  size: number;
  totalItems: number;
  nextPage: number;
  previousPage: number;
}

export const generateRandomString = (length?: number): string => {
  length = length || 15;
  const a = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
  let str = '';

  for (let i = 0; i < length; i++) {
    str += a[Math.floor(Math.random() * a.length)];
  }
  return str;
};

export const generateRandomNumber = (length: number): string => {
  const n = '1234567890';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += n[Math.floor(Math.random() * n.length)];
  }
  return str;
};

export const paging = (
  totalItems: number,
  resultTotal: number,
  page: number,
  size: number,
): PaginationDto => {
  const nextPage = Number(page) + 1;
  const pages = Math.ceil(totalItems / Number(size));

  return {
    size: resultTotal,
    totalItems,
    nextPage: (nextPage > pages ? pages : nextPage) || 1,
    previousPage: Number(page) - 1 || Number(page),
  };
};

export const getFileType = (mimetype: string): string => {
  const types = [
    {
      mimetype: 'image/jpeg',
      ext: '.jpg',
    },
    {
      mimetype: 'image/gif',
      ext: '.gif',
    },
    {
      mimetype: 'image/gif',
      ext: '.gif',
    },
    {
      mimetype: 'image/png',
      ext: '.png',
    },
    {
      mimetype: 'image/tiff',
      ext: '.tiff',
    },
  ];

  return types.find((type) => type.mimetype === mimetype).ext;
};

export const generateColorCode = () => {
  const codes = 'ABCDEF0123456';
  let colorCode = '#';

  for (let i = 0; i < 6; i++) {
    colorCode += codes[Math.floor(Math.random() * codes.length)];
  }
  return colorCode;
};

export const checkIfEmail = (email: string) => {
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  return regexExp.test(email);
};

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', '', iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return Buffer.from(
    JSON.stringify({
      iv: iv.toString('hex'),
      content: encrypted.toString('hex'),
    }),
    'utf8',
  );
};

export const decrypt = (hashString: Buffer) => {
  const hash = JSON.parse(hashString.toString('utf8'));

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    '',
    Buffer.from(hash.iv, 'hex'),
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
  ]);

  return decrypted.toString();
};
