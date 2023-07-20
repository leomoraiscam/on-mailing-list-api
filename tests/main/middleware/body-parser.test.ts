import request from 'supertest';
import app from '@/main/config/app';

describe('Body parser Middleware', () => {
  it('should parser body as json', async () => {
    app.post('/test_body_parser', (request, response) => {
      response.send(request.body);
    })

    await request(app).post('/test_body_parser').send({
      name: 'John Doe'
    });

    expect({name: 'John Doe'})
  })
})