"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createId = void 0;
const createId = (collection) => __awaiter(void 0, void 0, void 0, function* () {
    let id = 1;
    while (id) {
        let obj = yield collection.findOne({ id: id.toString() });
        if (!obj) {
            break;
        }
        id++;
    }
    return id.toString();
});
exports.createId = createId;
//
// export const createUserId  = async (): Promise<string> => {
//     let userId = 1
//     while (userId) {
//         let user = await usersCollection.findOne({id: userId.toString()})
//         if (!user) {break}
//         userId++
//     }
//     return userId.toString();
// }
//
// export const createBlogId  = async (): Promise<string> => {
//     let blogId = 1
//     while (blogId) {
//         let blog = await blogsCollection.findOne({id: blogId.toString()})
//         if (!blog) {break}
//         blogId++
//     }
//     return blogId.toString();
// }
//
// export const createPostId  = async (): Promise<string> => {
//     let postId = 1
//     while (postId) {
//         let post = await postsCollection.findOne({id: postId.toString()})
//         if (!post) {break}
//         postId++
//     }
//     return postId.toString();
// }
//
// export const createCommentId  = async (): Promise<string> => {
//     let commentId = 1
//     while (commentId) {
//         let post = await commentsCollection.findOne({id: commentId.toString()})
//         if (!post) {break}
//         commentId++
//     }
//     return commentId.toString();
// }
//
