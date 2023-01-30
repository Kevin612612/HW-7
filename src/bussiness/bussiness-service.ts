import {emailAdapter} from "../adapters/email-adapter";

export const emailsManager = {

    //
    async sendEmailConfirmationMessage(email: string, code: string) {
        //generate code
        const confirmationCode = code
        return await emailAdapter.sendEmail(email, confirmationCode, "confirm registration")
    },

    //some actions
    async action() {
        //do something
    }
}