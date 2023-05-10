import {
  getAll,
  getAllByUserId,
  findByListId,
  updateList,
  createList,
  deleteList as dlList,
  addFilmToList,
  removeFilmToList
} from "../repositories/lists_repository.js";
import { findByUserUsername } from "../repositories/users_repository.js";

export function getAllList() {
  return getAll();
}
export function getAllListByUser(username) {
  return new Promise((res, rej) => {
    if (username && username.username) {
      findByUserUsername(username.username)
        .then((user) => {
          console.log(user);

          getAllByUserId(user._id.toString())
            .then((list) => {
              res(list);
            })
            .catch((err) => rej("List not found: " + JSON.stringify(err)));
        })
        .catch((err) => {
          console.log("fallaa");
          rej("User not found: " + JSON.stringify(err));
        });
    } else rej({ error: "Not found" });
  });
}

export function getListbyId(id) {
  return new Promise((res, rej) => {
    if (id) {
      findByListId(id)
        .then((list) => {
          res(list);
        })
        .catch((err) => rej("List not found: " + JSON.stringify(err)));
    } else rej({ error: "Not found" });
  });
}

export function updateaList(list) {
  return new Promise((res, rej) => {
    if (list && list.name && list.id) {
      getListbyId(list.id)
        .then((listFound) => {
          console.log(listFound, '1');
          updateList({list, userId: listFound[0].userId})
            .then((updated) => {
              res(updated);
            })
            .catch((err) =>
              rej("Error at update list: " + JSON.stringify(err))
            );
        })
        .catch((err) =>
          rej("Error at update list (list not found): " + JSON.stringify(err))
        );
    } else {
      rej({ error: "Syntax error" });
    }
  });
}

export function insertList(list) {
  return new Promise((res, rej) => {
    if (list && list.name) {
      findByUserUsername(list.user)
        .then((user) => {
          createList({
            userId: user._id.toString(),
            name: list.name,
            description: list.description,
            type: list.type,
            styles: {
              bgColor: list.styles.bgColor,
              txtColor: list.styles.txtColor,
            },
          })
            .then((created) => {
              res(created);
            })
            .catch((err) =>
              rej("Error at insert list: " + JSON.stringify(err))
            );
        })
        .catch((err) => rej("Error at found user: " + JSON.stringify(err)));
    } else {
      rej({ error: "Syntax error" });
    }
  });
}

export function deleteList(list) {
  return new Promise((res, rej) => {
    if (list && list.id) {
      dlList(list)
        .then((deletedList) => {
          res(deletedList);
        })
        .catch((err) => rej("Error at delete list: " + JSON.stringify(err)));
    } else {
      rej({ error: "Syntax error" });
    }
  });
}
export function addFilm(body) {
  return new Promise((res, rej) => {
    if (body && body.list && body.film && body.list.id && body.film.id) {
      findByListId(body.list.id)
        .then((listFound) => {
          addFilmToList(listFound[0], body.film)
            .then((added) => {
              res(added);
            })
            .catch((err) =>
              rej("Error at add film to list: " + JSON.stringify(err))
            );
        })
        .catch((err) =>
          rej("Error at update list (list not found): " + JSON.stringify(err))
        );
    } else {
      rej({ error: "Syntax error" });
    }
  });
}
export function removeFilm(body) {
  return new Promise((res, rej) => {
    if (body && body.list && body.film && body.list.id && body.film.id) {
      findByListId(body.list.id)
        .then((listFound) => {
          console.log(listFound[0], 'founded');

          removeFilmToList(listFound[0], body.film)
            .then((added) => {
              res(added);
            })
            .catch((err) =>
              rej("Error at remove film to list: " + JSON.stringify(err))
            );
        })
        .catch((err) =>
          rej("Error at update list (list not found): " + JSON.stringify(err))
        );
    } else {
      rej({ error: "Syntax error" });
    }
  });
}
