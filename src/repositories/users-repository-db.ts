//Data access Layer


//(1) allUsers
//(2) newPostedUser
//(3) deleteUser
//(4) findUserByLoginOrEmail
//(5) findUserByEmail
//(6) method returns user by code
//(7) method update status
//(8) method update code
//(9) method update date when the code was sent


import {userDataModel} from "../types";
import {usersCollection} from "./mongodb";


export const usersRepository = {

    //(1) method returns array of users
    async allUsers(sortBy: string, sortDirection: string, filter: any): Promise<userDataModel[]> {
        const order = (sortDirection === 'asc') ? 1 : -1

        return await usersCollection
            .find(filter, {projection: {_id: 0}})
            .sort(sortBy, order)
            .toArray();
    },


    //(2) method creates user
    async newPostedUser(newUser: userDataModel): Promise<boolean> {
        const result = await usersCollection.insertOne(newUser)
        return result.acknowledged;
    },


    //(3) method  delete user by Id
    async deleteUser(id: string): Promise<boolean | undefined> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },


    //(4) method returns user by loginOrEmail
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<userDataModel | undefined> {
        const result = await usersCollection.findOne({$or: [{"accountData.login": {$regex: loginOrEmail}}, {"accountData.email": {$regex: loginOrEmail}}]})
        return result ? result : undefined
    },

    //(5) method returns user by email
    async findUserByEmail(email: string): Promise<userDataModel | undefined> {
        const result = await usersCollection.findOne({"accountData.email": {$regex: `${email}`}})
        return result ? result : undefined
    },

    //(6) method returns user by code
    async findUserByCode(code: string): Promise<userDataModel | undefined> {
        const result = await usersCollection.findOne({"emailConfirmation.confirmationCode": code})
        return result ? result : undefined
    },

    //(7) method update status
    async updateStatus(user: userDataModel): Promise<boolean> {
        const result = await usersCollection.updateOne({id: user.id}, {
            $set: {"emailConfirmation.isConfirmed": true}
        })
        return result.matchedCount === 1
    },

    //(8) method update code and PUSH every new code into array
    async updateCode(user: userDataModel, code: string): Promise<boolean> {
        const result = await usersCollection.updateOne({id: user.id}, {
            $set: {"emailConfirmation.confirmationCode": code}
        })
        const result1 = await usersCollection.updateOne({id: user.id}, {
            $push: {codes: {code: code, sentAt: new Date()}}
        })
        return result.matchedCount === 1
    },
    //(9) method update date when the FIRST CODE was sent
    async updateDate(user: userDataModel, code: string): Promise<boolean> {
        const result = await usersCollection.updateOne({id: user.id}, {
            $set: {"codes": [{code: code, sentAt: new Date()}]}
        })
        return result.matchedCount === 1
    },

}
