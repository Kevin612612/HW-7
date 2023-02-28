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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceRouter = void 0;
//get devices
//delete devices
//delete deviceId
const express_1 = require("express");
const authorization_middleware_1 = require("../middleware/authorization-middleware");
const refresh_tokens_BLL_1 = require("../BLL/refresh-tokens-BLL");
const jwt_service_1 = require("../application/jwt-service");
exports.deviceRouter = (0, express_1.Router)({});
//get devices - returns all devices with active sessions for current user
exports.deviceRouter.get('/devices', authorization_middleware_1.checkRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const refreshToken = req.cookies.refreshToken;
    //BLL
    const allDevices = yield refresh_tokens_BLL_1.refreshTokensBusinessLayer.allDevices(refreshToken);
    //RETURN
    res.status(200).send(allDevices);
}));
//delete devices
exports.deviceRouter.delete('/devices', authorization_middleware_1.checkRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const refreshToken = req.cookies.refreshToken;
    //BLL
    const allOtherDevices = yield refresh_tokens_BLL_1.refreshTokensBusinessLayer.terminateAllOtherDevices(refreshToken);
    //RETURN
    res.status(204).send(allOtherDevices);
}));
//get devices
exports.deviceRouter.delete('/devices/deviceId', authorization_middleware_1.checkRefreshToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const deviceId = req.params.deviceId;
    const refreshToken = req.cookies.refreshToken;
    const user = jwt_service_1.jwtService.getUserByRefreshToken(refreshToken);
    //BLL
    const result = refresh_tokens_BLL_1.refreshTokensBusinessLayer.terminateCurrentDevice(user.userId, deviceId);
    //RETURN
    res.status(204).send(result);
}));
