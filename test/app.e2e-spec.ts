import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { VotesModule } from 'src/modules/votes/votes.module';
import { VotesService } from 'src/modules/votes/votes.service';

describe('Votes', () => {
  let app: INestApplication;
  const votesService = {};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [VotesModule],
    })
      .overrideProvider(VotesService)
      .useValue(votesService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST votes`, () => {
    return request(app.getHttpServer())
      .post('/votes')
      .send({})
      .expect(200)
      .expect({});
  });

  afterAll(async () => {
    await app.close();
  });
});
