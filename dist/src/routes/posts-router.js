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
exports.postsRouter = void 0;
//(1)get     returns comments for specified post
//(2)post    create new comment
//(3)get     returns all posts
//(4)post    create new post
//(5)get     returns post by postId
//(6)put     update post by postId
//(7)delete  delete post by postId
const express_1 = require("express");
const input_validation_middleware_1 = require("../middleware/input-validation-middleware");
const express_validator_1 = require("express-validator");
const posts_BLL_1 = require("../BLL/posts-BLL");
const authorization_middleware_1 = require("../middleware/authorization-middleware");
exports.postsRouter = (0, express_1.Router)({});
//(1) returns comments for specified post
exports.postsRouter.get('/:postId/comments', input_validation_middleware_1.postIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const postId = req.params.postId;
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
    const sortDirection = req.query.sortDirection ? req.query.sortDirection : "desc";
    //BLL
    const allComments = yield posts_BLL_1.postBusinessLayer.allCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection);
    //RETURN
    res.status(200).send(allComments);
}));
//(2) create new comment
exports.postsRouter.post('/:postId/comments', authorization_middleware_1.authMiddleWare, input_validation_middleware_1.commentValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const userId = req.user.id;
    const userLogin = req.user.login;
    const postId = req.params.postId;
    const content = req.body.content;
    //BLL
    const comment = yield posts_BLL_1.postBusinessLayer.newPostedCommentByPostId(postId, content, userId, userLogin);
    //RETURN
    res.status(201).send(comment);
}));
//(3) returns all posts with paging
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
    const sortDirection = req.query.sortDirection ? req.query.sortDirection : "desc";
    //BLL
    const allPosts = yield posts_BLL_1.postBusinessLayer.allPosts(pageNumber, pageSize, sortBy, sortDirection);
    //RETURN
    res.status(200).send(allPosts);
}));
//(4) create new post
exports.postsRouter.post('/', authorization_middleware_1.authorization, input_validation_middleware_1.blogIdValidationInBody, input_validation_middleware_1.titleValidation, input_validation_middleware_1.shortDescriptionValidation, input_validation_middleware_1.contentValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    let { blogId, title, shortDescription, content } = req.body;
    //BLL
    const newPost = yield posts_BLL_1.postBusinessLayer.newPostedPost(blogId, title, shortDescription, content);
    //RETURN
    res.status(201).send(newPost);
}));
//(5) get post by postId
exports.postsRouter.get('/:postId', input_validation_middleware_1.postIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const postId = req.params.postId;
    //BLL
    const post = yield posts_BLL_1.postBusinessLayer.findPostById(postId);
    //RETURN
    res.status(200).send(post);
}));
//(6) update post by postId
exports.postsRouter.put('/:postId', authorization_middleware_1.authorization, input_validation_middleware_1.blogIdValidationInBody, input_validation_middleware_1.titleValidation, input_validation_middleware_1.shortDescriptionValidation, input_validation_middleware_1.contentValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const postId = req.params.postId;
    const blogId = req.body.blogId;
    let { title, shortDescription, content } = req.body;
    //BLL
    const post = yield posts_BLL_1.postBusinessLayer.updatePostById(postId, blogId, title, shortDescription, content);
    //RETURN
    res.status(204).send(post);
}));
//(7) delete post by postId
exports.postsRouter.delete('/:postId', authorization_middleware_1.authorization, input_validation_middleware_1.postIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //INPUT
    const postId = req.params.postId;
    //BLL
    const result = yield posts_BLL_1.postBusinessLayer.deletePost(postId);
    //RETURN
    res.status(204).send(result);
}));
