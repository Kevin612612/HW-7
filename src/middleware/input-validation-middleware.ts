//Middleware



import {body, param, header} from 'express-validator'
import {NextFunction, Request, Response} from "express";
import {blogsRepository} from "../repositories/blogs-repository-db";
import {postsRepository} from "../repositories/posts-repository-db";
import {usersRepository} from "../repositories/users-repository-db";
import {usersCollection} from "../repositories/mongodb";


//blogs validation

export const blogIdValidationInBody = body('blogId')
    .isLength({max: 5}) //здесь я схитрил))

export const blogIdValidationInParams = param('blogId')
    .isLength({max: 5}) //здесь я схитрил))

export const blogExtractingFromParams = async (req: Request, res: Response, next: NextFunction) => {
    const blog = await blogsRepository.findBlogById(req.params.blogId)
    if (blog) {
        req.blog = await blogsRepository.findBlogById(req.params.blogId)
    }
    next()
}

export const blogExtractingFromBody = async (req: Request, res: Response, next: NextFunction) => {
    const blog = await blogsRepository.findBlogById(req.body.blogId)
    if (blog) {
        req.blog = await blogsRepository.findBlogById(req.body.blogId)
    }
    next()
}


export const nameValidation = body('name')
    .trim()
    .notEmpty()
    .isString()
    .isLength({max: 15})

export const descriptionValidation = body('description')
    .trim()
    .notEmpty()
    .isString()
    .isLength({max: 500})

export const newWebSiteUrlValidation = body('websiteUrl')
    .trim()
    .notEmpty()
    .isURL({protocols: ['https']})
    .isLength({max: 100})


//posts validation

export const postIdValidation = param('postId')
    .isLength({max: 5}) //здесь я схитрил))

export const postExtractingFromParams = async (req: Request, res: Response, next: NextFunction) => {
    const post = await postsRepository.findPostById(req.params.postId)
    if (post) {
        req.post = await postsRepository.findPostById(req.params.postId)
    }
    next()
}

export const titleValidation = body('title')
    .trim()
    .notEmpty()
    .isString()
    .isLength({max: 30})

export const shortDescriptionValidation = body('shortDescription')
    .trim()
    .notEmpty()
    .isString()
    .isLength({max: 100})

export const contentValidation = body('content')
    .trim()
    .notEmpty()
    .isString()
    .isLength({max: 1000})


//user validation
export const userIdValidation = param('userId')
    .isLength({max: 5}) //здесь я схитрил))

export const usersIdExtractingFromBody = async (req: Request, res: Response, next: NextFunction) => {
    const user = await usersCollection.findOne({id: req.params.userId})
    if (user) {
        req.user = await usersRepository.findUserByLoginOrEmail(user.accountData.login)
    }
    next()
}

//users' login validation
export const usersLoginValidation = body('login')
    .trim()
    .isLength({min: 3, max: 10})
    .matches('^[a-zA-Z0-9_-]*$')
    .custom(async value => {
        const isValidUser = await usersRepository.findUserByLoginOrEmail(value)
        if (isValidUser) throw new Error('Login already exists')
        return true
    })

export const usersLoginValidation1 = body('loginOrEmail')
    .trim()
    .isString()
    .isLength({min: 3, max: 10})
    .matches('^[a-zA-Z0-9_-]*$')

//users' password validation
export const usersPasswordValidation = body('password')
    .trim()
    .isLength({min: 6, max: 20})

//users' e-mail validation
export const usersEmailValidation = body('email')
    .trim()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .custom(async value => {
        const user = await usersRepository.findUserByLoginOrEmail(value)
        if (user) throw new Error('Email already exists')
        return true
    })



export const usersEmailValidation2 = body('email')
    .trim()
    .isString()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .custom(async value => {
        const user = await usersRepository.findUserByLoginOrEmail(value)
        if (!user) throw new Error('User doesn\'t exist')
        return true
    })
    .custom(async value => {
        const user = await usersRepository.findUserByLoginOrEmail(value)
        if (user?.emailConfirmation.isConfirmed === true) throw new Error('Email already confirmed')
        return true
    })


export const usersEmailValidation1 = body('loginOrEmail')
    .trim()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')


export const codeValidation = body('code')
    .custom(async value => {
        const user = await usersRepository.findUserByCode(value)
        if (!user) throw new Error('user with this code doesn\'t exist')
        return true
    })
    .custom(async value => {
        const user = await usersRepository.findUserByCode(value)
        if (user?.emailConfirmation.isConfirmed == true) throw new Error('Code already confirmed')
        return true
    })



//comment validation
export const commentValidation = body('content')
    .isLength({min: 20, max: 300})

//token validation
export const tokenValidation = header('authorization').isJWT()