import {emailAdapter} from "../adapters/email-adapter";
import {usersRepository} from "../repositories/users-repository-db";
import {v4 as uuidv4} from 'uuid'


export const emailsManager = {

    //
    async sendEmailConfirmationMessage(email: string, code: string) {
        //generate code
        const confirmationCode = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://hw-7-gold.vercel.app/auth/confirm-email?code=${code}'>complete registration</a>
        </p>`
        return await emailAdapter.sendEmail(email, confirmationCode, "confirm registration")
    },


    //some actions
    async sendEmailConfirmationMessageAgain(email: string) {
        //find user
        const user = await usersRepository.findUserByLoginOrEmail(email)
        if (user && user?.emailConfirmation.isConfirmed === false) {
            //create new code if old one is not confirmed yet
            user.emailConfirmation.confirmationCode = uuidv4()
            const newConfirmationCode = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below one more time:
            <a href='https://hw-7-gold.vercel.app/auth/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
        </p>`
            //send email with new code
            return await emailAdapter.sendEmail(email, newConfirmationCode, "confirm registration")

        } else {
            return 400
        }
    }
}