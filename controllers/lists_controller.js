import {
    getAllList,
    getAllListByUser,
    getListbyId,
    updateaList,
    insertList,
    deleteList
  } from "../services/lists_service.js";

export function listController(app) {
  app.get("/lists", (req, res) => {
    getAllList().then((lists) => res.send(JSON.stringify(lists)));
  });
  app.get("/listByUser/:user", (req, res) => {
    getAllListByUser({username: req.params.user}).then((lists) => res.send(JSON.stringify(lists)));
  });
  app.get("/list/:id", (req, res) => {
    getListbyId(req.params.id)
      .then((lists) => res.send(JSON.stringify(lists)))
      .catch((err) => res.send(JSON.stringify(err)));
  });
  app.put("/list", (req, res) => {
    updateaList(req.body)
      .then((list) => {
        res.status(200);
        res.send(list);
      })
      .catch((err) => {
        res.status(400);
        res.send(err);
      });
  });
  app.post("/list", (req, res) => {
    console.log(req.body);
    insertList(req.body)
      .then((list) => {
        res.status(200);
        res.send(list);
      })
      .catch((err) => {
        res.status(400);
        res.send(err);
      });
  });
  app.delete("/list", (req, res) => {
    deleteList(req.body)
      .then((list) => {
        res.status(200);
        res.send(list);
      })
      .catch((err) => {
        res.status(400);
        res.send(err);
      });
  });
}
