import {blogViewModel, postViewModel, userDataModel} from "../repositories/mongodb";

//expanding type Request
declare global {
    declare namespace Express {
        export interface Request {
            user: userDataModel | undefined,
            blog: blogViewModel | undefined,
            post: postViewModel | undefined,
        }
    }
}


//BLOGS
//view type
export type blogViewModel = { id: string, name: string, description: string, websiteUrl: string, createdAt: Date }

//blogType returned by POST-method
export type blogsTypeSchema = { pagesCount: number, page: number, pageSize: number, totalCount: number, items: blogViewModel[] }


//POSTS
//view type
export type postViewModel = { id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string, createdAt: Date }

//postType returned by POST-method
export type PostsTypeSchema = { pagesCount: number, page: number, pageSize: number, totalCount: number, items: postViewModel[] }


//USERS
//view type
export type userViewModel = { id: string, login: string, email: string, createdAt: Date }

//data type
export type userDataModel = { id: string, login: string, email: string, createdAt: Date, passwordSalt: string, passwordHash: string }

//userType returned by POST-method
export type UsersTypeSchema = { pagesCount: number, page: number, pageSize: number, totalCount: number, items: userViewModel[] }


//COMMENTS
//view type
export type commentViewModel = {commentatorInfo: {
        userId: string,
        userLogin: string,
    }, id: string, content: string, createdAt: Date }

//data type
export type commentDataModel = { id: string, content: string, userId: string, userLogin: string, createdAt: Date, postId: string }

//userType returned by POST-method
export type CommentsTypeSchema = { pagesCount: number, page: number, pageSize: number, totalCount: number, items: commentViewModel[] }


//APIErrorResult
export type errors = { errorsMessages: fieldError[] }
type fieldError = { message: string, field: string }