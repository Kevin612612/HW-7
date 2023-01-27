"use strict";
//Business Layer
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userBusinessLayer = void 0;
const users_repository_db_1 = require("../repositories/users-repository-db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("../repositories/mongodb");
let countOfUsers = 0;
exports.userBusinessLayer = {
    //(1) this method returns all users to router
    allUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (searchLoginTerm && searchEmailTerm) {
                filter = {
                    $or: [{ login: { $regex: searchLoginTerm, $options: 'i' } }, {
                            email: {
                                $regex: searchEmailTerm,
                                $options: 'i'
                            }
                        }]
                };
            }
            if (searchLoginTerm && !searchEmailTerm) {
                filter = { login: { $regex: searchLoginTerm, $options: 'i' } };
            }
            if (!searchLoginTerm && searchEmailTerm) {
                filter = { email: { $regex: searchEmailTerm, $options: 'i' } };
            }
            if (!searchLoginTerm && !searchEmailTerm) {
                filter = {};
            }
            const sortedItems = yield users_repository_db_1.usersRepository.allUsers(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, filter);
            const quantityOfDocs = yield mongodb_1.usersCollection.countDocuments(filter);
            return {
                pagesCount: Math.ceil(quantityOfDocs / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: quantityOfDocs,
                items: sortedItems.slice((+pageNumber - 1) * (+pageSize), (+pageNumber) * (+pageSize)).map(e => {
                    return {
                        id: e.id,
                        login: e.login,
                        email: e.email,
                        createdAt: e.createdAt,
                    };
                })
            };
        });
    },
    //(2) method creates user
    newPostedUser(id, login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            countOfUsers++;
            const idName = id ? id : countOfUsers.toString();
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield bcrypt_1.default.hash(password, passwordSalt);
            const newUser = {
                id: idName,
                login: login,
                email: email,
                passwordSalt,
                passwordHash,
                createdAt: new Date()
            };
            const result = yield users_repository_db_1.usersRepository.newPostedUser(newUser);
            return {
                id: newUser.id,
                login: newUser.login,
                email: newUser.email,
                createdAt: newUser.createdAt
            };
        });
    },
    //(3) method deletes by ID
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield users_repository_db_1.usersRepository.deleteUser(userId);
            return result ? result : 404;
        });
    },
};
