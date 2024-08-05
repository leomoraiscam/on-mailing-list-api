import { Router } from 'express';

import { makeRegisterUserController } from '@/main/factories/register-user';

import { adaptRoute } from '../adapters/express-route-adapter';

export default (router: Router): void => {
  router.post('/register', adaptRoute(makeRegisterUserController()));
};
