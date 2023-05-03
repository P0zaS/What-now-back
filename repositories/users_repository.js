import { MongoClient, ObjectId } from "mongodb";

function connect() {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    const database = client.db("watch-now");
    let collection = database.collection("users");
    return [client, collection];
  } catch (exception) {
    console.log("Error connecting to mongo: " + JSON.stringify(exception));
    client.close();
  }
}

export function getAll() {
  return new Promise((resolve, reject) => {
    let foundItems = [];
    let [client, collection] = connect();
    collection
      .find()
      .forEach((users) => foundItems.push(users))
      .then(() => {
        client.close();
        resolve(foundItems);
      });
  });
}
export function findByUserUsername(username) {
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection
      .findOne({ username })
      .then((user) => {
        client.close();
        resolve(user);
      })
      .catch((err) => reject(err));
  });
}
export function findByUserId(id) {
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection
      .findOne({ _id: new ObjectId(id) })
      .then((user) => {
        client.close();
        resolve(user);
      })
      .catch((err) => reject(err));
  });
}
export function updateUser(user) {
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection
      .replaceOne(
        { _id: new ObjectId(user.id) },
        { email: user.email, username: user.username, password: user.password }
      )
      .then((savedDocument) => {
        client.close();
        resolve({ doc: savedDocument, username: user.username });
      })
      .catch((err) => reject(err));
  });
}
export function deleteUser(user) {
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection
      .deleteOne(
        { _id: new ObjectId(user.id) }
      )
      .then((deletedDocument) => {
        client.close();
        resolve({ doc: deletedDocument, username: user.username });
      })
      .catch((err) => reject(err));
  });
}
export function createUser(user) {
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
