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
exports.commentsBusinessLayer = void 0;
//(1) updateCommentById
//(2) deleteComment
//(3) findCommentById
const comments_repository_db_1 = require("../repositories/comments-repository-db");
exports.commentsBusinessLayer = {
    //(1) method updates comment by ID
    updateCommentById(commentId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            //check if it is your account
            const comment = yield comments_repository_db_1.commentsRepository.findCommentById(commentId);
            if (comment) {
                if (comment.commentatorInfo.userId == userId) {
                    const result = yield comments_repository_db_1.commentsRepository.updateCommentById(commentId, content);
                    return 204;
                }
                else {
                    return 403;
                }
            }
            else {
                return 404;
            }
        });
    },
    //(2) method deletes comment by ID
    deleteComment(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            //check if it is your account
            const comment = yield comments_repository_db_1.commentsRepository.findCommentById(commentId);
            if (comment) {
                if (comment.commentatorInfo.userId == userId) {
                    const result = yield comments_repository_db_1.commentsRepository.deleteComment(commentId);
                    return 204;
                }
                else {
                    return 403;
                }
            }
            else {
                return 404;
            }
        });
    },
    //(3) method find comment by Id
    findCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_repository_db_1.commentsRepository.findCommentById(id);
            return result ? result : 404;
        });
    },
};
