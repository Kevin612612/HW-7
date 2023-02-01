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
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailsManager = void 0;
const email_adapter_1 = require("../adapters/email-adapter");
const users_repository_db_1 = require("../repositories/users-repository-db");
exports.emailsManager = {
    //
    sendEmailConfirmationMessage(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            //generate code
            const confirmationCode = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://hw-7-gold.vercel.app/auth/confirm-email?code=${code}'>complete registration</a>
        </p>`;
            return yield email_adapter_1.emailAdapter.sendEmail(email, confirmationCode, "confirm registration");
        });
    },
    //some actions
    sendEmailConfirmationMessageAgain(email) {
        return __awaiter(this, void 0, void 0, function* () {
            //find user
            const user = yield users_repository_db_1.usersRepository.findUserByLoginOrEmail(email);
            if (user) {
                //create new code if old one is not confirmed yet
                if ((user === null || user === void 0 ? void 0 : user.emailConfirmation.isConfirmed) === false) {
                    // user.emailConfirmation.confirmationCode = uuidv4()
                    //create new code
                    const newConfirmationCode = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below one more time:
            <a href='https://hw-7-gold.vercel.app/auth/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
        </p>`;
                    //send email with new code
                    return yield email_adapter_1.emailAdapter.sendEmail(email, newConfirmationCode, "confirm registration");
                }
            }
            else {
                return 400;
            }
        });
    }
};
