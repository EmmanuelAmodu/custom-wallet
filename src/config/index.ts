import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), './.env'),
});

export default {
  port: parseInt(process.env.PORT),
  env: process.env.ENV,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  redis: {
    host: process.env.REDIS_HOST,
    user: process.env.REDIS_USER,
    pass: process.env.REDIS_PASS,
    port: process.env.REDIS_PORT,
  },
  kafka: {
    sasl: {
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD,
    },
    brokers: process.env.KAFKA_BROKERS.split(','),
  },
};
