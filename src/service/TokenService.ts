import { StudentService } from "../service/StudentService";
import { LoginRequestDTO } from "../dto/LoginRequestDTO";
import { createLoggerWithModuleName } from "../config/logger";
import jwt from "jsonwebtoken";
import { NotFoundError } from "routing-controllers";
import { TeacherService } from "./TeacherService";
import { LoginUserResponseDTO } from "../dto/LoginUserResponseDTO";

const logger = createLoggerWithModuleName(module);

export class TokenService {
  constructor() {}

  createTokenByEmail(email: string): string {
    logger.info(`Create token for email ${email}`);
    const payload = {
      email: email,
    };
    const token: string = jwt.sign(payload, "Secret Password", {
      expiresIn: 60 * 60 * 24 * 30,
      algorithm: "HS256",
    });
    logger.info("Token created!");
    return token;
  }

  getEmailOfToken(token: string): string {
    logger.debug(`Get email of token ${token}`);
    token = token.replace("Bearer", "");
    try {
      const decodedToken: any = jwt.verify(token, "Secret Password");
      logger.info(`Decoded token ${decodedToken}`);
      console.log("dsds", decodedToken);
      const email = decodedToken.email;
      logger.info(`Email found ${email}`);
      return email;
    } catch (err) {
      logger.error(`Error!!  Cannot decode ${err}`);
      throw new Error("Cannot decode");
    }
  }
}
