//Presentation Layer


//login
//refresh tokens
//registration
//registration-confirmation
//resend-registration-code
//logout
//get info about current user

import {Request, Response, Router} from "express";
import {oneOf, validationResult} from "express-validator";
import requestIp from "request-ip";

import {authBusinessLayer} from "../BLL/auth-BLL";
import {
    usersLoginValidation1,
    usersEmailValidation1,
    usersPasswordValidation,
    usersLoginValidation,
    usersEmailValidation,
    codeValidation,
    usersEmailValidation2
} from "../middleware/input-validation-middleware";
import {authMiddleWare, checkRefreshToken} from "../middleware/authorization-middleware";
import {createDeviceId, createUserId} from "../application/findNonExistId";
import {userBusinessLayer} from "../BLL/users-BLL";
import {emailsManager} from "../bussiness/bussiness-service";
import {jwtService} from "../application/jwt-service";
import {usersRepository} from "../repositories/users-repository-db";
import {blackList} from "../repositories/mongodb";
import UAParser from "ua-parser-js";


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
        const ipAddress = requestIp.getClientIp(req)
        const userAgent = req.headers['user-agent']
        const parser = new UAParser(userAgent);
        const deviceName = parser.getResult().ua ? parser.getResult().ua : 'noname';
        const deviceId = await createDeviceId()
        //BLL
        const user = await authBusinessLayer.IsUserExist(loginOrEmail, password)
        //RETURN
        if (user) {
            //create the pair of tokens and put them into db
            const accessToken = await jwtService.createAccessJWT(user)
            const refreshToken = await jwtService.createRefreshJWT(user, deviceId!, deviceName!, ipAddress!)
            //send response with tokens
            res
                .cookie('refreshToken', refreshToken, {
                    // maxAge: 20000 * 1000,
                    maxAge: 20 * 1000,
                    httpOnly: true,
                    secure: true
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
        //INPUT
        const refreshToken = req.cookies.refreshToken
        const ipAddress1 = req.socket.remoteAddress;
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const deviceId = req.get('deviceId') ? req.get('deviceId') : '';
        const deviceName = req.get('deviceName') ? req.get('deviceName') : '';
        //BLL - since validation is passed, so we can add refreshToken in black list
        blackList.push(refreshToken)
        const _user = jwtService.getUserByRefreshToken(refreshToken)
        const user = await usersRepository.findUserByEmail(_user?.email)
        //RETURN
        if (user) {
            //create the pair of tokens and put them into db
            const accessToken = await jwtService.createAccessJWT(user)
            const refreshToken = await jwtService.createRefreshJWT(user, deviceId!, deviceName!, ipAddress1!)
            //send response with tokens
            res
                .cookie('refreshToken', refreshToken, {
                    // maxAge: 20000 * 1000,
                    maxAge: 20 * 1000,
                    httpOnly: true,
                    secure: true
                })
                .status(200)
                .json({accessToken: accessToken})
        } else {
            res.sendStatus(401)
        }
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


//logout
authRouter.post('/logout',
    checkRefreshToken,
    async (req: Request, res: Response) => {
        //make refreshToken Expired/Invalid
        const refreshToken = req.cookies.refreshToken;
        const result = await jwtService.makeRefreshTokenExpired(refreshToken)
        //clear the refreshToken from the cookies
        res.clearCookie('refreshToken').status(204).send('you\'re quit')
    })


//get info about current user
authRouter.get('/me',
    authMiddleWare,
    async (req: Request, res: Response) => {
        res.status(200).json({
            email: req.user!.accountData.email,
            login: req.user!.accountData.login,
            userId: req.user!.id
        })
    })