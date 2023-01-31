import {emailAdapter} from "../adapters/email-adapter";

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
    async action() {
        //do something
    }
}