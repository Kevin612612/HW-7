//Data access Layer


//(1) allUsers
//(2) newPostedUser
//(3) deleteUser
//(4) findUserByLoginOrEmail
//(5) method returns user by code
//(6) method update status


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

    //(5) method returns user by code
    async findUserByCode(code: string): Promise<userDataModel | undefined> {
        const result = await usersCollection.findOne({"emailConfirmation.confirmationCode": code})
        return result ? result : undefined
    },

    //(6) method update status
    async updateStatus(user: userDataModel): Promise<boolean> {
        const result = await usersCollection.updateOne({id: user.id}, {
            $set: {"emailConfirmation.isConfirmed": true}
        })
        return result.matchedCount === 1
    },

}
