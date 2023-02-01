//Presentation Layer




//(1)get     returns all users
//(2)post    create new user
//(3)delete  delete user by ID


import {Request, Response, Router} from "express";
import {userBusinessLayer} from "../BLL/users-BLL";
import {
    usersEmailValidation,
    usersLoginValidation,
    usersPasswordValidation
} from "../middleware/input-validation-middleware";
import {validationResult} from "express-validator";
import {authorization} from "../middleware/authorization-middleware";
import {createUserId} from "../application/findNonExistId";


export const usersRouter = Router({})

//(1) return all users
usersRouter.get('/',
    authorization,
    async (req: Request, res: Response) => {
        //INPUT
        const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = req.query;
        const searchLoginTerm =  req.query.searchLoginTerm ? req.query.searchLoginTerm : null
        const searchEmailTerm =  req.query.searchEmailTerm ? req.query.searchEmailTerm : null
        //BLL
        const allUsers = await userBusinessLayer.allUsers(pageNumber, pageSize , sortBy, sortDirection, searchLoginTerm, searchEmailTerm)
        //RETURN
        res.status(200).send(allUsers)
    })


//(2) create new user
usersRouter.post('/',
    authorization,
    usersLoginValidation,
    usersPasswordValidation,
    usersEmailValidation,
    async (req: Request, res: Response) => {
        //COLLECTION of ERRORS
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errs = errors.array({onlyFirstError: true})
            const result = {errorsMessages: errs.map(e => {return {message: e.msg, field: e.param}})}
            return res.status(400).json(result)
        }
        //INPUT
        const {login, password, email} = req.body
        const userId = await createUserId()
        //BLL
        const user = await userBusinessLayer.newPostedUser(userId, login, password, email)
        //RETURN
        res.status(201).send(user)
    })


//(3) delete user bu userId
usersRouter.delete('/:userId',
    authorization,
    async (req: Request, res: Response) => {
        //COLLECTION of ERRORS
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errs = errors.array({onlyFirstError: true})
            const result = {errorsMessages: errs.map(e => {return {message: e.msg, field: e.param}})}
            return res.status(400).json(result)
        }
        //INPUT
        const userId = req.params.userId
        //BLL
        const user = await userBusinessLayer.deleteUser(userId)
        //RETURN
        res.status(204).send(user)
    })
