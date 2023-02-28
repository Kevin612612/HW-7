//Presentation Layer


//get devices
//delete devices
//delete deviceId

import {Request, Response, Router} from "express";
import {checkRefreshToken} from "../middleware/authorization-middleware";
import {refreshTokensBusinessLayer} from "../BLL/refresh-tokens-BLL";
import {jwtService} from "../application/jwt-service";


export const deviceRouter = Router({})

//get devices - returns all devices with active sessions for current user
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

//get devices
deviceRouter.delete('/devices/deviceId',
    checkRefreshToken,
    async (req: Request, res: Response) => {
        //INPUT
        const deviceId = req.params.deviceId
        const refreshToken = req.cookies.refreshToken
        const user = jwtService.getUserByRefreshToken(refreshToken)
        //BLL
        const result = refreshTokensBusinessLayer.terminateCurrentDevice(user.userId, deviceId)
        //RETURN
        res.status(204).send(result)
    })
