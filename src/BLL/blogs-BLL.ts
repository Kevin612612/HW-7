//Business Layer



//(1) allBlogs
//(2) newPostedBlog
//(3) allPostsByBlogId
//(4) newPostedPostByBlogId
//(5) findBlogById
//(6) updateBlogById
//(7) deleteBlog

import {
    blogViewModel,
    blogsTypeSchema,
    PostsTypeSchema,
} from "../types";
import {blogsRepository} from "../repositories/blogs-repository-db";
import {postsRepository} from "../repositories/posts-repository-db";
import {blogsCollection, postsCollection} from "../repositories/mongodb";

let countOfBlogs = 0

export const blogBusinessLayer = {

    //(1) this method transform all found data and returns them to router
    async allBlogs(searchNameTerm: any,
                   sortBy: any,
                   sortDirection: any,
                   pageNumber: number,
                   pageSize: number): Promise<blogsTypeSchema> {
        const sortedItems = await blogsRepository.allBlogs(searchNameTerm, sortBy, sortDirection);
        const quantityOfDocs = await blogsCollection.countDocuments({name: {$regex: searchNameTerm, $options: 'i'}})
        return {
            pagesCount: Math.ceil(quantityOfDocs / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: quantityOfDocs,
            items: sortedItems.slice((pageNumber - 1) * (pageSize), (pageNumber) * (pageSize))
        }
    },



    //(2) method creates blog
    async newPostedBlog(name: string,
                        description: string,
                        websiteUrl: string,
                        id: string): Promise<blogViewModel> {
        countOfBlogs++
        const idName: string = id ? id : countOfBlogs.toString()

        const newBlog = {
            id: idName,
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date(),
        }

        const result = await blogsRepository.newPostedBlog(newBlog)

        return {
            id: newBlog.id,
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
        };
    },



    //(3) this method return all posts by blogId
    async allPostsByBlogId(blogId: string,
                           pageNumber: number,
                           pageSize: number,
                           sortBy: any,
                           sortDirection: any): Promise<PostsTypeSchema | number> {
        const foundBlog = await blogsRepository.findBlogById(blogId)
        if (foundBlog) {
            const sortedItems = await postsRepository.allPosts(blogId, sortBy, sortDirection);
            const quantityOfDocs = await postsCollection.countDocuments({blogId: blogId})

            return {
                pagesCount: Math.ceil(quantityOfDocs / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: quantityOfDocs,
                items: sortedItems.slice((pageNumber - 1) * (pageSize), (pageNumber) * (pageSize))
            }
        } else {
            return 404
        }
    },



    //(4) method create new post by blogId
    // this method is equal to post-BLL method



    //(5) method take blog by blogId
    async findBlogById(id: string): Promise<blogViewModel | number> {
        const result = await blogsRepository.findBlogById(id)
        return result ? result : 404
    },



    //(6) method updates blog by blogId
    async updateBlogById(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean | number> {
        const result = await blogsRepository.updateBlogById(blogId, name, description, websiteUrl)
        return result ? result : 404
    },



    //(7) method deletes by blogId
    async deleteBlog(id: string): Promise<boolean | number> {
        const result = await blogsRepository.deleteBlog(id)
        return result ? result : 404
    },
}
