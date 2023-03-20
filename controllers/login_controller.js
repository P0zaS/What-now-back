import { doLogin } from "../services/login_service.js"

export function loginController (app){
    app.post('/login', (req, res) => {
        doLogin(req.body)
        .then(loginResponse => {
            res.send(JSON.stringify(loginResponse))
        }).catch(err => {
            res.status(401)
            res.send(err)
        })
    })
}