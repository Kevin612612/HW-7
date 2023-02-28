
"use strict";
//Presentation Layer
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
exports.testingRouter = void 0;
const express_1 = require("express");
const mongodb_1 = require("../repositories/mongodb");
exports.testingRouter = (0, express_1.Router)({});
//delete all-data
exports.testingRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const deleteEachCollection = collections.map(collection => mongodb_1.db.collection(collection).deleteMany({}));
    const result = yield Promise.all(deleteEachCollection);
    //getting
    const results = [];
    for (const collection of collections) {
        results.push(yield mongodb_1.db.collection(collection).find({}).toArray());
    }
    if (results.flat().length == 0) {
        res.send(204);
    }
}));
