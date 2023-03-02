"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// @ts-ignore
const express_device_1 = __importDefault(require("express-device"));
const auth_router_1 = require("./routes/auth-router");
const users_router_1 = require("./routes/users-router");
const blogs_router_1 = require("./routes/blogs-router");
const posts_router_1 = require("./routes/posts-router");
const comments_router_1 = require("./routes/comments-router");
const email_router_1 = require("./routes/email-router");
const security_devices_router_1 = require("./routes/security_devices-router");
const testing_router_1 = require("./routes/testing-router");
const ___train_router_1 = require("./routes/___train-router");
exports.app = (0, express_1.default)();
const corsMiddleware = (0, cors_1.default)();
exports.app.use(corsMiddleware);
const jsonBodyMiddleware = body_parser_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_device_1.default.capture());
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
exports.app.use('/security', security_devices_router_1.deviceRouter);
exports.app.use('/users', users_router_1.usersRouter);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/comments', comments_router_1.commentsRouter);
exports.app.use('/email', email_router_1.emailRouter);
exports.app.use('/testing', testing_router_1.testingRouter);
exports.app.use('/train', ___train_router_1.___trainRouter);
