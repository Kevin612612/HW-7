//Middleware



//Basic Authorization
//Bearer Authorization
//Refresh token validation



import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersRepository} from "../repositories/users-repository-db";


//Basic Authorization
export const authorization = (req: Request, res: Response, next: NextFunction) => {
    //check if entered password encoded in base 64 is correct
    if (req.headers.authorization == 'Basic YWRtaW46cXdlcnR5') { //decoded in Base64 password
        next()
    } else {
        res.status(401).send("Unauthorized")
    }
}


//Bearer Authorization
export const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    //retrieve user from token payload (if exists) and put it into request
    const auth = req.headers.authorization
    const typeOfAuth = req.headers.authorization?.split(' ')[0].trim()
    const dotInToken = req.headers.authorization?.split(' ')[1].trim().includes('.')
    if (!auth || typeOfAuth != 'Bearer' || !dotInToken) { //token is absent in headers
        res.sendStatus(401)
        return
    }
    //
    const token = req.headers.authorization!.split(' ')[1]  //token is in headers: 'bearer algorithmSecretKey.payload.kindOfHash'
    const tokenExpired = await jwtService.isTokenExpired(token)
    if (tokenExpired) {
        return res.status(401).send({error: 'Token has expired'});
    }
    //
    const userDecoded = await jwtService.getUserByAccessToken(token) //get user from payload
    if (userDecoded) {
        req.user = await usersRepository.findUserByLoginOrEmail(userDecoded.login) //get user from db by user.login and take it into body
        next()
    }
    return 401 //we don't get user from headers.authorization
}


//check if refresh token exists and is valid
export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    //take the refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    //check if it exists
    if (!refreshToken) {
        return res.status(401).send({error: 'Refresh token is not found'});
    }

    try {
        const user = await jwtService.getUserByRefreshToken(refreshToken)
        //does user from this token exist?
        if (!user) {
            return res.status(401).send({error: 'Incorrect token'});
        }
        //has the token expired?
        const tokenExpired = await jwtService.isTokenExpired(refreshToken)
        if (tokenExpired) {
            return res.status(401).send({error: 'Token has expired'});
        }
    } catch (err) {
        return res.status(401).send({error: 'Invalid token'});
    }

    next();
};