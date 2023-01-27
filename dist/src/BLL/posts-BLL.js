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
exports.postBusinessLayer = void 0;
const blogs_repository_db_1 = require("../repositories/blogs-repository-db");
const posts_repository_db_1 = require("../repositories/posts-repository-db");
const comments_repository_db_1 = require("../repositories/comments-repository-db");
const mongodb_1 = require("../repositories/mongodb");
let countOfPosts = 0;
let countOfComments = 0;
exports.postBusinessLayer = {
    //(1) this method return all comments by postId
    allCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield posts_repository_db_1.postsRepository.findPostById(postId);
            if (foundPost) {
                const sortedItems = yield comments_repository_db_1.commentsRepository.allComments(postId, sortBy, sortDirection);
                const quantityOfDocs = yield mongodb_1.commentsCollection.countDocuments({ postId: postId });
                return {
                    pagesCount: Math.ceil(quantityOfDocs / pageSize),
                    page: pageNumber,
                    pageSize: pageSize,
                    totalCount: quantityOfDocs,
                    items: sortedItems.slice((pageNumber - 1) * (pageSize), (pageNumber) * (pageSize))
                };
            }
            else {
                return 404;
            }
        });
    },
    //(2) creates new comment by postId
    newPostedCommentByPostId(postId, content, userId, userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            countOfComments++;
            // const idName: string = id ? id : countOfComments.toString()
            const foundPost = yield posts_repository_db_1.postsRepository.findPostById(postId);
            if (foundPost) {
                const newComment = {
                    commentatorInfo: {
                        userId: userId,
                        userLogin: userLogin,
                    },
                    content: content,
                    createdAt: new Date(),
                    id: countOfComments.toString(),
                    postId: postId,
                };
                const result = yield comments_repository_db_1.commentsRepository.newPostedComment(newComment);
                return {
                    commentatorInfo: {
                        userId: newComment.commentatorInfo.userId,
                        userLogin: newComment.commentatorInfo.userLogin,
                    },
                    content: newComment.content,
                    createdAt: newComment.createdAt,
                    id: newComment.id
                };
            }
            else {
                return 404;
            }
        });
    },
    //(3) this method return all posts
    allPosts(pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortedItems = yield posts_repository_db_1.postsRepository.allPostByBlogId(sortBy, sortDirection);
            const quantityOfDocs = yield mongodb_1.postsCollection.countDocuments({});
            return {
                pagesCount: Math.ceil(quantityOfDocs / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: quantityOfDocs,
                items: sortedItems.slice((pageNumber - 1) * (pageSize), (pageNumber) * pageSize)
            };
        });
    },
    //(4) method creates post with specific blogId
    newPostedPost(blogId, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            countOfPosts++;
            const blog = yield blogs_repository_db_1.blogsRepository.findBlogById(blogId);
            if (blog) {
                const blogName = blog.name;
                const newPost = {
                    id: countOfPosts.toString(),
                    title: title,
                    shortDescription: shortDescription,
                    blogId: blogId,
                    blogName: blogName,
                    content: content,
                    createdAt: new Date(),
                };
                const result = yield posts_repository_db_1.postsRepository.newPostedPost(newPost);
                return {
                    id: newPost.id,
                    title: newPost.title,
                    shortDescription: newPost.shortDescription,
                    blogId: newPost.blogId,
                    blogName: newPost.blogName,
                    content: newPost.content,
                    createdAt: newPost.createdAt,
                };
            }
            else {
                return 404;
            }
        });
    },
    //(5) method take post by postId
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield posts_repository_db_1.postsRepository.findPostById(postId);
            return result ? result : 404;
        });
    },
    //(6) method updates post by postId
    updatePostById(postId, blogId, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield blogs_repository_db_1.blogsRepository.findBlogById(blogId);
            if (foundBlog) {
                const blogName = foundBlog.name;
                const foundPost = yield posts_repository_db_1.postsRepository.findPostById(postId);
                if (foundPost) {
                    return yield posts_repository_db_1.postsRepository.updatePostById(postId, blogId, blogName, title, shortDescription, content);
                }
                else {
                    return 404;
                }
            }
            else {
                return 404;
            }
        });
    },
    //(7) method deletes by postId
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield posts_repository_db_1.postsRepository.deletePost(postId);
            return result ? result : 404;
        });
    },
};
