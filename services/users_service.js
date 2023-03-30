import {
  createAvatar,
  getAll_avatars,
  findByUserId as avatarByUserId,
  updateAvatar
} from "../repositories/avatar_repository.js";
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
        createUser({
          username: user.username,
          email: user.email,
          password: user.password,
        })
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
export function getAllAvatars() {
  return getAll_avatars();
}
export function insertUserAvatar(user) {
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
            console.log(userAvatar, 'service');
            updateAvatar({ id: userAvatar._id, user_id: user.id, avatar: user.binaryAvatar })
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
