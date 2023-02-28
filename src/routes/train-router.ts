import {Request, Response, Router} from "express";
import requestIp from 'request-ip';

import DeviceDetector from 'node-device-detector'
import {checkRefreshToken} from "../middleware/authorization-middleware";
import {refreshTokensBusinessLayer} from "../BLL/refresh-tokens-BLL";
import {deviceRouter} from "./security_devices-router";

export const trainRouter = Router({})


trainRouter.get('/detect', (req: Request, res: Response) => {
    const {type, os, browser} = req.device;
    res.send(`You are using a ${type} device running ${os} and using ${browser}.`);
    // res.send(req.device)
})


trainRouter.get('/detect1',
    function (req: Request, res: Response) {
        const detector = new DeviceDetector();

        const userAgent = req.headers['user-agent']
        const resultClient = detector.parseClient(userAgent!)
        // const botResult    = detector.parseBot(userAgent!)
        // const resultOs     = detector.parseOs(userAgent!)
        // const result       = detector.detect(userAgent!)

        // res.json({userAgent, resultClient, botResult, resultOs, result})
        res.json({userAgent, resultClient})

    })


trainRouter.get('/getIP',
    function (req: Request, res: Response) {
        const ipAddress1 = req.socket.remoteAddress
        const ipAddress2 = req.ip
        const ipAddress3 = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : 'none'
        const ipAddress4 = req.socket.remoteAddress;
        const ipAddress5 = requestIp.getClientIp(req);
        const Host = req.header('Host') ? req.header('Host') : 'none'
        const Token = req.header('Postman-Token') ? req.header('Postman-Token') : 'none'
        const userAgent = req.headers['user-agent']

        res.json({ipAddress1, ipAddress2, ipAddress3, ipAddress4, ipAddress5, Host, Token, userAgent})
    })


trainRouter.get('/devices',
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        res.json({refreshToken})
    })



