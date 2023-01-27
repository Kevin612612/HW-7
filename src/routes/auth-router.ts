//Presentation Layer


import {Request, Response, Router} from "express";
import {oneOf, validationResult} from "express-validator";
import {authBusinessLayer} from "../BLL/auth-BLL";
import {
    usersLoginValidation1,
    usersEmailValidation1,
    usersPasswordValidation
} from "../middleware/input-validation-middleware";
import {jwtService} from "../application/jwt-service";
import {authMiddleWare} from "../middleware/authorization-middleware";


export const authRouter = Router({})

//AUTH
authRouter.post('/login',
    oneOf([usersLoginValidation1, usersEmailValidation1]),
    usersPasswordValidation,
    async (req: Request, res: Response) => {
        // debugger
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
        const loginOrEmail = req.body.loginOrEmail
        const password = req.body.password
        //BLL
        const userToken = await authBusinessLayer.IsUserExist(loginOrEmail, password)
        //RETURN
        if (userToken) {
            res.status(200).send({
                "accessToken": userToken
            })
        } else {
            res.sendStatus(401)
        }
    })


authRouter.get('/me',
    authMiddleWare,
    async (req: Request, res: Response) => {
        res.status(200).json({
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        })
    })