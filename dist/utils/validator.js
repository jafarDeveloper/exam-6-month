"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.registerValidator = void 0;
const error_1 = require("./error");
let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const registerValidator = (user) => {
    const { first_name, last_name, email, password } = user;
    if (!first_name)
        throw new error_1.ClientError("First name is required !", 400);
    if (!last_name)
        throw new error_1.ClientError("First name is required !", 400);
    if (!email)
        throw new error_1.ClientError("First name is required !", 400);
    if (!password)
        throw new error_1.ClientError("First name is required !", 400);
    if (!(emailRegex.test(email)))
        throw new error_1.ClientError("Email is invalid !", 400);
    if (!(password.length > 5 && password.length < 13))
        throw new error_1.ClientError("Password is invalid !", 400);
    return true;
};
exports.registerValidator = registerValidator;
const loginValidator = (user) => {
    const { email, password } = user;
    if (!email)
        throw new error_1.ClientError("First name is required !", 400);
    if (!password)
        throw new error_1.ClientError("First name is required !", 400);
    if (!(emailRegex.test(email)))
        throw new error_1.ClientError("Email is invalid !", 400);
    if (!(password.length > 5 && password.length < 13))
        throw new error_1.ClientError("Password is invalid !", 400);
    return true;
};
exports.loginValidator = loginValidator;
