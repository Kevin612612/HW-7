"use strict";
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
exports.emailsManager = void 0;
const email_adapter_1 = require("../adapters/email-adapter");
const users_repository_db_1 = require("../repositories/users-repository-db");
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
exports.emailsManager = {
    //
    sendEmailConfirmationMessage(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            //find user by email
            const user = yield users_repository_db_1.usersRepository.findUserByLoginOrEmail(email);
            //build code
            const confirmationCode = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://hw-7-sigma.vercel.app/auth/registration-confirmation?code=${code}'>complete registration</a>
        </p>`;
            //write the moment when it has been sent
            const result = yield users_repository_db_1.usersRepository.updateDate(user, code);
            //send email
            return yield email_adapter_1.emailAdapter.sendEmail(email, confirmationCode, "confirm registration");
        });
    },
    //some actions
    sendEmailConfirmationMessageAgain(email) {
        return __awaiter(this, void 0, void 0, function* () {
            //find user by email
            const user = yield users_repository_db_1.usersRepository.findUserByLoginOrEmail(email);
            //if user exists and code is not confirmed and duration between now and moment the code's been created more minute
            if (user
                //is not confirmed yet
                && (user === null || user === void 0 ? void 0 : user.emailConfirmation.isConfirmed) === false
                //   now        moment the last code has been sent         +           a minute
                && new Date > (0, add_1.default)(user.codes[user.codes.length - 1].sentAt, { seconds: 0.1 })) {
                //build new code
                const newCode = (0, uuid_1.v4)();
                const result = yield users_repository_db_1.usersRepository.updateCode(user, newCode);
                const newConfirmationCode = `<h1>Thank for your registration</h1>
                    <p>To finish registration please follow the link below one more time:
                    <a href='https://hw-7-sigma.vercel.app/auth/registration-confirmation?code=${newCode}'>complete registration</a>
                    </p>`;
                //send email with new code
                return yield email_adapter_1.emailAdapter.sendEmail(email, newConfirmationCode, "confirm registration");
            }
            else {
                return 400;
            }
        });
    }
};
