import {
  getAllUsers,
  getAllAvatars,
  insertUser,
  getUserbyUsername,
  updateaUser,
  getUserbyId,
  insertUserAvatar,
} from "../services/users_service.js";

export function userController(app) {
  app.get("/user", (req, res) => {
    getAllUsers().then((users) => res.send(JSON.stringify(users)));
  });
  app.get("/userById/:id", (req, res) => {
    getUserbyId(req.params.id)
      .then((user) => res.send(JSON.stringify(user)))
      .catch((err) => res.send(JSON.stringify(err)));
  });
  app.get("/userByUsername/:username", (req, res) => {
    getUserbyUsername(req.params.username)
      .then((users) => res.send(JSON.stringify(users)))
      .catch((err) => res.send(JSON.stringify(err)));
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
  app.post("/user/avatar", (req, res) => {
    console.log(req.body);
    insertUserAvatar(req.body)
      .then((user) => {
        res.status(200);
        res.send(user);
      })
      .catch((err) => {
        res.status(400);
        res.send(err);
      });
  });
  app.get("/user/avatar", (req, res) => {
    console.log(req.body);
    getAllAvatars().then((users) => res.send(JSON.stringify(users)));
  });
}
