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
exports.postsRepository = void 0;
const mongodb_1 = require("./mongodb");
exports.postsRepository = {
    //(1) method returns posts by blogID
    allPosts(blogId, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = sortDirection === 'asc' ? 1 : -1; // порядок сортировки
            return yield mongodb_1.postsCollection
                .find({ blogId: blogId }, { projection: { _id: 0 } })
                .sort(sortBy, order)
                .toArray();
        });
    },
    //(2) method returns all posts
    allPostByBlogId(sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = sortDirection === 'asc' ? 1 : -1; // порядок сортировки
            return yield mongodb_1.postsCollection
                .find({}, { projection: { _id: 0 } })
                .sort(sortBy, order)
                .toArray();
        });
    },
    //(3) method posts new post
    newPostedPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.postsCollection.insertOne(newPost);
            return result.acknowledged;
        });
    },
    //(4) method returns post by ID
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield mongodb_1.postsCollection.findOne({ id: postId }, { projection: { _id: 0 } });
            return post ? post : undefined;
        });
    },
    //(5) method updates post by ID
    updatePostById(postId, blogId, blogName, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.postsCollection.updateOne({ id: postId }, {
                $set: {
                    blogId: blogId,
                    blogName: blogName,
                    content: content,
                    id: postId,
                    shortDescription: shortDescription,
                    title: title,
                }
            });
            return result.matchedCount === 1;
        });
    },
    //(6) method deletes by ID
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.postsCollection.deleteOne({ id: postId });
            return result.deletedCount === 1;
        });
    }
};
