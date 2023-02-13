//Presentation Layer


//(1) create access token
//(2) create refresh token
//(3) method returns user by token
//(4) method return user by refresh-token


import jwt from 'jsonwebtoken'
import {userDataModel} from "../types";
import {usersRepository} from "../repositories/users-repository-db";

export const jwtService = {

    //(1) create access token
    async createAccessJWT(user: userDataModel) {
        //create token
        const payload = {
            userId: user.id,
            login: user.accountData.login,
            email: user.accountData.email
        }
        const liveTime = 24*3600*1000 //24hours in ms
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_secret!,
            {expiresIn: liveTime + "s"}
        )
        //put it into db in user schema
        const result = await usersRepository.addAccessToken(user, accessToken, liveTime)
        return accessToken
    },


    //(2) create refresh token
    async createRefreshJWT(user: userDataModel) {
        const payload = {
            userId: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
        }
        const liveTime = 24*3600*1000 //24hours in ms
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_secret!,
            {expiresIn: liveTime + "s"}
        )
        //put it into db in user schema
        const result = await usersRepository.addRefreshToken(user, refreshToken, liveTime)
        return refreshToken
    },


    //(3) method return user by access-token
    getUserByAccessToken(token: string) {
        try {
            const user: any = jwt.verify(token, process.env.JWT_secret!)
            return {
                userId: user.userId,
                login: user.login,
                email: user.email
            }
        } catch {
            return undefined
        }
    },


    //(4) method return user by refresh-token
    async getUserByRefreshToken(token: string) {
        try {
            const user: any = await jwt.verify(token, process.env.JWT_secret!)
            return {
                userId: user.id,
                login: user.accountData.login,
                email: user.accountData.email,
            }
        } catch {
            return undefined
        }
    }
}