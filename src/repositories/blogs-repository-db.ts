//Data access Layer



//(1) allBlogs
//(2) newPostedBlog
//(3) findBlogById
//(4) updateBlogById
//(5) deleteBlog

import {blogViewModel} from "../types";
import {blogsCollection} from "./mongodb";



export const blogsRepository = {

    //(1) method returns structured Array
    async allBlogs(searchNameTerm: string, sortBy: string, sortDirection: string): Promise<blogViewModel[]> {
        const order = (sortDirection == 'asc') ? 1 : -1; // порядок сортировки
        return await blogsCollection
            .find({name : {$regex : searchNameTerm, $options:'i'}}, {projection: {_id: 0}})
            .sort(sortBy, order)
            .toArray();
    },



    //(2) method posts new blog in Db
    async newPostedBlog(newBlog: blogViewModel): Promise<boolean> {
        const result = await blogsCollection.insertOne(newBlog)
        return result.acknowledged;
    },



    //(3) method returns blog by blogId
    async findBlogById(blogId: string): Promise<blogViewModel | undefined> {
        const result = await blogsCollection.findOne({id: blogId}, {projection: {_id: 0}})
        return result ? result : undefined
    },



    //(4) method updates blog by blogId
    async updateBlogById(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await blogsCollection.updateOne({id: blogId}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })
        return result.matchedCount === 1
    },

    //(5) method deletes blog by blogId
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
}
