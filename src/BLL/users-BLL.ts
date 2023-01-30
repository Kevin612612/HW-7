//Business Layer


//(1) allUsers
//(2) newPostedUser
//(3) deleteUser
//(4) confirm code

import {userViewModel, UsersTypeSchema} from "../types";
import {usersRepository} from "../repositories/users-repository-db";
import bcrypt from "bcrypt"
import {usersCollection} from "../repositories/mongodb";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {emailsManager} from "../bussiness/bussiness-service";

export const userBusinessLayer = {

    //(1) this method returns all users to router
    async allUsers(pageNumber: any, pageSize: any, sortBy: any, sortDirection: any, searchLoginTerm: any, searchEmailTerm: any): Promise<UsersTypeSchema> {
        //filter depends on if we have searchLoginTerm and/or searchEmailTerm

        // let filter = {};
        //
        // switch (searchLoginTerm && searchEmailTerm) {
        //     case (searchLoginTerm && searchEmailTerm):
        //         filter = {
        //             $or: [{"accountData.login": {$regex: searchLoginTerm, $options: "i"}}, {
        //                 "accountData.email": {
        //                     $regex: searchEmailTerm,
        //                     $options: "i"
        //                 }
        //             }]
        //         }
        //         break;
        //     case (searchLoginTerm && !searchEmailTerm):
        //         filter = {"accountData.login": {$regex: searchLoginTerm, $options: "i"}}
        //         break;
        //     case (!searchLoginTerm && searchEmailTerm):
        //         filter = {"accountData.email": {$regex: searchEmailTerm, $options: "i"}}
        //         break;
        //     case (!searchLoginTerm && !searchEmailTerm):
        //         filter = {};
        //         break;
        // }

        // x = a ? (b ? 11 : 10) : (b ? 01 : 00)
        const filter = searchLoginTerm ? searchEmailTerm ? {
            $or: [{
                "accountData.login": {
                    $regex: searchLoginTerm,
                    $options: "i"
                }
            }, {"accountData.email": {
                    $regex: searchEmailTerm,
                    $options: "i"}}]
        } : {"accountData.login": {
                    $regex: searchLoginTerm,
                    $options: "i"}} : searchEmailTerm ? {
            "accountData.email": {
                    $regex: searchEmailTerm,
                    $options: "i"
            }
        } : {};

        const sortedItems = await usersRepository.allUsers(sortBy, sortDirection, filter)

        const quantityOfDocs = await usersCollection.countDocuments(filter)

        return {
            pagesCount: Math.ceil(quantityOfDocs / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: quantityOfDocs,
            items: sortedItems.slice((+pageNumber - 1) * (+pageSize), (+pageNumber) * (+pageSize)).map(User => {
                return {
                    id: User.id,
                    login: User.accountData.login,
                    email: User.accountData.email,
                    createdAt: User.accountData.createdAt
                }
            })
        }
    },


    //(2) method creates user
    async newPostedUser(userId: string, login: string, password: string, email: string): Promise<userViewModel | number> {
        //check if user with such email exist
        const user = await usersCollection.findOne({"accountData.email": email})
        //if he doesn't exist then we create a new user
        if (!user) {
            //create a salt and hash
            const passwordSalt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, passwordSalt)
            const newUser = {
                id: userId,
                accountData: {
                    login: login,
                    email: email,
                    passwordSalt,
                    passwordHash,
                    createdAt: new Date()
                },
                emailConfirmation: {
                    confirmationCode: uuidv4(),
                    expirationDate: add(new Date(), {
                        hours: 10,
                        minutes: 3,
                    }),
                    isConfirmed: false,
                },
            }
            // put this new user in db
            const result = await usersRepository.newPostedUser(newUser)
            //send email from our account to this user's email
            try {
                const sendEmail = await emailsManager.sendEmailConfirmationMessage(newUser.accountData.email, newUser.emailConfirmation.confirmationCode)
                const s = sendEmail.accepted.toString()
                return {
                    id: newUser.id + ' user with email: ' + s + ' has received a letter with code',
                    login: newUser.accountData.login,
                    email: newUser.accountData.email,
                    createdAt: newUser.accountData.createdAt
                }
            } catch (error) {
                return 400 //email hasn't been sent
            }
        } else {
            return 400 //user with such email already exists
        }
    },


    //(3) method deletes by ID
    async deleteUser(userId: string): Promise<boolean | number> {
        const result = await usersRepository.deleteUser(userId)
        return result ? result : 404
    },

    //(4) confirm code
    async confirmCodeFromEmail(code: string): Promise<boolean | number> {
        const user = await usersRepository.findUserByCode(code)
        if (user && user.emailConfirmation.expirationDate > new Date()) {
            const changeStatus = await usersRepository.updateStatus(user)
            return 204
        }
        return 400
    },
}
