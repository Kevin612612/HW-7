//Presentation Layer


//get devices
//delete devices
//delete deviceId

import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {validationResult} from "express-validator";

import {refreshTokensBusinessLayer} from "../BLL/refresh-tokens-BLL";
import {checkRefreshToken} from "../middleware/authorization-middleware";
import {deviceIdValidation} from "../middleware/input-validation-middleware";



export const deviceRouter = Router({})

//get devices
deviceRouter.get('/devices',
    checkRefreshToken,
    async (req: Request, res: Response) => {
        //INPUT
        const refreshToken = req.cookies.refreshToken
        //BLL
        const allDevices = await refreshTokensBusinessLayer.allDevices(refreshToken)
        //RETURN
        res.status(200).send(allDevices)
    })

//delete devices
deviceRouter.delete('/devices',
    checkRefreshToken,
    async (req: Request, res: Response) => {
        //INPUT
        const refreshToken = req.cookies.refreshToken
        //BLL
        const allOtherDevices = await refreshTokensBusinessLayer.terminateAllOtherDevices(refreshToken)
        //RETURN
        res.status(204).send(allOtherDevices)
    })

//delete device
deviceRouter.delete('/devices/:deviceId',
    checkRefreshToken,
    deviceIdValidation,
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
            return res.status(401).json(result)
        }
        //INPUT
        const deviceId = req.params.deviceId
        const refreshToken = req.cookies.refreshToken
        const user = jwtService.getUserByRefreshToken(refreshToken)
        //BLL
        const result = refreshTokensBusinessLayer.terminateCurrentDevice(user.userId, deviceId)
        //RETURN
        res.status(204).send(result)
    })
