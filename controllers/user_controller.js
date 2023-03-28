import { ObjectId } from "mongodb";
import {
  getAllUsers,
  insertUser,
  getUserbyUsername,
  updateaUser,
  getUserbyId,
} from "../services/users_service.js";

export function userController(app) {
  app.get("/user", (req, res) => {
    getAllUsers().then((users) => res.send(JSON.stringify(users)));
  });
  app.get("/userById/:id", (req, res) => {
    getUserbyId(req.params.id).then((user) => res.send(JSON.stringify(user)));
  });
  app.get("/userByUsername/:username", (req, res) => {
    getUserbyUsername(req.params.username).then((users) =>
      res.send(JSON.stringify(users))
    );
  });
  app.put("/user", (req, res) => {
    updateaUser(req.body)
      .then((user) => {
        res.status(200);
        res.send(user);
      })
      .catch((err) => {
        res.status(400);
        res.send(err);
      });
  });
  app.post("/user", (req, res) => {
    insertUser(req.body)
      .then((user) => {
        res.status(200);
        res.send(user);
      })
      .catch((err) => {
        res.status(400);
        res.send(err);
      });
  });
}
