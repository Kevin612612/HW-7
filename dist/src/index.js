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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = require("./routes/auth-router");
const users_router_1 = require("./routes/users-router");
const blogs_router_1 = require("./routes/blogs-router");
const posts_router_1 = require("./routes/posts-router");
const comments_router_1 = require("./routes/comments-router");
const testing_router_1 = require("./routes/testing-router");
const mongodb_1 = require("./repositories/mongodb");
const email_router_1 = require("./routes/email-router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
exports.app = (0, express_1.default)();
const corsMiddleware = (0, cors_1.default)();
exports.app.use(corsMiddleware);
const jsonBodyMiddleware = body_parser_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use((0, cookie_parser_1.default)());
//PORT
const port = 5001 || process.env.PORT;
//HOME PAGE
exports.app.get('/', (req, res) => {
    res.send(`<form>
  <label for="input">Enter your text:</label>
  <input type="text" id="input" name="input">
  <input type="submit" value="Submit">
</form>`);
});
//ROUTES
exports.app.use('/auth', auth_router_1.authRouter);
exports.app.use('/users', users_router_1.usersRouter);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/comments', comments_router_1.commentsRouter);
exports.app.use('/email', email_router_1.emailRouter);
exports.app.use('/testing', testing_router_1.testingRouter);
//START-APP FUNCTION
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    //wait while DB is connected
    yield (0, mongodb_1.runDb)();
    //the listen port
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
//START APP
startApp();
