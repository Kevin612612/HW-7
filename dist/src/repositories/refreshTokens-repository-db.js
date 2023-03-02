"use strict";
//Data access Layer
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
exports.refreshTokensRepository = void 0;
//(1) all devices
//(2) create token
//(3) find token by userId and deviceId
//(4) delete others
//(5) delete this
//(6) find by deviceId
const mongodb_1 = require("./mongodb");
exports.refreshTokensRepository = {
    //(1) method returns structured Array
    allActiveDevices(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongodb_1.refreshTokensCollection
                .find({ $and: [{ expiredAt: { $gt: new Date() } }, { userId: userId }] }, { projection: { _id: 0, value: 0, userId: 0, expiredAt: 0 } })
                .toArray();
        });
    },
    //(2) method creates refreshToken
    newCreatedToken(newToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.refreshTokensCollection.insertOne(newToken);
            return result.acknowledged;
        });
    },
    //(3) method finds refreshToken by userId and deviceId
    findTokenByUserIdAndDeviceId(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.refreshTokensCollection.findOne({ userId: userId, deviceId: deviceId });
            return (result === null || result === void 0 ? void 0 : result.userId) ? result.userId : undefined;
        });
    },
    //(4) method delete all tokens by this user  except current
    deleteOthers(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.refreshTokensCollection.deleteMany({ "userId": userId, "deviceId": { $ne: deviceId } });
            return result.acknowledged;
        });
    },
    //(5) method delete token of this user
    deleteOne(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.refreshTokensCollection.deleteOne({ "userId": userId, "deviceId": deviceId });
            return result.acknowledged;
        });
    },
    //(3) method finds by deviceId
    findUserByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.refreshTokensCollection.findOne({ deviceId: deviceId });
            return result === null || result === void 0 ? void 0 : result.deviceId;
        });
    },
};
