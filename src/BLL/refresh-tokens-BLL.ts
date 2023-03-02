//Business Layer


//(1) get all active devices

import {blogsTypeSchema} from "../types/blogs";
import {blogsRepository} from "../repositories/blogs-repository-db";
import {blogsCollection} from "../repositories/mongodb";
import {refreshTokensRepository} from "../repositories/refreshTokens-repository-db";
import {refreshTokensDataModel, RefreshTokensTypeSchema} from "../types/refreshTokens";
import {jwtService} from "../application/jwt-service";

export const refreshTokensBusinessLayer = {

    //(1) this method transform all found data and returns them to router
    async allDevices(refreshToken: string): Promise<RefreshTokensTypeSchema> {
        //find refreshToken by value and return userId
        const userId = jwtService.getUserByRefreshToken(refreshToken).userId
        //find all refreshTokens by that userId and non expired date
        if (userId) {
            const result = await refreshTokensRepository.allActiveDevices(userId)
            return result.map(result => {
                return {
                    ip: result.IP,
                    title: result.deviceName,
                    deviceId: result.deviceId,
                    lastActiveDate: result.createdAt,
                }
            })
        }
        return []
    },


    //(2) this method terminates all other devices
    async terminateAllOtherDevices(refreshToken: string): Promise<boolean> {
        const payload = jwtService.getUserByRefreshToken(refreshToken)
        if (payload) {
            return await refreshTokensRepository.deleteOthers(payload.userId, payload.deviceId)
        }
        return false
    },

    //(3) this method terminates current devices
    async terminateCurrentDevice(userId: string, deviceId: string): Promise<boolean | number> {
        const result = await refreshTokensRepository.deleteOne(userId, deviceId)
        return result ? result : 404
    },


}