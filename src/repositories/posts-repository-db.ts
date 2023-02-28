//Data access Layer



//(1) allPosts
//(2) allPostByBlogId
//(3) newPostedPost
//(4) findPostById
//(5) updatePostById
//(6) deletePost

import {postViewModel} from "../types/posts";
import {postsCollection} from "./mongodb";


export const postsRepository = {

    //(1) method returns posts by blogID
    async allPosts(blogId: string, sortBy: any, sortDirection: any): Promise<postViewModel[]> {
        const order = sortDirection === 'asc' ? 1 : -1; // порядок сортировки
        return await postsCollection
            .find({blogId: blogId}, {projection: {_id: 0}})
            .sort(sortBy, order)
            .toArray();
    },


    //(2) method returns all posts
    async allPostByBlogId(sortBy: any, sortDirection: any): Promise<postViewModel[]> {
        const order = sortDirection === 'asc' ? 1 : -1; // порядок сортировки
        return await postsCollection
            .find({}, {projection: {_id: 0}})
            .sort(sortBy, order)
            .toArray();
    },


    //(3) method posts new post
    async newPostedPost(newPost: postViewModel): Promise<boolean> {
        const result = await postsCollection.insertOne(newPost)
        return result.acknowledged;
    },


    //(4) method returns post by ID
    async findPostById(postId: string): Promise<postViewModel | undefined> {
        const post = await postsCollection.findOne({id: postId}, {projection: {_id: 0}})
        return post ? post : undefined
    },


    //(5) method updates post by ID
    async updatePostById(postId: string, blogId: string, blogName: string, title: string, shortDescription: string, content: string): Promise<boolean | number> {
        const result = await postsCollection.updateOne({id: postId}, {
            $set: {
                blogId: blogId,
                blogName: blogName,
                content: content,
                id: postId,
                shortDescription: shortDescription,
                title: title,
            }
        })
        return result.matchedCount === 1
    },

    //(6) method deletes by ID
    async deletePost(postId: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: postId})
        return result.deletedCount === 1
    }
}
