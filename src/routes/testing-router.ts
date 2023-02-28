//Presentation Layer




import {Request, Response, Router} from "express";
import {blogViewModel} from "../types/blogs";
import {postViewModel} from "../types/posts";

import {db} from "../repositories/mongodb";

export const testingRouter = Router({})

//delete all-data
testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    /*const a = await db.collection<blogViewModel>("blogs").deleteMany({})
    const b = await db.collection<postViewModel>("posts").deleteMany({})
    const c = await db.collection<userViewModel>("users").deleteMany({})
    const d = await db.collection<commentViewModel>("comments").deleteMany({})

    const result1 = await db.collection<blogViewModel>("blogs").find({}).toArray()
    const result2 = await db.collection<blogViewModel>("posts").find({}).toArray()
    const result3 = await db.collection<userViewModel>("users").find({}).toArray()
    const result4 = await db.collection<userViewModel>("comments").find({}).toArray()

    if (result1.length == 0 && result2.length == 0 && result3.length == 0 && result4.length == 0) {
        res.send(204)
    }*/

    const collections = ["blogs", "posts", "users", "comments"];
    //deleting
    const deleteEachCollection = collections.map(collection => db.collection(collection).deleteMany({}));
    const result = await Promise.all(deleteEachCollection);
    //getting
    const results = [];
    for (const collection of collections) {
        results.push(await db.collection(collection).find({}).toArray());
    }

    if (results.flat().length == 0) {
        res.send(204)
    }
})