//Presentation Layer




//(1)get     returns all users
//(2)post    create new user
//(3)delete  delete user by ID


import {Request, Response, Router} from "express";
import {userBusinessLayer} from "../BLL/users-BLL";
import {
    userIdValidation,
    usersEmailValidation, usersIdExtractingFromParams,
    usersLoginValidation,
    usersPasswordValidation
} from "../middleware/input-validation-middleware";
import {validationResult} from "express-validator";
import {authorization} from "../middleware/authorization-middleware";


export const usersRouter = Router({})

//(1) return all users
usersRouter.get('/',
    authorization,
    async (req: Request, res: Response) => {
        //INPUT
        let {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = req.query
        const a = pageNumber ? +pageNumber : 1
        const b = pageSize ? +pageSize : 10
        const c = sortBy ? sortBy : "createdAt"
        const d = sortDirection ? sortDirection : "desc"
        const e = searchLoginTerm ? searchLoginTerm : null
        const f = searchEmailTerm ? searchEmailTerm : null
        //BLL
        const allUsers = await userBusinessLayer.allUsers(a, b, c, d, e, f)
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
        let {id, login, password, email} = req.body
        //BLL
        const user = await userBusinessLayer.newPostedUser(id, login, password, email)
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
