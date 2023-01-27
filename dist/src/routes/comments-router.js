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
exports.commentsRouter = void 0;
//(1)put     update comments
//(2)delete  delete comment
//(3)get     returns comment by Id
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const comments_BLL_1 = require("../BLL/comments-BLL");
const authorization_middleware_1 = require("../middleware/authorization-middleware");
const input_validation_middleware_1 = require("../middleware/input-validation-middleware");
exports.commentsRouter = (0, express_1.Router)({});
//(1) update comments
exports.commentsRouter.put('/:commentId', authorization_middleware_1.authMiddleWare, input_validation_middleware_1.commentValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const content = req.body.content;
    //BLL
    const comment = yield comments_BLL_1.commentsBusinessLayer.updateCommentById(commentId, userId, content);
    //RETURN
    res.status(204).send(comment);
}));
//(2) delete comments
exports.commentsRouter.delete('/:commentId', authorization_middleware_1.authMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const commentId = req.params.commentId;
    const userId = req.user.id;
    //BLL
    const comment = yield comments_BLL_1.commentsBusinessLayer.deleteComment(commentId, userId);
    //RETURN
    res.send(comment);
}));
//(3) returns comment by Id
exports.commentsRouter.get('/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const id = req.params.commentId;
    //BLL
    const comment = yield comments_BLL_1.commentsBusinessLayer.findCommentById(id);
    //RETURN
    res.status(200).send(comment);
}));
