//Presentation Layer


//login
//new pair of tokens
//registration
//registration-confirmation
//resend-registration-code
//get info about current user


import cookieParser from 'cookie-parser';
import {Request, Response, Router} from "express";
import {oneOf, validationResult} from "express-validator";
import {authBusinessLayer} from "../BLL/auth-BLL";
import {
    usersLoginValidation1,
    usersEmailValidation1,
    usersPasswordValidation,
    usersLoginValidation,
    usersEmailValidation,
    codeValidation,
    usersEmailValidation2,
    tokenValidation1
} from "../middleware/input-validation-middleware";
import {authMiddleWare, checkRefreshToken} from "../middleware/authorization-middleware";
import {userBusinessLayer} from "../BLL/users-BLL";
import {createUserId} from "../application/findNonExistId";
import {emailsManager} from "../bussiness/bussiness-service";
import {jwtService} from "../application/jwt-service";
import {app} from "../index";
import jwt from "jsonwebtoken";


export const authRouter = Router({})


//login
authRouter.post('/login',
    oneOf([usersLoginValidation1, usersEmailValidation1]),
    usersPasswordValidation,
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
        const {loginOrEmail, password} = req.body
        //BLL
        const user = await authBusinessLayer.IsUserExist(loginOrEmail, password)
        //RETURN
        if (user) {
            const accessToken = await jwtService.createAccessJWT(user)
            const refreshToken = await jwtService.createRefreshJWT(user)
            res
                .cookie('refreshToken', refreshToken, {
                    maxAge: 24 * 60 * 60,
                    httpOnly: true,
                    secure: false
                })
                .status(200)
                .json({accessToken: accessToken})
        } else {
            res.sendStatus(401)
        }
    })


//new pair of tokens
authRouter.post('/refresh-token',
    checkRefreshToken,
    async (req: Request, res: Response) => {
        // Get the refreshToken from cookie
        const user = await jwtService.getUserByRefreshToken(req.cookies.refreshToken)
        res.status(200).json(user)
    })


//registration
authRouter.post('/registration',
    usersLoginValidation,
    usersPasswordValidation,
    usersEmailValidation,
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
        const {login, password, email} = req.body
        const userId = await createUserId()
        //BLL
        const user = await userBusinessLayer.newPostedUser(userId, login, password, email)
        //RETURN
        if (user) {
            res.status(204).send(user)
        } else {
            res.status(400)
        }
    })

//registration-confirmation
authRouter.post('/registration-confirmation',
    codeValidation,
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
        const code = req.body.code
        //BLL
        const result = await userBusinessLayer.confirmCodeFromEmail(code)
        //RETURN
        res.status(204).send(result)
    })

//resend-registration-code
authRouter.post('/registration-email-resending',
    usersEmailValidation2,
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
        const email = req.body.email
        //BLL
        const result = await emailsManager.sendEmailConfirmationMessageAgain(email)
        //RETURN
        res.status(204).send(result)
    })

//get info about current user
authRouter.get('/me',
    authMiddleWare,
    async (req: Request, res: Response) => {
        res.status(200).json({
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        })
    })