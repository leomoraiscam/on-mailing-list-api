import { Router } from "express";
import { makeRegisterUserAndSendUserController } from "@/main/factories/register"; 
import { adaptRoute } from "../adapters/express-route-adapter";

export default (router: Router): void => {
  router.post('/register', adaptRoute(makeRegisterUserAndSendUserController()))
}