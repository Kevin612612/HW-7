import {runDb} from "./repositories/mongodb";
import {app} from "./setting";

//PORT
const port = 5001 || process.env.PORT

//START-APP FUNCTION
const startApp = async () => {
    //wait while DB is connected
    await runDb()
    //the listen port
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

//START APP
startApp();


