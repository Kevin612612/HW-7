"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainRouter = void 0;
const express_1 = require("express");
const request_ip_1 = __importDefault(require("request-ip"));
const node_device_detector_1 = __importDefault(require("node-device-detector"));
exports.trainRouter = (0, express_1.Router)({});
exports.trainRouter.get('/detect', (req, res) => {
    const { type, os, browser } = req.device;
    res.send(`You are using a ${type} device running ${os} and using ${browser}.`);
    // res.send(req.device)
});
exports.trainRouter.get('/detect1', function (req, res) {
    const detector = new node_device_detector_1.default();
    const userAgent = req.headers['user-agent'];
    const resultClient = detector.parseClient(userAgent);
    // const botResult    = detector.parseBot(userAgent!)
    // const resultOs     = detector.parseOs(userAgent!)
    // const result       = detector.detect(userAgent!)
    // res.json({userAgent, resultClient, botResult, resultOs, result})
    res.json({ userAgent, resultClient });
});
exports.trainRouter.get('/getIP', function (req, res) {
    const ipAddress1 = req.socket.remoteAddress;
    const ipAddress2 = req.ip;
    const ipAddress3 = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : 'none';
    const ipAddress4 = req.socket.remoteAddress;
    const ipAddress5 = request_ip_1.default.getClientIp(req);
    const Host = req.header('Host') ? req.header('Host') : 'none';
    const Token = req.header('Postman-Token') ? req.header('Postman-Token') : 'none';
    const userAgent = req.headers['user-agent'];
    res.json({ ipAddress1, ipAddress2, ipAddress3, ipAddress4, ipAddress5, Host, Token, userAgent });
});
exports.trainRouter.get('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    res.json({ refreshToken });
}));
