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
exports.blogBusinessLayer = void 0;
const blogs_repository_db_1 = require("../repositories/blogs-repository-db");
const posts_repository_db_1 = require("../repositories/posts-repository-db");
const mongodb_1 = require("../repositories/mongodb");
let countOfBlogs = 0;
exports.blogBusinessLayer = {
    //(1) this method transform all found data and returns them to router
    allBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortedItems = yield blogs_repository_db_1.blogsRepository.allBlogs(searchNameTerm, sortBy, sortDirection);
            const quantityOfDocs = yield mongodb_1.blogsCollection.countDocuments({ name: { $regex: searchNameTerm, $options: 'i' } });
            return {
                pagesCount: Math.ceil(quantityOfDocs / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: quantityOfDocs,
                items: sortedItems.slice((pageNumber - 1) * (pageSize), (pageNumber) * (pageSize))
            };
        });
    },
    //(2) method creates blog
    newPostedBlog(name, description, websiteUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            countOfBlogs++;
            const idName = id ? id : countOfBlogs.toString();
            const newBlog = {
                id: idName,
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date(),
            };
            const result = yield blogs_repository_db_1.blogsRepository.newPostedBlog(newBlog);
            return {
                id: newBlog.id,
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
                createdAt: newBlog.createdAt,
            };
        });
    },
    //(3) this method return all posts by blogId
    allPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield blogs_repository_db_1.blogsRepository.findBlogById(blogId);
            if (foundBlog) {
                const sortedItems = yield posts_repository_db_1.postsRepository.allPosts(blogId, sortBy, sortDirection);
                const quantityOfDocs = yield mongodb_1.postsCollection.countDocuments({ blogId: blogId });
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
    //(4) method create new post by blogId
    // this method is equal to post-BLL method
    //(5) method take blog by blogId
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_repository_db_1.blogsRepository.findBlogById(id);
            return result ? result : 404;
        });
    },
    //(6) method updates blog by blogId
    updateBlogById(blogId, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_repository_db_1.blogsRepository.updateBlogById(blogId, name, description, websiteUrl);
            return result ? result : 404;
        });
    },
    //(7) method deletes by blogId
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_repository_db_1.blogsRepository.deleteBlog(id);
            return result ? result : 404;
        });
    },
};
