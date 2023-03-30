import { findByUserUsername } from '../repositories/users_repository.js'
import { generateJWT, hash } from "../security/security.js"
import bcrypt from "bcrypt"
import { findByUserId } from '../repositories/avatar_repository.js'

export function doLogin(login) {
    return new Promise((res, rej) => {
        findByUserUsername(login.username)
            .then(user => {
                bcrypt.compare(login.password, user.password, function (err, result) {
                    if (result) {
                        let token = generateJWT(user);
                        findByUserId(user._id.toString()).then(avatar => {
                            if (avatar)
                                res({ token, avatar: avatar.avatar })
                            else
                                res({ token , avatar: ''})

                        })
                    } else {
                        rej("Invalid Credentials")
                    }
                });
            }).catch(err => {
                rej("Invalid Credentials")
            })
    })
}