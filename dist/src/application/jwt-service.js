"use strict";
//Presentation Layer
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
exports.jwtService = void 0;
//(1) create access token
//(2) create refresh token
//(3) method returns user by token
//(4) method return user by refresh-token
//(5) check if a token has expired
//(6) make refreshToken Invalid
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_repository_db_1 = require("../repositories/users-repository-db");
const mongodb_1 = require("../repositories/mongodb");
exports.jwtService = {
    //(1) create access token
    createAccessJWT(user) {
        return __awaiter(this, void 0, void 0, function* () {
            //create token
            const payload = {
                userId: user.id,
                login: user.accountData.login,
                email: user.accountData.email
            };
            // const liveTime = 10000
            const liveTime = 10;
            const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_secret, { expiresIn: liveTime + "s" });
            //put it into db in user schema
            const result = yield users_repository_db_1.usersRepository.addAccessToken(user, accessToken, liveTime);
            return accessToken;
        });
    },
    //(2) create refresh token
    createRefreshJWT(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                userId: user.id,
                login: user.accountData.login,
                email: user.accountData.email,
            };
            // const liveTime = 20000
            const liveTime = 20;
            const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_secret, { expiresIn: liveTime + "s" });
            //put it into db in user schema
            const result = yield users_repository_db_1.usersRepository.addRefreshToken(user, refreshToken, liveTime);
            return refreshToken;
        });
    },
    //(3) method return user by access-token
    getUserByAccessToken(token) {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_secret);
        return {
            userId: user.userId,
            login: user.login,
            email: user.email
        };
    },
    //(4) method return user by refresh-token
    getUserByRefreshToken(token) {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_secret);
        return {
            userId: user.userId,
            login: user.login,
            email: user.email,
        };
    },
    //(5)check if a token has expired
    isTokenExpired(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_secret);
                const expirationTime = payload.exp;
                const currentTime = Math.floor(Date.now() / 1000);
                return expirationTime < currentTime;
            }
            catch (error) {
                // Handle invalid token or other errors
                return true;
            }
        });
    },
    //(6) make refreshToken Invalid
    makeRefreshTokenExpired(token) {
        return __awaiter(this, void 0, void 0, function* () {
            mongodb_1.blackList.push(token);
            //decode user
            // const user: any = await jwt.verify(token, process.env.JWT_secret!)
            // //find user by decoded login
            // const userDb = await usersRepository.findUserByLoginOrEmail(user.login)
            // //del token from this user
            // const result =  await usersRepository.setRefreshTokenExpired(userDb!)
            return true;
        });
    },
};
