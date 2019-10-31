import jwt from 'jsonwebtoken'
import { createError } from "apollo-errors";

require('dotenv').config()

const AuthError = createError("AuthError", {
    message: "Authorization error."
});

export function getUserId(context) {
    try {
        const Authorization = context.request ? context.request.get('Authorization') : (context.connection.context.headers ? context.connection.context.headers.Authorization : context.connection.context.Authorization)
        if (Authorization) {
            const token = Authorization.replace('Bearer ', '')
            const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as { // <- Verification
                userId: string
            }
            return userId
        }
        throw new AuthError()
    }
    catch (e) {
        throw new AuthError()
    }
}