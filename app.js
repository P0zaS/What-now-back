import express from 'express';
import bodyParser from'body-parser'
import cors from 'cors'
import { userController } from './controllers/user_controller.js';
import { loginController } from './controllers/login_controller.js';
import { filmController } from './controllers/film_controller.js';
import { listController } from './controllers/lists_controller.js';


const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const port = 3000;

app.get('/', (req, res) => {
    res.send('HELLO WORLD')
});

userController(app);
listController(app);
loginController(app);
filmController(app);


app.listen(port, () => {
    console.log('listening in ' + port);
})