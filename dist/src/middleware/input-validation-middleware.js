"use strict";
//Middleware
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
exports.tokenValidation1 = exports.tokenValidation = exports.commentValidation = exports.codeValidation = exports.usersEmailValidation1 = exports.usersEmailValidation2 = exports.usersEmailValidation = exports.usersPasswordValidation = exports.usersLoginValidation1 = exports.usersLoginValidation = exports.usersIdExtractingFromBody = exports.userIdValidation = exports.contentValidation = exports.shortDescriptionValidation = exports.titleValidation = exports.postExtractingFromParams = exports.postIdValidation = exports.newWebSiteUrlValidation = exports.descriptionValidation = exports.nameValidation = exports.blogExtractingFromBody = exports.blogExtractingFromParams = exports.blogIdValidationInParams = exports.blogIdValidationInBody = void 0;
const express_validator_1 = require("express-validator");
const blogs_repository_db_1 = require("../repositories/blogs-repository-db");
const posts_repository_db_1 = require("../repositories/posts-repository-db");
const users_repository_db_1 = require("../repositories/users-repository-db");
const mongodb_1 = require("../repositories/mongodb");
//blogs validation
exports.blogIdValidationInBody = (0, express_validator_1.body)('blogId')
    .isLength({ max: 5 }); //здесь я схитрил))
exports.blogIdValidationInParams = (0, express_validator_1.param)('blogId')
    .isLength({ max: 5 }); //здесь я схитрил))
const blogExtractingFromParams = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_repository_db_1.blogsRepository.findBlogById(req.params.blogId);
    if (blog) {
        req.blog = yield blogs_repository_db_1.blogsRepository.findBlogById(req.params.blogId);
    }
    next();
});
exports.blogExtractingFromParams = blogExtractingFromParams;
const blogExtractingFromBody = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_repository_db_1.blogsRepository.findBlogById(req.body.blogId);
    if (blog) {
        req.blog = yield blogs_repository_db_1.blogsRepository.findBlogById(req.body.blogId);
    }
    next();
});
exports.blogExtractingFromBody = blogExtractingFromBody;
exports.nameValidation = (0, express_validator_1.body)('name')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ max: 15 });
exports.descriptionValidation = (0, express_validator_1.body)('description')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ max: 500 });
exports.newWebSiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .trim()
    .notEmpty()
    .isURL({ protocols: ['https'] })
    .isLength({ max: 100 });
//posts validation
exports.postIdValidation = (0, express_validator_1.param)('postId')
    .isLength({ max: 5 }); //здесь я схитрил))
const postExtractingFromParams = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_repository_db_1.postsRepository.findPostById(req.params.postId);
    if (post) {
        req.post = yield posts_repository_db_1.postsRepository.findPostById(req.params.postId);
    }
    next();
});
exports.postExtractingFromParams = postExtractingFromParams;
exports.titleValidation = (0, express_validator_1.body)('title')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ max: 30 });
exports.shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ max: 100 });
exports.contentValidation = (0, express_validator_1.body)('content')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ max: 1000 });
//user validation
exports.userIdValidation = (0, express_validator_1.param)('userId')
    .isLength({ max: 5 }); //здесь я схитрил))
const usersIdExtractingFromBody = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield mongodb_1.usersCollection.findOne({ id: req.params.userId });
    if (user) {
        req.user = yield users_repository_db_1.usersRepository.findUserByLoginOrEmail(user.accountData.login);
    }
    next();
});
exports.usersIdExtractingFromBody = usersIdExtractingFromBody;
//users' login validation
exports.usersLoginValidation = (0, express_validator_1.body)('login')
    .trim()
    .isLength({ min: 3, max: 10 })
    .matches('^[a-zA-Z0-9_-]*$')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const isValidUser = yield users_repository_db_1.usersRepository.findUserByLoginOrEmail(value);
    if (isValidUser)
        throw new Error('Login already exists');
    return true;
}));
exports.usersLoginValidation1 = (0, express_validator_1.body)('loginOrEmail')
    .trim()
    .isString()
    .isLength({ min: 3, max: 10 })
    .matches('^[a-zA-Z0-9_-]*$');
//users' password validation
exports.usersPasswordValidation = (0, express_validator_1.body)('password')
    .trim()
    .isLength({ min: 6, max: 20 });
//users' e-mail validation
exports.usersEmailValidation = (0, express_validator_1.body)('email')
    .trim()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_repository_db_1.usersRepository.findUserByLoginOrEmail(value);
    if (user)
        throw new Error('Email already exists');
    return true;
}));
exports.usersEmailValidation2 = (0, express_validator_1.body)('email')
    .trim()
    .isString()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_repository_db_1.usersRepository.findUserByLoginOrEmail(value);
    if (!user)
        throw new Error('User doesn\'t exist');
    return true;
}))
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_repository_db_1.usersRepository.findUserByLoginOrEmail(value);
    if ((user === null || user === void 0 ? void 0 : user.emailConfirmation.isConfirmed) === true)
        throw new Error('Email already confirmed');
    return true;
}));
exports.usersEmailValidation1 = (0, express_validator_1.body)('loginOrEmail')
    .trim()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
exports.codeValidation = (0, express_validator_1.body)('code')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    //find the user by code
    const user = yield users_repository_db_1.usersRepository.findUserByCode(value);
    //check if he exists
    if (!user)
        throw new Error('user with this code doesn\'t exist');
    return true;
}))
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    //find user by code
    const user = yield users_repository_db_1.usersRepository.findUserByCode(value);
    //check if his email already confirmed
    if ((user === null || user === void 0 ? void 0 : user.emailConfirmation.isConfirmed) == true)
        throw new Error('Code already confirmed');
    return true;
}));
//comment validation
exports.commentValidation = (0, express_validator_1.body)('content')
    .isLength({ min: 20, max: 300 });
//token validation
exports.tokenValidation = (0, express_validator_1.header)('authorization').isJWT();
exports.tokenValidation1 = (0, express_validator_1.cookie)('refreshToken').isJWT();
