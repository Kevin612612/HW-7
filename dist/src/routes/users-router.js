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
exports.usersRouter = void 0;
//(1)get     returns all users
//(2)post    create new user
//(3)delete  delete user by ID
const express_1 = require("express");
const users_BLL_1 = require("../BLL/users-BLL");
const input_validation_middleware_1 = require("../middleware/input-validation-middleware");
const express_validator_1 = require("express-validator");
const authorization_middleware_1 = require("../middleware/authorization-middleware");
exports.usersRouter = (0, express_1.Router)({});
//(1) return all users
exports.usersRouter.get('/', authorization_middleware_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    let { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = req.query;
    const a = pageNumber ? +pageNumber : 1;
    const b = pageSize ? +pageSize : 10;
    const c = sortBy ? sortBy : "createdAt";
    const d = sortDirection ? sortDirection : "desc";
    const e = searchLoginTerm ? searchLoginTerm : null;
    const f = searchEmailTerm ? searchEmailTerm : null;
    //BLL
    const allUsers = yield users_BLL_1.userBusinessLayer.allUsers(a, b, c, d, e, f);
    //RETURN
    res.status(200).send(allUsers);
}));
//(2) create new user
exports.usersRouter.post('/', authorization_middleware_1.authorization, input_validation_middleware_1.usersLoginValidation, input_validation_middleware_1.usersPasswordValidation, input_validation_middleware_1.usersEmailValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //COLLECTION of ERRORS
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errs = errors.array({ onlyFirstError: true });
        const result = { errorsMessages: errs.map(e => { return { message: e.msg, field: e.param }; }) };
        return res.status(400).json(result);
    }
    //INPUT
    let { id, login, password, email } = req.body;
    //BLL
    const user = yield users_BLL_1.userBusinessLayer.newPostedUser(id, login, password, email);
    //RETURN
    res.status(201).send(user);
}));
//(3) delete user bu userId
exports.usersRouter.delete('/:userId', authorization_middleware_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //COLLECTION of ERRORS
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errs = errors.array({ onlyFirstError: true });
        const result = { errorsMessages: errs.map(e => { return { message: e.msg, field: e.param }; }) };
        return res.status(400).json(result);
    }
    //INPUT
    const userId = req.params.userId;
    //BLL
    const user = yield users_BLL_1.userBusinessLayer.deleteUser(userId);
    //RETURN
    res.status(204).send(user);
}));
