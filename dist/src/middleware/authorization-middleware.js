"use strict";
//Middleware
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRefreshToken = exports.authMiddleWare = exports.authorization = void 0;
const jwt_service_1 = require("../application/jwt-service");
const users_repository_db_1 = require("../repositories/users-repository-db");
//Basic Authorization
const authorization = (req, res, next) => {
    //check if entered password encoded in base 64 is correct
    if (req.headers.authorization == 'Basic YWRtaW46cXdlcnR5') { //decoded in Base64 password
        next();
    }
    else {
        res.status(401).send("Unauthorized");
    }
};
exports.authorization = authorization;
//Bearer Authorization
const authMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    //retrieve user from token payload (if exists) and put it into request
    const auth = req.headers.authorization;
    const typeOfAuth = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[0].trim();
    const dotInToken = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1].trim().includes('.');
    if (!auth || typeOfAuth != 'Bearer' || !dotInToken) { //token is absent in headers
        res.sendStatus(401);
        return;
    }
    const token = req.headers.authorization.split(' ')[1]; //token is in headers: 'bearer algorithmSecretKey.payload.kindOfHash'
    const userDecoded = yield jwt_service_1.jwtService.getUserByAccessToken(token); //get user from payload
    if (userDecoded) {
        req.user = yield users_repository_db_1.usersRepository.findUserByLoginOrEmail(userDecoded.login); //get user from db by user.login and take it into body
        next();
    }
    return 401; //we don't get user from headers.authorization
});
exports.authMiddleWare = authMiddleWare;
// middleware to check if refresh token exists and is valid
const checkRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).send({ error: 'Refresh token not found' });
    }
    // try {
    //     const decoded = jwt.verify(refreshToken, secretKey);
    //     const user = jwtService.getUserByRefreshToken(refreshToken);
    //     if (!user) {
    //         return res.status(401).send({ error: 'Invalid token type' });
    //     }
    //     if (decoded.exp <= Date.now() / 1000) {
    //         return res.status(401).send({ error: 'Token has expired' });
    //     }
    // } catch (err) {
    //     return res.status(401).send({ error: 'Invalid token' });
    // }
    next();
});
exports.checkRefreshToken = checkRefreshToken;
