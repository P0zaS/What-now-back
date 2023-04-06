import {
  createAvatar,
  getAll_avatars,
  findByUserId as avatarByUserId,
  updateAvatar,
} from "../repositories/avatar_repository.js";
import {
  getAll,
  createUser,
  findByUserUsername,
  findByUserId,
  updateUser,
  deleteUser,
} from "../repositories/users_repository.js";
import { hash } from "../security/security.js";

export function getAllUsers() {
  return getAll();
}
export function getUserbyUsername(username) {
  return new Promise((res, rej) => {
    if (username) {
      findByUserUsername(username)
        .then((user) => {
          avatarByUserId(user._id.toString())
            .then((avatar) => {
              if (avatar) res({ user, avatar: avatar.avatar });
              else res({ user, avatar: "" });
            })
            .catch((err) => rej("User not found: " + JSON.stringify(err)));
        })
        .catch((err) => rej("User not found: " + JSON.stringify(err)));
    } else rej({ error: "Not found" });
  });
}
export function getUserbyId(id) {
  return new Promise((res, rej) => {
    if (id) {
      findByUserId(id)
        .then((user) => {
          avatarByUserId(id).then((avatar) => {
            res({ user, avatar: avatar.avatar });
          });
        })
        .catch((err) => rej("User not found: " + JSON.stringify(err)));
    } else rej({ error: "Not found" });
  });
}
export function updateaUser(user) {
  return new Promise((res, rej) => {
    if (user && user.username && user.email) {
      getUserbyId(user.id)
        .then((userFound) => {
          console.log(userFound);
          hash(user.password).then((hashedPass) => {
            if (
              user.password &&
              user.password != "" &&
              hashedPass !== userFound.user.password
            )
              user.password = hashedPass;
            else user.password = userFound.user.password;

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
      findByUserUsername(user.username)
        .then((checkUsername) => {
          if (!checkUsername) {
            hash(user.password).then((hashedPass) => {
              user.password = hashedPass;
              createUser({
                username: user.username,
                email: user.email,
                password: user.password,
              })
                .then((inserted) => {
                  insertUserAvatar({
                    id: inserted.insertedId.toString(),
                    binaryAvatar:
                      "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",
                  })
                    .then((avatarInserted) => {
                      res(avatarInserted);
                    })
                    .catch((err) => {
                      deleteUser(inserted.insertedId.toString()).then(
                        (deleted) => {
                          rej(
                            "Error at insert avatar default user: " +
                              JSON.stringify(err)
                          );
                        }
                      );
                      rej(
                        "Error at insert avatar default user: " +
                          JSON.stringify(err)
                      );
                    });
                })
                .catch((err) =>
                  rej("Error at insert user: " + JSON.stringify(err))
                );
            });
          } else {
            if (user.username == checkUsername.username)
              rej("Error at insert user: username alredy exist");
            else if (user.email == user.email)
              rej("Error at insert user: email alredy in use");
          }
        })
        .catch((err) => rej("Error at insert user: " + JSON.stringify(err)));
    } else {
      rej({ error: "Syntax error" });
    }
  });
}
export function getAllAvatars() {
  return getAll_avatars();
}
export function insertUserAvatar(user) {
  console.log(user);
  return new Promise((res, rej) => {
    if (user && user.id && user.binaryAvatar) {
      avatarByUserId(user.id)
        .then((userAvatar) => {
          if (userAvatar == null) {
            createAvatar({ user_id: user.id, avatar: user.binaryAvatar })
              .then((inserted) => {
                res(inserted);
              })
              .catch((err) =>
                rej("Error at insert user avatar: " + JSON.stringify(err))
              );
          } else {
            console.log(userAvatar, "service");
            updateAvatar({
              id: userAvatar._id,
              user_id: user.id,
              avatar: user.binaryAvatar,
            })
              .then((updated) => {
                res(updated);
              })
              .catch((err) =>
                rej("Error at update user avatar: " + JSON.stringify(err))
              );
          }
        })
        .catch((err) =>
          rej("Error at insert user avatar: " + JSON.stringify(err))
        );
    } else {
      rej({ error: "Syntax error" });
    }
  });
}
