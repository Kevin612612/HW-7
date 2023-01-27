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
    const a = yield mongodb_1.db.collection("blogs").deleteMany({});
    const b = yield mongodb_1.db.collection("posts").deleteMany({});
    const c = yield mongodb_1.db.collection("users").deleteMany({});
    const d = yield mongodb_1.db.collection("comments").deleteMany({});
    const result1 = yield mongodb_1.db.collection("blogs").find({}).toArray();
    const result2 = yield mongodb_1.db.collection("posts").find({}).toArray();
    const result3 = yield mongodb_1.db.collection("users").find({}).toArray();
    const result4 = yield mongodb_1.db.collection("comments").find({}).toArray();
    if ((result1 === null || result1 === void 0 ? void 0 : result1.length) == 0 && (result2 === null || result2 === void 0 ? void 0 : result2.length) == 0 && (result3 === null || result3 === void 0 ? void 0 : result3.length) == 0 && (result4 === null || result4 === void 0 ? void 0 : result4.length) == 0) {
        res.send(204);
    }
}));
