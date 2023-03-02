//Data access Layer


//(1) all devices
//(2) create token
//(3) find token by userId and deviceId
//(4) delete others
//(5) delete this
//(6) find by deviceId


import {refreshTokensCollection, usersCollection} from "./mongodb";
import {userDataModel} from "../types/users";
import {refreshTokensDataModel, RefreshTokensDataTypeSchema, RefreshTokensTypeSchema} from "../types/refreshTokens";

export const refreshTokensRepository = {

    //(1) method returns structured Array
    async allActiveDevices(userId: string): Promise<RefreshTokensDataTypeSchema> {
        return await refreshTokensCollection
            .find({$and: [{expiredAt: {$gt: new Date()}}, {userId: userId}]},
                {projection: {_id: 0, value: 0, userId: 0, expiredAt: 0}})
            .toArray();
    },

    //(2) method creates refreshToken
    async newCreatedToken(newToken: refreshTokensDataModel): Promise<boolean> {
        const result = await refreshTokensCollection.insertOne(newToken)
        return result.acknowledged;
    },

    //(3) method finds refreshToken by userId and deviceId
    async findTokenByUserIdAndDeviceId(userId: string, deviceId: string): Promise<string | undefined> {
        const result = await refreshTokensCollection.findOne({userId: userId, deviceId: deviceId})
        return result?.userId ? result.userId : undefined
    },

    //(4) method delete all tokens by this user  except current
    async deleteOthers(userId: string, deviceId: string): Promise<boolean> {
        const result = await refreshTokensCollection.deleteMany({"userId": userId, "deviceId": {$ne: deviceId}})
        return result.acknowledged
    },

    //(5) method delete token of this user
    async deleteOne(userId: string, deviceId: string): Promise<boolean> {
        const result = await refreshTokensCollection.deleteOne({"userId": userId, "deviceId": deviceId})
        return result.acknowledged
    },

    //(3) method finds by deviceId
    async findUserByDeviceId(deviceId: string): Promise<string | undefined> {
        const result = await refreshTokensCollection.findOne({deviceId: deviceId})
        return result?.deviceId
    },
}
