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
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const bussiness_service_1 = require("../bussiness/bussiness-service");
exports.userBusinessLayer = {
    //(1) this method returns all users to router
    allUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            //filter depends on if we have searchLoginTerm and/or searchEmailTerm
            // let filter = {};
            //
            // switch (searchLoginTerm && searchEmailTerm) {
            //     case (searchLoginTerm && searchEmailTerm):
            //         filter = {
            //             $or: [{"accountData.login": {$regex: searchLoginTerm, $options: "i"}}, {
            //                 "accountData.email": {
            //                     $regex: searchEmailTerm,
            //                     $options: "i"
            //                 }
            //             }]
            //         }
            //         break;
            //     case (searchLoginTerm && !searchEmailTerm):
            //         filter = {"accountData.login": {$regex: searchLoginTerm, $options: "i"}}
            //         break;
            //     case (!searchLoginTerm && searchEmailTerm):
            //         filter = {"accountData.email": {$regex: searchEmailTerm, $options: "i"}}
            //         break;
            //     case (!searchLoginTerm && !searchEmailTerm):
            //         filter = {};
            //         break;
            // }
            // x = a ? (b ? 11 : 10) : (b ? 01 : 00)
            const filter = searchLoginTerm ? searchEmailTerm ? {
                $or: [{
                        "accountData.login": {
                            $regex: searchLoginTerm,
                            $options: "i"
                        }
                    }, { "accountData.email": {
                            $regex: searchEmailTerm,
                            $options: "i"
                        } }]
            } : { "accountData.login": {
                    $regex: searchLoginTerm,
                    $options: "i"
                } } : searchEmailTerm ? {
                "accountData.email": {
                    $regex: searchEmailTerm,
                    $options: "i"
                }
            } : {};
            const sortedItems = yield users_repository_db_1.usersRepository.allUsers(sortBy, sortDirection, filter);
            const quantityOfDocs = yield mongodb_1.usersCollection.countDocuments(filter);
            return {
                pagesCount: Math.ceil(quantityOfDocs / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: quantityOfDocs,
                items: sortedItems.slice((+pageNumber - 1) * (+pageSize), (+pageNumber) * (+pageSize)).map(User => {
                    return {
                        id: User.id,
                        login: User.accountData.login,
                        email: User.accountData.email,
                        createdAt: User.accountData.createdAt
                    };
                })
            };
        });
    },
    //(2) method creates user
    newPostedUser(userId, login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            //check if user with such email exist
            const user = yield mongodb_1.usersCollection.findOne({ "accountData.email": email });
            //if he doesn't exist then we create a new user
            if (!user) {
                //create a salt and hash
                const passwordSalt = yield bcrypt_1.default.genSalt(10);
                const passwordHash = yield bcrypt_1.default.hash(password, passwordSalt);
                const newUser = {
                    id: userId,
                    accountData: {
                        login: login,
                        email: email,
                        passwordSalt,
                        passwordHash,
                        createdAt: new Date()
                    },
                    emailConfirmation: {
                        confirmationCode: (0, uuid_1.v4)(),
                        expirationDate: (0, add_1.default)(new Date(), {
                            hours: 10,
                            minutes: 3,
                        }),
                        isConfirmed: false,
                    },
                };
                // put this new user in db
                const result = yield users_repository_db_1.usersRepository.newPostedUser(newUser);
                //send email from our account to this user's email
                try {
                    const sendEmail = yield bussiness_service_1.emailsManager.sendEmailConfirmationMessage(newUser.accountData.email, newUser.emailConfirmation.confirmationCode);
                    const s = sendEmail.accepted.toString();
                    return {
                        id: newUser.id + ' user with email: ' + s + ' has received a letter with code',
                        login: newUser.accountData.login,
                        email: newUser.accountData.email,
                        createdAt: newUser.accountData.createdAt
                    };
                }
                catch (error) {
                    return 400; //email hasn't been sent
                }
            }
            else {
                return 400; //user with such email already exists
            }
        });
    },
    //(3) method deletes by ID
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield users_repository_db_1.usersRepository.deleteUser(userId);
            return result ? result : 404;
        });
    },
    //(4) confirm code
    confirmCodeFromEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_db_1.usersRepository.findUserByCode(code);
            if (user && user.emailConfirmation.expirationDate > new Date() && user.emailConfirmation.isConfirmed != true) {
                const changeStatus = yield users_repository_db_1.usersRepository.updateStatus(user);
                return 204;
            }
            return 400;
        });
    },
};
