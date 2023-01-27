//Business Layer



//(1) allUsers
//(2) newPostedUser
//(3) deleteUser

import {userViewModel, UsersTypeSchema} from "../types";
import {usersRepository} from "../repositories/users-repository-db";
import bcrypt from "bcrypt"
import {usersCollection} from "../repositories/mongodb";

let countOfUsers = 0


export const userBusinessLayer = {

    //(1) this method returns all users to router
    async allUsers(pageNumber: number, pageSize: number, sortBy: any, sortDirection: any, searchLoginTerm: any, searchEmailTerm: any): Promise<UsersTypeSchema> {
        let filter = {}
        if (searchLoginTerm && searchEmailTerm) {
            filter = {
                $or: [{login: {$regex: searchLoginTerm, $options: 'i'}}, {
                    email: {
                        $regex: searchEmailTerm,
                        $options: 'i'
                    }
                }]
            }
        }
        if (searchLoginTerm && !searchEmailTerm) {
            filter = {login: {$regex: searchLoginTerm, $options: 'i'}}
        }
        if (!searchLoginTerm && searchEmailTerm) {
            filter = {email: {$regex: searchEmailTerm, $options: 'i'}}
        }
        if (!searchLoginTerm && !searchEmailTerm) {
            filter = {}
        }
        const sortedItems = await usersRepository.allUsers(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, filter)

        const quantityOfDocs = await usersCollection.countDocuments(filter)

        return {
            pagesCount: Math.ceil(quantityOfDocs / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: quantityOfDocs,
            items: sortedItems.slice((+pageNumber - 1) * (+pageSize), (+pageNumber) * (+pageSize)).map(e => {
                return {
                    id: e.id,
                    login: e.login,
                    email: e.email,
                    createdAt: e.createdAt,
                }
            })
        }
    },


    //(2) method creates user
    async newPostedUser(id: string, login: string, password: string, email: string): Promise<userViewModel | number> {
        countOfUsers++
        const idName: string = id ? id : countOfUsers.toString()

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)

        const newUser = {
            id: idName,
            login: login,
            email: email,
            passwordSalt,
            passwordHash,
            createdAt: new Date()
        }

        const result = await usersRepository.newPostedUser(newUser)

        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        };
    },


    //(3) method deletes by ID
    async deleteUser(userId: string): Promise<boolean | number> {
        const result =  await usersRepository.deleteUser(userId)
        return result ? result : 404
    },
}
