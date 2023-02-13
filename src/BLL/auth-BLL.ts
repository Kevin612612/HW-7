//Business Layer




//(1) Does user exist and password correct

import {usersRepository} from "../repositories/users-repository-db";
import bcrypt from "bcrypt";
import {userDataModel} from "../types";


export const authBusinessLayer = {

    //(1) Does user exist and password correct
    async IsUserExist(loginOrEmail: string, password: string): Promise<userDataModel | undefined> {
        //находим пользователя по логину или email
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        //если такой есть то сравниваем его хэш с хэшом введенного пароля
        if (user) {
            const passwordHash = await bcrypt.hash(password, user.accountData.passwordSalt)
            if (passwordHash == user.accountData.passwordHash) {
                return user
            }
        }
        return undefined
    }
}

