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
exports.emailRouter = void 0;
//(1)get     returns email
const express_1 = require("express");
const email_adapter_1 = require("../adapters/email-adapter");
exports.emailRouter = (0, express_1.Router)({});
//(1) return email
exports.emailRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const { email: email, message: message, subject: subject } = req.body;
    //ADAPTER
    const result = yield email_adapter_1.emailAdapter.sendEmail(email, message, subject);
    //RETURN
    res.status(200).send(result.accepted);
}));
