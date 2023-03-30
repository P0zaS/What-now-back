import { MongoClient, ObjectId } from "mongodb";

function connect() {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    const database = client.db("watch-now");
    let collection = database.collection("avatars");
    return [client, collection];
  } catch (exception) {
    console.log("Error connecting to mongo: " + JSON.stringify(exception));
    client.close();
  }
}
export function getAll_avatars() {
  return new Promise((resolve, reject) => {
    let foundItems = [];
    let [client, collection] = connect();
    collection
      .find()
      .forEach((avatars) => foundItems.push(avatars))
      .then(() => {
        client.close();
        resolve(foundItems);
      });
  });
}
export function findByUserId(id) {
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection
      .findOne({ user_id: id })
      .then((user) => {
        client.close();
        resolve(user);
      })
      .catch((err) => reject(err));
  });
}
export function createAvatar(user) {
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection
      .insertOne(user)
      .then((savedDocument) => {
        client.close();
        resolve(savedDocument);
      })
      .catch((err) => reject(err));
  });
}
export function updateAvatar(avatar) {
  console.log(avatar);
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection
      .replaceOne(
        { user_id: avatar.user_id },
        { _id: avatar.id, user_id: avatar.user_id, avatar: avatar.avatar }
      )
      .then((updatedDocument) => {
        console.log(updatedDocument);
        client.close();
        resolve(updatedDocument);
      })
      .catch((err) => reject(err));
  });
}
