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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = void 0;
const mongodb_1 = require("./mongodb");
const add_1 = __importDefault(require("date-fns/add"));
exports.usersRepository = {
    //(1) method returns array of users
    allUsers(sortBy, sortDirection, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = (sortDirection === 'asc') ? 1 : -1;
            return yield mongodb_1.usersCollection
                .find(filter, { projection: { _id: 0 } })
                .sort(sortBy, order)
                .toArray();
        });
    },
    //(2) method creates user
    newPostedUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.usersCollection.insertOne(newUser);
            return result.acknowledged;
        });
    },
    //(3) method  delete user by Id
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.usersCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    //(4) method returns user by loginOrEmail
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.usersCollection.findOne({ $or: [{ "accountData.login": { $regex: loginOrEmail } }, { "accountData.email": { $regex: loginOrEmail } }] });
            return result ? result : undefined;
        });
    },
    //(5) method returns user by email
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.usersCollection.findOne({ "accountData.email": { $regex: `${email}` } });
            return result ? result : undefined;
        });
    },
    //(6) method returns user by code
    findUserByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // const result = await usersCollection.findOne({"emailConfirmation.confirmationCode": code})
            const result = yield mongodb_1.usersCollection.findOne({ codes: { $elemMatch: { code: code } } });
            return result ? result : undefined;
        });
    },
    //(7) method update status
    updateStatus(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.usersCollection.updateOne({ id: user.id }, {
                $set: { "emailConfirmation.isConfirmed": true }
            });
            return result.matchedCount === 1;
        });
    },
    //(8) method update code and PUSH every new code into array
    updateCode(user, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.usersCollection.updateOne({ "accountData.login": user.accountData.login }, {
                $set: { "emailConfirmation.confirmationCode": code }
            });
            const result1 = yield mongodb_1.usersCollection.updateOne({ "accountData.login": user.accountData.login }, {
                $push: { codes: { code: code, sentAt: new Date() } }
            });
            return result.matchedCount === 1;
        });
    },
    //(9) method update date when the FIRST CODE was sent
    updateDate(user, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.usersCollection.updateOne({ "accountData.login": user.accountData.login }, {
                $set: { "codes": [{ code: code, sentAt: new Date() }] }
            });
            return result.matchedCount === 1;
        });
    },
    //(10) method add accessToken into db
    addAccessToken(user, token, liveTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.usersCollection.updateOne({ "accountData.login": user.accountData.login }, {
                $push: { accessTokens: {
                        value: token,
                        createdAt: new Date(),
                        expiredAt: (0, add_1.default)(new Date(), { seconds: liveTime })
                    } }
            });
            return result.matchedCount === 1;
        });
    },
    //(11) method add refreshToken into db
    addRefreshToken(user, token, liveTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.usersCollection.updateOne({ "accountData.login": user.accountData.login }, {
                $push: { refreshTokens: {
                        value: token,
                        createdAt: new Date(),
                        expiredAt: (0, add_1.default)(new Date(), { seconds: liveTime })
                    } }
            });
            return result.matchedCount === 1;
        });
    },
};
