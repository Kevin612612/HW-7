"use strict";
//this repository has to be async
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.blackList = exports.runDb = exports.refreshTokensCollection = exports.commentsCollection = exports.usersCollection = exports.postsCollection = exports.blogsCollection = exports.db = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
//connection to mongodb
const mongoUri = process.env.MONGO_URL; // || "mongodb://0.0.0.0:27017";
exports.client = new mongodb_1.MongoClient(mongoUri);
exports.db = exports.client.db("hosting");
exports.blogsCollection = exports.db.collection("blogs");
exports.postsCollection = exports.db.collection("posts");
exports.usersCollection = exports.db.collection("users");
exports.commentsCollection = exports.db.collection("comments");
exports.refreshTokensCollection = exports.db.collection("refreshTokens");
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Connect the client to the server
            yield exports.client.connect();
            //Establish and verify connection
            yield exports.client.db('hosting').command({ ping: 1 });
            console.log('Connected successfully to mongo server');
        }
        catch (_a) {
            console.log("Can't connect to db");
            //Ensure that the client will close when you finish/error
            yield exports.client.close();
        }
    });
}
exports.runDb = runDb;
//black list of refreshTokens
exports.blackList = [];
