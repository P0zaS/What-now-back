import {
  getAll,
  createUser,
  findByUserUsername,
  findByUserId,
  updateUser,
} from "../repositories/users_repository.js";
import { hash } from "../security/security.js";

export function getAllUsers() {
  return getAll();
}
export function getUserbyUsername(username) {
  console.log(username);
  return new Promise((res, rej) => {
    if (username) {
      findByUserUsername(username)
        .then((user) => {
          res(user);
        })
        .catch((err) => rej("User not found: " + JSON.stringify(err)));
    } else rej({ error: "Not found" });
  });
}
export function getUserbyId(id) {
  console.log(id);
  return new Promise((res, rej) => {
    if (id) {
      findByUserId(id)
        .then((user) => {
          res(user);
        })
        .catch((err) => rej("User not found: " + JSON.stringify(err)));
    } else rej({ error: "Not found" });
  });
}
export function updateaUser(user) {
  console.log(user);
  return new Promise((res, rej) => {
    if (user && user.username && user.email) {
      getUserbyId(user.id)
        .then((userFound) => {
          hash(user.password).then((hashedPass) => {
            if (
              user.password &&
              user.password != "" &&
              hashedPass !== userFound.password
            )
              user.password = hashedPass;
            else user.password = userFound.password;

            updateUser(user)
              .then((updated) => {
                res(updated);
              })
              .catch((err) =>
                rej("Error at update user: " + JSON.stringify(err))
              );
          });
        })
        .catch((err) =>
          rej("Error at update user (user not found): " + JSON.stringify(err))
        );
    } else {
      rej({ error: "Syntax error" });
    }
  });
}
export function insertUser(user) {
  return new Promise((res, rej) => {
    if (user && user.username && user.password) {
      hash(user.password).then((hashedPass) => {
        user.password = hashedPass;
        createUser(user)
          .then((inserted) => {
            res(inserted);
          })
          .catch((err) => rej("Error at insert user: " + JSON.stringify(err)));
      });
    } else {
      rej({ error: "Syntax error" });
    }
  });
}
