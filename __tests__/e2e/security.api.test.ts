import request from 'supertest';

import {app} from "../../src/setting";
import {createUser} from "./users.api.test";

jest.setTimeout(60000)


describe('GET DEVICES',  () => {
    //create user -> post user -> login user from 4 devices -> send refreshToken -> get devices list

    //create user
    const user = createUser()

    //create cookies
    let cookies: string[] = [];

    //post user
    test('post user', async() => {
        const result = await request(app)
            .post(`/users`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                login: user.login,
                password: user.password,
                email: user.email
            })
    })

    //login from 4 devices
    const devicesList = ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'AppleWebKit/537.36 (KHTML, like Gecko)',
        'Chrome/88.0.4324.192',
        'Safari/537.36 Edg/88.0.705.81']
    for (let i = 0; i < 4; i++) {
        it(`should login user from device ${devicesList[i]}`, async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ loginOrEmail: user.login, password: user.password })
                .set('Accept', 'application/json')
                .set('User-Agent', devicesList[i])
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body).toHaveProperty('accessToken');
            expect(res.body.accessToken).toEqual(expect.stringContaining('.'));
            cookies[i] = res.headers['set-cookie'];
        });
    }

    //send refreshToken
    it('should send refresh token in cookie', async () => {
        const res = await request(app)
            .get('/security/devices')
            .set('Cookie', cookies[1]) // login with device 1

        // respose.body
        console.log(res.body)
    });

})


describe('DELETE DEVICES', () => {
    //create user -> post user -> login user from 4 devices -> send refreshToken -> get devices list

    //create user
    const user = createUser()

    //create cookies
    let cookies: string[] = [];

    //post user
    test('post user', async() => {
        const result = await request(app)
            .post(`/users`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                login: user.login,
                password: user.password,
                email: user.email
            })
    })

    //login from 3 devices
    const devicesList = ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'AppleWebKit/537.36 (KHTML, like Gecko)',
        'Chrome/88.0.4324.192']
    for (let i = 0; i < devicesList.length; i++) {
        it(`should login user from device ${devicesList[i]}`, async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ loginOrEmail: user.login, password: user.password })
                .set('Accept', 'application/json')
                .set('User-Agent', devicesList[i])
                .expect('Content-Type', /json/)
                .expect(200);
            cookies[i] = res.headers['set-cookie'];
        });
    }

    //send refreshToken
    it('should send refresh token in cookie', async () => {
        const res = await request(app)
            .delete('/security/devices')
            .set('Cookie', cookies[1]) // login with device 1

        // respose.body
        console.log(res.body)
    });
})
