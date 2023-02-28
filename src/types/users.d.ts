//USERS
//view type
export type userViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: Date
}


type codeDataType = {
    code: string,
    sentAt: Date
}

type TokenType = {
    value: string,
    createdAt: Date,
    expiredAt: Date

}

export type userDataModel = {
    id: string,
    accountData: {
        login: string,
        email: string,
        passwordSalt,
        passwordHash,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean,
    },
    codes: codeDataType[],
    tokens: {
        accessTokens: TokenType[],
        refreshTokens: TokenType[]
    }
}

//userType returned by POST-method
export type UsersTypeSchema = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: userViewModel[]
}
