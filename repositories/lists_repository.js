import { MongoClient, ObjectId } from "mongodb";

function connect() {
  const client = new MongoClient("mongodb+srv://fpoza:eSvLhPyrWTr1renm@what-now.czptdvb.mongodb.net/?retryWrites=true&w=majority");
  try {
    const database = client.db("watch-now");
    let collection = database.collection("lists");
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
      .forEach((lists) => foundItems.push(lists))
      .then(() => {
        client.close();
        resolve(foundItems);
      });
  });
}
export function getAllByUserId(userId) {
  console.log(userId);
  return new Promise((resolve, reject) => {
    let foundItems = [];
    let [client, collection] = connect();
    collection
      .find({ userId: userId })
      .forEach((lists) => foundItems.push(lists))
      .then(() => {
        client.close();
        resolve(foundItems);
      });
  });
}

export function findByListId(Id) {
  console.log(Id);
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection
      .find({ _id: new ObjectId(Id) })
      .toArray()
      .then((lists) => {
        client.close();
        lists ? resolve(lists) : reject();
      });
  });
}

export function updateList(list) {
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection.updateOne(
      { _id: new ObjectId(list.list.id) },
      {
        $set: {
          userId: list.userId,
          name: list.list.name,
          description: list.list.description,
          type: list.list.type,
          styles: {
            bgColor: list.list.styles.bgColor,
            txtColor: list.list.styles.txtColor,
          },
        },
      }
    ).then((savedDocument) => {
      console.log(savedDocument);
      client.close();
      resolve({ doc: savedDocument, id: list.id });
    })
    .catch((err) => reject(err));
    
  });
}
export function deleteList(list) {
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection
      .deleteOne({ _id: new ObjectId(list.id) })
      .then((deletedDocument) => {
        client.close();
        resolve({ doc: deletedDocument, id: list.id });
      })
      .catch((err) => reject(err));
  });
}
export function createList(list) {
  console.log(list);
  list.films = [];
  return new Promise((resolve, reject) => {
    let [client, collection] = connect();
    collection
      .insertOne(list)
      .then((savedDocument) => {
        client.close();
        resolve({ savedDoc: savedDocument });
      })
      .catch((err) => reject(err));
  });
}
export function addFilmToList(list, film) {
  return new Promise((resolve, reject) => {
    list.films.push(film);
    let [client, collection] = connect();
    collection
      .updateOne({"_id": list._id, "userId": list.userId}, {
        $set:{
         "films": list.films
        }
      })
      .then((savedDocument) => {
        client.close();
        console.log(savedDocument);
        resolve({ savedDoc: savedDocument });
      })
      .catch((err) => reject(err));
  });
}
export function removeFilmToList(list, film) {
  return new Promise((resolve, reject) => {
    list.films[list.films.findIndex(x => x.id == film.id)] = null;
    list.films = list.films.filter(x => x != null);
    let [client, collection] = connect();
    collection
      .updateOne({"_id": list._id, "userId": list.userId}, {
        $set:{
         "films": list.films
        }
      })
      .then((savedDocument) => {
        client.close();
        resolve({ savedDoc: savedDocument });
      })
      .catch((err) => reject(err));
  });
}
