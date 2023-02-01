import {emailAdapter} from "../adapters/email-adapter";
import {usersRepository} from "../repositories/users-repository-db";
import {v4 as uuidv4} from 'uuid'
import add from "date-fns/add";


export const emailsManager = {

    //
    async sendEmailConfirmationMessage(email: string, code: string) {
        //find user by email
        const user = await usersRepository.findUserByLoginOrEmail(email)
        //generate code
        const confirmationCode = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://hw-7-gold.vercel.app/auth/confirm-email?code=${code}'>complete registration</a>
        </p>`
        //write the moment when it has been sent
        const result = await usersRepository.updateDate(user!, code)
        //send email
        return await emailAdapter.sendEmail(email, confirmationCode, "confirm registration")
    },


    //some actions
    async sendEmailConfirmationMessageAgain(email: string) {
        //find user
        const user = await usersRepository.findUserByLoginOrEmail(email)
        //if user exists and code is not confirmed and duration between now and moment the code's been created more minute
        if (user
            && user?.emailConfirmation.isConfirmed === false
            //   now        moment the last code has been sent         +           a minute
            &&  new Date > add(user.codes[user.codes.length - 1].sentAt, {seconds: 0.1})) {
            //create new code
            const newCode = uuidv4()
            const result = await usersRepository.updateCode(user, newCode)
            const newConfirmationCode = `<h1>Thank for your registration</h1>
                    <p>To finish registration please follow the link below one more time:
                    <a href='https://hw-7-gold.vercel.app/auth/confirm-email?code=${user.codes[user.codes.length - 1].code}'>complete registration</a>
                    </p>`
            //send email with new code
            return await emailAdapter.sendEmail(email, newConfirmationCode, "confirm registration")
        } else {
            return 400
        }
    }
}