//COMMENTS
//view type
export type commentViewModel = {
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
    id: string,
    content: string,
    createdAt: Date
}

//data type
export type commentDataModel = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: Date,
    postId: string
}

//commentType returned by POST-method
export type CommentsTypeSchema = { pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: commentViewModel[]
}
