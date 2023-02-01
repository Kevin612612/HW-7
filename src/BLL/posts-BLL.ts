//Business Layer


//(1) allCommentsByPostId
//(2) newPostedCommentByPostId
//(3) allPosts
//(4) newPostedPost
//(5) findPostById
//(6) updatePostById
//(7) deletePost

import {
    postViewModel,
    PostsTypeSchema,
    CommentsTypeSchema,
    commentViewModel
} from "../types";
import {blogsRepository} from "../repositories/blogs-repository-db";
import {postsRepository} from "../repositories/posts-repository-db";
import {commentsRepository} from "../repositories/comments-repository-db";
import {commentsCollection, postsCollection} from "../repositories/mongodb";
import {createId} from "../application/findNonExistId";


export const postBusinessLayer = {

    //(1) this method return all comments by postId
    async allCommentsByPostId(postId: string,
                              pageNumber: any,
                              pageSize: any,
                              sortBy: any,
                              sortDirection: any): Promise<CommentsTypeSchema | number> {
        const foundPost = await postsRepository.findPostById(postId)

        if (foundPost) {
            const sortedItems = await commentsRepository.allComments(postId, sortBy, sortDirection);
            const quantityOfDocs = await commentsCollection.countDocuments({postId: postId})

            return {
                pagesCount: Math.ceil(quantityOfDocs / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: quantityOfDocs,
                items: sortedItems.slice((+pageNumber - 1) * (+pageSize), (+pageNumber) * (+pageSize))
            }
        } else {
            return 404
        }
    },


    //(2) creates new comment by postId
    async newPostedCommentByPostId(postId: string, content: string, userId: string, userLogin: string): Promise<commentViewModel | number> {
        const idName: string =  await createId(commentsCollection)

        const foundPost = await postsRepository.findPostById(postId)
        if (foundPost) {
            const newComment = {
                id: idName,
                content: content,
                commentatorInfo: {
                    userId: userId,
                    userLogin: userLogin,
                },
                createdAt: new Date(),
                postId: postId,
            }

            const result = await commentsRepository.newPostedComment(newComment)

            return {
                id: newComment.id,
                content: newComment.content,
                commentatorInfo: {
                    userId: newComment.commentatorInfo.userId,
                    userLogin: newComment.commentatorInfo.userLogin,
                },
                createdAt: newComment.createdAt,
            }
        } else {
            return 404
        }
    },


    //(3) this method return all posts
    async allPosts(pageNumber: any,
                   pageSize: any,
                   sortBy: any,
                   sortDirection: any): Promise<PostsTypeSchema | number> {

        const sortedItems = await postsRepository.allPostByBlogId(sortBy, sortDirection);
        const quantityOfDocs = await postsCollection.countDocuments({})

        return {
            pagesCount: Math.ceil(quantityOfDocs / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: quantityOfDocs,
            items: sortedItems.slice((pageNumber - 1) * (pageSize), (pageNumber) * pageSize)
        }
    },


    //(4) method creates post with specific blogId
    async newPostedPost(blogId: string,
                        title: string,
                        shortDescription: string,
                        content: any): Promise<postViewModel | number> {

        const idName: string =  await createId(postsCollection)

        const blog = await blogsRepository.findBlogById(blogId)
        if (blog) {
            const blogName = blog!.name

            const newPost: postViewModel = {
                id: idName,
                title: title,
                shortDescription: shortDescription,
                blogId: blogId,
                blogName: blogName,
                content: content,
                createdAt: new Date(),
            }
            const result = await postsRepository.newPostedPost(newPost)

            return {
                id: newPost.id,
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                content: newPost.content,
                createdAt: newPost.createdAt,
            }
        } else {
            return 404
        }
    },


    //(5) method take post by postId
    async findPostById(postId: string): Promise<postViewModel | number> {
        const result = await postsRepository.findPostById(postId)
        return result ? result : 404
    },


    //(6) method updates post by postId
    async updatePostById(postId: string, blogId: string, title: string, shortDescription: string, content: string): Promise<boolean | number> {
        const foundBlog = await blogsRepository.findBlogById(blogId)
        if (foundBlog) {
            const blogName = foundBlog.name
            const foundPost = await postsRepository.findPostById(postId)
            if (foundPost) {
                return await postsRepository.updatePostById(postId, blogId, blogName, title, shortDescription, content)
            } else {
                return 404
            }
        } else {
            return 404
        }
    },


    //(7) method deletes by postId
    async deletePost(postId: string): Promise<boolean | number> {
        const result = await postsRepository.deletePost(postId)
        return result ? result : 404
    },
}
