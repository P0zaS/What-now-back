import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"


const ROUNDS = 10;
const JWT_SECRET = "delocosno"


export function hash(plainText) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(ROUNDS, (err, salt) => {
            bcrypt.hash(plainText, salt, function (err, hash) {
                resolve(hash)
            });
        })
    })
}

export function generateJWT(employee){
    return jsonwebtoken.sign({user_id:employee._id, user_email:employee.email}, 
    JWT_SECRET,
    { expiresIn: '1h' })
}

export function verifyJWT(token){
    return jsonwebtoken.verify(token, JWT_SECRET)
}