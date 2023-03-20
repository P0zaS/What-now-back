import { MongoClient } from "mongodb";

function connect() {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  try {
    const database = client.db("watch-now");
    let collection = database.collection("films");
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
      .forEach((films) => foundItems.push(films))
      .then(() => {
        client.close();
        resolve(foundItems);
      });
  });
}
export function findByFilmTitle(title) {
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection
      .find({ title: new RegExp(".*" + title + ".*") })
      .toArray()
      .then((films) => {
        client.close();
        films ? resolve(films) : reject();
      });
  });
}
