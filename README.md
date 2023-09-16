# Service API Template

## Description

Service API for circle server applications.

## Installation

```bash
$ git clone https://github.com/circle/circle.git
```

rename the `.env.sample` to `.env`

```bash
$ npm install
```

## Running the server

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Adding modules

```bash
$ nest g module <module-name>
```

Run

```bash
$ nest g help
```

to see all schema generation options

## Database setup

Each project uses [Prisma](https://prisma.io)  
Edit the `prisma/schema.prisma` to update database schema  
Run
`$ npx prisma migrate dev` to sync schema file with the database
`$ npx prisma migrate init` to initialize database schema
`$ npx prisma db seed` to seed the db. Make sure to add

```json
"prisma": {
    "seed": "npx ts-node prisma/seed.ts"
}
```

to `package.json` and create a `seed.ts` file in the `prisma` directory

Example seed file

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function seed() {
  await prisma.user.create({
        data: {
                email: 'johndoe@example.com',
                username: 'johndoe'
            }
    })
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);

```

## Microservice Setup

Change the `queue: ''` to the name of the service e.g `queue: 'template-service'`

### Connect To Other Microservices

In the module for the service or controller that requires connecting to other microservices.
Add

```typescript
ClientsModule.register([
    {
    name: <CLIENT_NAME>,
    options: {
        urls: config.rmq.urls,
        queue: <MICROSERVICE_QUEUE_NAME>, // USERDATA_QUEUE
        persistent: true,
    },
    },
])
```

Then in the service or controller controller. Add `@Inject(<CLIENT_NAME>) private nameClient: ClientProxy`

## Making API Calls

To make API calls to 3rd party platforms, the project uses `@nestjs/axios` which returns response as an Observable,
use rxjs's `lastValueFrom` to get the resulting data when using Promise
Import the nestjs http module in the module and import the http service to your controller/service
`imports: [HttpModule]`
`private http: HttpService`
Check [@nestjs/axios](https://docs.nestjs.com/techniques/http-module) for more details  
Example
`const response = await lastValueFrom(this.http.get('http://localhost:3000/))`
