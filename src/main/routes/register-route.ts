import { Router } from "express";
import { makeRegisterAndSendUserController } from "@/main/factories/register"; 
import { adaptRoute } from "../adapters/express-route-adapter";

export default (router: Router): void => {
  router.post('/register', adaptRoute(makeRegisterAndSendUserController()))
}