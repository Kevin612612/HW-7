"use strict";
//Business Layer
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authBusinessLayer = void 0;
//(1) Does user exist and password correct
const users_repository_db_1 = require("../repositories/users-repository-db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_service_1 = require("../application/jwt-service");
exports.authBusinessLayer = {
    //(1) Does user exist and password correct
    IsUserExist(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //находим пользователя по логину или email
            const user = yield users_repository_db_1.usersRepository.findUserByLoginOrEmail(loginOrEmail);
            //если такой есть то сравниваем его хэш с хэшом введенного пароля
            if (user) {
                const passwordHash = yield bcrypt_1.default.hash(password, user.passwordSalt);
                if (passwordHash == user.passwordHash) {
                    return yield jwt_service_1.jwtService.createJWT(user);
                }
            }
            return undefined;
        });
    }
};
