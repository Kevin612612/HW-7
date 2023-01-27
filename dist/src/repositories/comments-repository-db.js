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
exports.commentsRepository = void 0;
const mongodb_1 = require("./mongodb");
exports.commentsRepository = {
    //(1) method returns comments by postId
    allComments(postId, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = sortDirection === 'asc' ? 1 : -1; // порядок сортировки
            return yield mongodb_1.commentsCollection
                .find({ postId: postId }, { projection: { _id: 0, postId: 0 } })
                .sort(sortBy, order)
                .toArray();
        });
    },
    //(2) method create new comment
    newPostedComment(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.commentsCollection.insertOne(newComment);
            return result.acknowledged;
        });
    },
    //(3) method update comment by Id
    updateCommentById(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.commentsCollection.updateOne({ id: commentId }, {
                $set: {
                    content: content
                }
            });
            return result.matchedCount === 1;
        });
    },
    //(4) method delete comment by Id
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.commentsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    //(5) method returns comment by Id
    findCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.commentsCollection.findOne({ id: id }, { projection: { _id: 0, postId: 0 } });
            return result ? result : undefined;
        });
    },
};
