import * as fs from 'fs';
import request from 'supertest';

import { mongoHelper } from '@/external/repositories/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';

describe('Register Router', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
    fs.unlink(`${process.cwd()}/globalConfig.json`, () => {});
  });

  beforeEach(async () => {
    await mongoHelper.clearCollection('users');
  });

  it('should return an account on success', async () => {
    app.post('/test_cors', (_, response) => {
      response.send();
    });

    await request(app)
      .post('/api/register')
      .send({
        name: 'Roy Figueroa',
        email: 'seej@fu.cm',
      })
      .expect(201);
  }, 50000);
});
