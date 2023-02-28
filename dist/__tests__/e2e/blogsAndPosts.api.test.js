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
const supertest_1 = __importDefault(require("supertest"));
const setting_1 = require("../../src/setting");
// 'describe' creates a block that groups together several related tests
describe('all tests', () => {
    // очищаем все данные delete
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(setting_1.app)
            .delete("/testing/all-data");
    }));
    //тестируем blogs
    describe('we are going to test blogs', () => {
        // test get '/blogs/' request
        it('should get empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(setting_1.app)
                .get('/blogs/')
                .expect(200, []);
        }));
        // создаем блог       post
        it('should create a new blog', () => __awaiter(void 0, void 0, void 0, function* () {
            const createResponse = yield (0, supertest_1.default)(setting_1.app)
                .post('/blogs/')
                .auth("admin", "qwerty", { type: "basic" })
                .send({
                name: "string",
                description: "string",
                websiteUrl: "https://www.google.com/"
            })
                .expect(201);
            const createdBlog = createResponse.body;
            expect(createdBlog).toEqual({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                websiteUrl: expect.any(String)
            });
        }));
        // запрашиваем blog по id    get
        it('should get createdBlog', () => __awaiter(void 0, void 0, void 0, function* () {
            const createResponse = yield (0, supertest_1.default)(setting_1.app)
                .get('/blogs/1')
                .expect(200);
            const gotResponse = createResponse.body;
            expect(gotResponse).toEqual({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                websiteUrl: expect.any(String)
            });
        }));
        // меняем по ID       put by ID
        it('should change created blog', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(setting_1.app)
                .put('/blogs/1')
                .auth("admin", "qwerty", { type: "basic" })
                .send({
                name: "string",
                description: "string",
                websiteUrl: "https://www.google.com/"
            })
                .expect(204);
        }));
        // удаляем по ID      delete by ID
        it('should delete blog by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(setting_1.app)
                .delete('/blogs/1')
                .auth("admin", "qwerty", { type: "basic" })
                .expect(204);
        }));
    });
    //тестируем posts
    describe('we are going to test posts', () => {
        // test get '/posts/' request
        it('should get empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(setting_1.app)
                .get('/posts/')
                .expect(200, []);
        }));
        // создаем пост       post
        it('should create a new post', () => __awaiter(void 0, void 0, void 0, function* () {
            const createResponse = yield (0, supertest_1.default)(setting_1.app)
                .post('/posts/')
                .auth("admin", "qwerty", { type: "basic" })
                .send({
                title: "string",
                shortDescription: "string",
                content: "string",
                blogId: "string"
            })
                .expect(201);
            const createdPost = createResponse.body;
            expect(createdPost).toEqual({
                id: expect.any(String),
                title: expect.any(String),
                shortDescription: expect.any(String),
                content: expect.any(String),
                blogId: expect.any(String),
                blogName: expect.any(String)
            });
        }));
        // запрашиваем post по id    get
        it('should get createdPost', () => __awaiter(void 0, void 0, void 0, function* () {
            const createResponse = yield (0, supertest_1.default)(setting_1.app)
                .get('/posts/1')
                .expect(200);
            const gotResponse = createResponse.body;
            expect(gotResponse).toEqual({
                id: expect.any(String),
                title: expect.any(String),
                shortDescription: expect.any(String),
                content: expect.any(String),
                blogId: expect.any(String),
                blogName: expect.any(String)
            });
        }));
        // меняем post по ID       put by ID
        it('should change created post', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(setting_1.app)
                .put('/posts/1')
                .auth("admin", "qwerty", { type: "basic" })
                .send({
                title: "string",
                shortDescription: "string",
                content: "string",
                blogId: "string"
            })
                .expect(204);
        }));
        // удаляем post по ID      delete by ID
        it('should delete post by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(setting_1.app)
                .delete('/posts/1')
                .auth("admin", "qwerty", { type: "basic" })
                .expect(204);
        }));
    });
    //тестируем эндпоинт удаления
    it('we are going to test testings', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(setting_1.app)
            .delete("/testing/all-data")
            .expect(204, {});
    }));
});
