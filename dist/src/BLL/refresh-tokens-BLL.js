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
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokensBusinessLayer = void 0;
const refreshTokens_repository_db_1 = require("../repositories/refreshTokens-repository-db");
exports.refreshTokensBusinessLayer = {
    //(1) this method transform all found data and returns them to router
    allDevices(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            //find refreshToken by value and return userId
            const userId = yield refreshTokens_repository_db_1.refreshTokensRepository.findUserByToken(refreshToken);
            //find all refreshTokens by that userId and non expired date
            if (userId) {
                const result = yield refreshTokens_repository_db_1.refreshTokensRepository.allActiveDevices(userId);
                return result.map(result => {
                    return {
                        ip: result.IP,
                        title: result.deviceName,
                        deviceId: result.deviceId,
                        lastActiveDate: result.createdAt,
                    };
                });
            }
            return [];
        });
    },
    //(2) this method terminates all other devices
    terminateAllOtherDevices(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            //find refreshToken by value and return userId
            const userId = yield refreshTokens_repository_db_1.refreshTokensRepository.findUserByToken(refreshToken);
            //find all refreshTokens by that userId and non expired date
            if (userId) {
                return yield refreshTokens_repository_db_1.refreshTokensRepository.deleteOthers(userId, refreshToken);
            }
            return false;
        });
    },
    //(3) this method terminates current devices
    terminateCurrentDevice(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield refreshTokens_repository_db_1.refreshTokensRepository.deleteOne(userId, deviceId);
            return result ? result : 404;
        });
    },
};
