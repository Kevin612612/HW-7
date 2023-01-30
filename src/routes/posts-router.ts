//Presentation Layer




//(1)get     returns comments for specified post
//(2)post    create new comment
//(3)get     returns all posts
//(4)post    create new post
//(5)get     returns post by postId
//(6)put     update post by postId
//(7)delete  delete post by postId


import {Request, Response, Router} from "express";
import {
    blogIdValidationInBody,
    commentValidation,
    contentValidation,
    postIdValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middleware/input-validation-middleware";
import {validationResult} from "express-validator";
import {postBusinessLayer} from "../BLL/posts-BLL";
import {authMiddleWare, authorization} from "../middleware/authorization-middleware";


export const postsRouter = Router({})


//(1) returns comments for specified post
postsRouter.get('/:postId/comments',
    postIdValidation,
    async (req: Request, res: Response) => {
        //INPUT
        const postId = req.params.postId
        const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc"} = req.query;
        //BLL
        const allComments = await postBusinessLayer.allCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection)
        //RETURN
        res.status(200).send(allComments)
    })


//(2) create new comment
postsRouter.post('/:postId/comments',
    authMiddleWare,
    commentValidation,
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
        const userId = req.user!.id
        const userLogin = req.user!.login
        const postId = req.params.postId
        const content = req.body.content
        //BLL
        const comment = await postBusinessLayer.newPostedCommentByPostId(postId, content, userId, userLogin)
        //RETURN
        res.status(201).send(comment)
    })


//(3) returns all posts with paging
postsRouter.get('/', async (req: Request, res: Response) => {
    //INPUT
    const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc"} = req.query;
    //BLL
    const allPosts = await postBusinessLayer.allPosts(pageNumber, pageSize, sortBy, sortDirection)
    //RETURN
    res.status(200).send(allPosts)
})


//(4) create new post
postsRouter.post('/',
    authorization,
    blogIdValidationInBody,
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
        const {blogId, title, shortDescription, content} = req.body
        //BLL
        const newPost = await postBusinessLayer.newPostedPost(blogId, title, shortDescription, content)
        //RETURN
        res.status(201).send(newPost)
    })


//(5) get post by postId
postsRouter.get('/:postId',
    postIdValidation,
    async (req: Request, res: Response) => {
        //INPUT
        const postId = req.params.postId
        //BLL
        const post = await postBusinessLayer.findPostById(postId)
        //RETURN
        res.status(200).send(post)
    })


//(6) update post by postId
postsRouter.put('/:postId',
    authorization,
    blogIdValidationInBody,
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
        const postId = req.params.postId
        const {blogId, title, shortDescription, content} = req.body
        //BLL
        const post = await postBusinessLayer.updatePostById(postId, blogId, title, shortDescription, content)
        //RETURN
        res.status(204).send(post)
    })


//(7) delete post by postId
postsRouter.delete('/:postId',
    authorization,
    postIdValidation,
    async (req: Request, res: Response) => {
    //INPUT
    const postId = req.params.postId
    //BLL
    const result = await postBusinessLayer.deletePost(postId)
    //RETURN
    res.status(204).send(result)
})
