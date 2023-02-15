//Presentation Layer


//login
//new pair of tokens
//registration
//registration-confirmation
//resend-registration-code
//logout
//get info about current user


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
    usersEmailValidation2
} from "../middleware/input-validation-middleware";
import {authMiddleWare, checkRefreshToken} from "../middleware/authorization-middleware";
import {userBusinessLayer} from "../BLL/users-BLL";
import {createUserId} from "../application/findNonExistId";
import {emailsManager} from "../bussiness/bussiness-service";
import {jwtService} from "../application/jwt-service";


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
            //create the pair of tokens and put them into db
            const accessToken = await jwtService.createAccessJWT(user)
            const refreshToken = await jwtService.createRefreshJWT(user)
            //send response with tokens
            res
                .cookie('refreshToken', refreshToken, {
                    maxAge: 120000,
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
        //take accessToken and refreshToken tokens from cookie
        const refreshToken = req.cookies.refreshToken
        const accessToken = req.cookies.accessToken
        // Set refreshToken in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        });
        // Return JWT accessToken body
        res.status(200).json({accessToken});
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
        //Clear the refreshToken from the cookies
        res.clearCookie('refreshToken');
        //RETURN
        res.status(204)
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