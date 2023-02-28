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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("./repositories/mongodb");
const setting_1 = require("./setting");
//PORT
const port = 5001 || process.env.PORT;
//START-APP FUNCTION
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    //wait while DB is connected
    yield (0, mongodb_1.runDb)();
    //the listen port
    setting_1.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
//START APP
startApp();
