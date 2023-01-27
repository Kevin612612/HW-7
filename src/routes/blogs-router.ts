//Presentation Layer




//(1)get     returns all blogs
//(2)post    create  new blog
//(3)get     returns all posts by specific blog
//(4)post    create  new post for specific blog
//(5)get     returns blog by blogId
//(6)put     update  existing by blogId
//(7)delete  delete  blog by blogId

import {Request, Response, Router} from "express";
import {
    descriptionValidation,
    nameValidation,
    newWebSiteUrlValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidationInParams} from "../middleware/input-validation-middleware";
import {authorization} from "../middleware/authorization-middleware";
import {blogBusinessLayer} from "../BLL/blogs-BLL";
import {postBusinessLayer} from "../BLL/posts-BLL";
import {validationResult} from "express-validator";

export const blogsRouter = Router({})


//(1) returns all blogs with paging
blogsRouter.get('/', async (req: Request, res: Response) => {
    //INPUT
    const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm : "";
    const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
    const sortDirection = req.query.sortDirection ? req.query.sortDirection : "desc";
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    //BLL
    const allBlogs = await blogBusinessLayer.allBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)
    //RETURN
    res.status(200).send(allBlogs)
})


//(2) create new blog
blogsRouter.post('/',
    authorization,
    nameValidation,
    descriptionValidation,
    newWebSiteUrlValidation,
    async (req: Request, res: Response) => {
        //COLLECTION of ERRORS
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errs = errors.array({onlyFirstError: true})
            const result = {
                errorsMessages: errs.map(e => {
                    return {message: e.msg, field: e.param}
                })
            }
            return res.status(400).json(result)
        }
        //INPUT
        let {name, description, websiteUrl, id} = req.body
        //BLL
        const result = await blogBusinessLayer.newPostedBlog(name, description, websiteUrl, id)
        //RETURN
        res.status(201).send(result)
    })


//(3) returns all posts by specified blog
blogsRouter.get('/:blogId/posts',
    async (req: Request, res: Response) => {
        //INPUT
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : "desc";
        const blogId = req.params.blogId
        //BLL
        const posts = await blogBusinessLayer.allPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection)
        //RETURN
        res.status(200).send(posts)
    })


//(4) create new post for specific blog
blogsRouter.post('/:blogId/posts',
    authorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    async (req: Request, res: Response) => {
        //COLLECTION of ERRORS
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errs = errors.array({onlyFirstError: true})
            const result = {
                errorsMessages: errs.map(e => {
                    return {message: e.msg, field: e.param}
                })
            }
            return res.status(400).json(result)
        }
        //INPUT
        const blogId = req.params.blogId
        let {title, shortDescription, content} = req.body
        //BLL
        const post = await postBusinessLayer.newPostedPost(blogId, title, shortDescription, content)
        //RETURN
        res.status(201).send(post)
    })


//(5) returns blog by blogId
blogsRouter.get('/:blogId',
    blogIdValidationInParams,
    async (req: Request, res: Response) => {
        //INPUT
        const blogId = req.params.blogId
        //BLL
        const blog = await blogBusinessLayer.findBlogById(blogId)
        //RETURN
        res.status(200).send(blog)
    })


//(6) update existing blog by blogId with InputModel
blogsRouter.put('/:blogId',
    authorization,
    nameValidation,
    descriptionValidation,
    newWebSiteUrlValidation,
    async (req: Request, res: Response) => {
        //COLLECTION of ERRORS
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errs = errors.array({onlyFirstError: true})
            const result = {
                errorsMessages: errs.map(e => {
                    return {message: e.msg, field: e.param}
                })
            }
            return res.status(400).json(result)
        }
        //INPUT
        const blogId = req.params.blogId
        let {name, description, websiteUrl} = req.body
        //BLL
        const result = await blogBusinessLayer.updateBlogById(blogId, name, description, websiteUrl)
        //RETURN
        res.status(204).send(result)
    })


//(7) delete blog by blogId
blogsRouter.delete('/:blogId',
    authorization,
    blogIdValidationInParams,
    async (req: Request, res: Response) => {
        //INPUT
        const blogId = req.params.blogId
        //BLL
        const result = await blogBusinessLayer.deleteBlog(blogId)
        //RETURN
        res.status(204).send(result)
    })