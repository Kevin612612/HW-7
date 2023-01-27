//Presentation Layer



//(1) create token
//(2) method returns user by token

import jwt from 'jsonwebtoken'
import {userDataModel} from "../types";

export const jwtService = {

    //(1) create token
    async createJWT(user: userDataModel) {
        // debugger
        const payload = {
            userId: user.id,
            login: user.login,
            email: user.email
        }
        const secretOrPrivateKey = process.env.JWT_secret!
        return jwt.sign(payload, secretOrPrivateKey, {expiresIn: '1h'});
    },


    //(2) method return user by token
    async getUserByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_secret!)
            return {
                userId: result.userId,
                login: result.login,
                email: result.email
            }
        } catch {
            return undefined
        }
    }
}