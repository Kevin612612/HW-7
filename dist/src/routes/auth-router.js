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
exports.authRouter = void 0;
//login
//refresh tokens
//registration
//registration-confirmation
//resend-registration-code
//logout
//get info about current user
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const request_ip_1 = __importDefault(require("request-ip"));
const auth_BLL_1 = require("../BLL/auth-BLL");
const input_validation_middleware_1 = require("../middleware/input-validation-middleware");
const authorization_middleware_1 = require("../middleware/authorization-middleware");
const findNonExistId_1 = require("../application/findNonExistId");
const users_BLL_1 = require("../BLL/users-BLL");
const bussiness_service_1 = require("../bussiness/bussiness-service");
const jwt_service_1 = require("../application/jwt-service");
const users_repository_db_1 = require("../repositories/users-repository-db");
const mongodb_1 = require("../repositories/mongodb");
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const refreshTokens_repository_db_1 = require("../repositories/refreshTokens-repository-db");
exports.authRouter = (0, express_1.Router)({});
//login
exports.authRouter.post('/login', (0, express_validator_1.oneOf)([input_validation_middleware_1.usersLoginValidation1, input_validation_middleware_1.usersEmailValidation1]), input_validation_middleware_1.usersPasswordValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //COLLECTION of ERRORS
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errs = errors.array({ onlyFirstError: true });
        const result = {
            errorsMessages: errs.map(e => {
                return { message: e.msg, field: e.param };
            })
        };
        return res.status(400).json(result);
    }
    //INPUT
    const { loginOrEmail, password } = req.body;
    const ipAddress = request_ip_1.default.getClientIp(req);
    const userAgent = req.headers['user-agent'];
    const parser = new ua_parser_js_1.default(userAgent);
    const deviceName = parser.getResult().ua ? parser.getResult().ua : 'noname';
    const deviceId = req.body.deviceId ? req.body.deviceId : yield (0, findNonExistId_1.createDeviceId)();
    //BLL
    const user = yield auth_BLL_1.authBusinessLayer.IsUserExist(loginOrEmail, password);
    //RETURN
    if (user) {
        //create the pair of tokens and put them into db
        const accessToken = yield jwt_service_1.jwtService.createAccessJWT(user);
        const refreshToken = yield jwt_service_1.jwtService.createRefreshJWT(user, deviceId, deviceName, ipAddress);
        //send response with tokens
        res
            .cookie('refreshToken', refreshToken, {
            // maxAge: 20000 * 1000,
            maxAge: 20 * 1000,
            httpOnly: true,
            secure: true
        })
            .status(200)
            .json({ accessToken: accessToken });
    }
    else {
        res.sendStatus(401);
    }
}));
//new pair of tokens
exports.authRouter.post('/refresh-token', authorization_middleware_1.checkRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const refreshToken = req.cookies.refreshToken;
    const ipAddress = req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const parser = new ua_parser_js_1.default(userAgent);
    const deviceName = parser.getResult().ua ? parser.getResult().ua : 'noname';
    const payload = jwt_service_1.jwtService.getUserByRefreshToken(refreshToken);
    const deviceId = payload.deviceId;
    const user = yield users_repository_db_1.usersRepository.findUserByLoginOrEmail(payload === null || payload === void 0 ? void 0 : payload.login);
    //BLL
    //since validation is passed, so we can add refreshToken in black list
    mongodb_1.blackList.push(refreshToken);
    //...and delete from DB
    const deleteRefreshToken = yield refreshTokens_repository_db_1.refreshTokensRepository.deleteOne(user.id, deviceId);
    //RETURN
    if (user) {
        //create the pair of tokens and put them into db
        const accessToken = yield jwt_service_1.jwtService.createAccessJWT(user);
        const refreshToken = yield jwt_service_1.jwtService.createRefreshJWT(user, deviceId, deviceName, ipAddress);
        //send response with tokens
        res
            .cookie('refreshToken', refreshToken, {
            // maxAge: 20000 * 1000,
            maxAge: 20 * 1000,
            httpOnly: true,
            secure: true
        })
            .status(200)
            .json({ accessToken: accessToken });
    }
    else {
        res.sendStatus(401);
    }
}));
//registration
exports.authRouter.post('/registration', input_validation_middleware_1.usersLoginValidation, input_validation_middleware_1.usersPasswordValidation, input_validation_middleware_1.usersEmailValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //COLLECTION of ERRORS
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errs = errors.array({ onlyFirstError: true });
        const result = {
            errorsMessages: errs.map(e => {
                return { message: e.msg, field: e.param };
            })
        };
        return res.status(400).json(result);
    }
    //INPUT
    const { login, password, email } = req.body;
    const userId = yield (0, findNonExistId_1.createUserId)();
    //BLL
    const user = yield users_BLL_1.userBusinessLayer.newPostedUser(userId, login, password, email);
    //RETURN
    if (user) {
        res.status(204).send(user);
    }
    else {
        res.status(400);
    }
}));
//registration-confirmation
exports.authRouter.post('/registration-confirmation', input_validation_middleware_1.codeValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //COLLECTION of ERRORS
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errs = errors.array({ onlyFirstError: true });
        const result = {
            errorsMessages: errs.map(e => {
                return { message: e.msg, field: e.param };
            })
        };
        return res.status(400).json(result);
    }
    //INPUT
    const code = req.body.code;
    //BLL
    const result = yield users_BLL_1.userBusinessLayer.confirmCodeFromEmail(code);
    //RETURN
    res.status(204).send(result);
}));
//resend-registration-code
exports.authRouter.post('/registration-email-resending', input_validation_middleware_1.usersEmailValidation2, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //COLLECTION of ERRORS
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errs = errors.array({ onlyFirstError: true });
        const result = {
            errorsMessages: errs.map(e => {
                return { message: e.msg, field: e.param };
            })
        };
        return res.status(400).json(result);
    }
    //INPUT
    const email = req.body.email;
    //BLL
    const result = yield bussiness_service_1.emailsManager.sendEmailConfirmationMessageAgain(email);
    //RETURN
    res.status(204).send(result);
}));
//logout
exports.authRouter.post('/logout', authorization_middleware_1.checkRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const refreshToken = req.cookies.refreshToken;
    const payload = jwt_service_1.jwtService.getUserByRefreshToken(refreshToken);
    //BLL
    //make refreshToken Expired/Invalid
    const result = yield jwt_service_1.jwtService.makeRefreshTokenExpired(refreshToken);
    //...and delete from DB
    const deleteRefreshToken = yield refreshTokens_repository_db_1.refreshTokensRepository.deleteOne(payload.userId, payload.deviceId);
    //RETURN
    //clear the refreshToken from the cookies
    res.clearCookie('refreshToken').status(204).send('you\'re quit');
}));
//get info about current user
exports.authRouter.get('/me', authorization_middleware_1.authMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        email: req.user.accountData.email,
        login: req.user.accountData.login,
        userId: req.user.id
    });
}));
