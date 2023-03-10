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
    usersEmailValidation2, checkRequestNumber
} from "../middleware/input-validation-middleware";
import {authMiddleWare, checkRefreshToken} from "../middleware/authorization-middleware";
import {createDeviceId, createUserId} from "../application/findNonExistId";
import {userBusinessLayer} from "../BLL/users-BLL";
import {emailsManager} from "../bussiness/bussiness-service";
import {jwtService} from "../application/jwt-service";
import {usersRepository} from "../repositories/users-repository-db";
import {blackList} from "../repositories/mongodb";
import UAParser from "ua-parser-js";
import {refreshTokensRepository} from "../repositories/refreshTokens-repository-db";


export const authRouter = Router({})


//login
authRouter.post('/login',
    checkRequestNumber,
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
        const deviceId = req.body.deviceId ? req.body.deviceId : await createDeviceId()
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
    checkRequestNumber,
    checkRefreshToken,
    async (req: Request, res: Response) => {
        //INPUT
        const refreshToken = req.cookies.refreshToken
        const ipAddress = req.socket.remoteAddress;
        const userAgent = req.headers['user-agent']
        const parser = new UAParser(userAgent);
        const deviceName = parser.getResult().ua ? parser.getResult().ua : 'noname';
        const payload = jwtService.getUserByRefreshToken(refreshToken)
        const deviceId = payload.deviceId
        const user = await usersRepository.findUserByLoginOrEmail(payload?.login)
        //BLL
        //since validation is passed, so we can add refreshToken in black list
        blackList.push(refreshToken)
        //...and delete from DB
        const deleteRefreshToken = await refreshTokensRepository.deleteOne(user!.id, deviceId)
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


//registration
authRouter.post('/registration',
    checkRequestNumber,
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
    checkRequestNumber,
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
    checkRequestNumber,
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
        //INPUT
        const refreshToken = req.cookies.refreshToken
        const payload = jwtService.getUserByRefreshToken(refreshToken)
        //BLL
        //make refreshToken Expired/Invalid
        const result = await jwtService.makeRefreshTokenExpired(refreshToken)
        //...and delete from DB
        const deleteRefreshToken = await refreshTokensRepository.deleteOne(payload.userId, payload.deviceId)
        //RETURN
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