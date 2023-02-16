//Presentation Layer


//(1) create access token
//(2) create refresh token
//(3) method returns user by token
//(4) method return user by refresh-token
//(5) check if a token has expired
//(6) make refreshToken Invalid


import jwt from 'jsonwebtoken'
import {userDataModel} from "../types";
import {usersRepository} from "../repositories/users-repository-db";
import {blackList} from "../repositories/mongodb";

export const jwtService = {


    //(1) create access token
    async createAccessJWT(user: userDataModel) {
        //create token
        const payload = {
            userId: user.id,
            login: user.accountData.login,
            email: user.accountData.email
        }
        // const liveTime = 10000
        const liveTime = 10
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
        // const liveTime = 20000
        const liveTime = 20
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
        const user: any = jwt.verify(token, process.env.JWT_secret!)
        return {
            userId: user.userId,
            login: user.login,
            email: user.email
        }
    },


    //(4) method return user by refresh-token
    getUserByRefreshToken(token: string) {
        const user: any = jwt.verify(token, process.env.JWT_secret!)
        return {
            userId: user.userId,
            login: user.login,
            email: user.email,
        }
    },


    //(5)check if a token has expired
    async isTokenExpired(token: string): Promise<boolean> {
        try {
            const payload = jwt.verify(token, process.env.JWT_secret!) as { exp: number };
            const expirationTime = payload.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            return expirationTime < currentTime;
        } catch (error) {
            // Handle invalid token or other errors
            return true;
        }
    },


    //(6) make refreshToken Invalid
    async makeRefreshTokenExpired(token: string): Promise<boolean> {
        blackList.push(token)
        //decode user
        // const user: any = await jwt.verify(token, process.env.JWT_secret!)
        // //find user by decoded login
        // const userDb = await usersRepository.findUserByLoginOrEmail(user.login)
        // //del token from this user
        // const result =  await usersRepository.setRefreshTokenExpired(userDb!)
        return true
    },
}