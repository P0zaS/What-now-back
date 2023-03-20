import { getAllUsers, insertUser } from "../services/users_service.js"

export function userController(app) {
    app.get('/user', (req,res) => {
        getAllUsers().then(users => res.send(JSON.stringify(users)));
    })
    app.post('/user', (req, res) => {
        insertUser(req.body).then(user => {
            res.status(200)
            res.send(user)
        }).catch(err => {
            res.status(400)
            res.send(err)
        })
    })
}

