import { MongoClient } from 'mongodb';

function connect() {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        const database = client.db("watch-now");
        let collection = database.collection("users");
        return [client, collection]
    } catch (exception) {
        console.log("Error connecting to mongo: " + JSON.stringify(exception))
        client.close()
    }
}

export function getAll() {
    return new Promise((resolve, reject) => {
        let foundItems = []
        let [client, collection] = connect()
        collection.find().forEach(users => foundItems.push(users)).then(() => {
            client.close()
            resolve(foundItems)
        })
    })
}
export function findByUserUsername(username) {
    return new Promise((resolve, reject) => {
        let [client, collection] = connect()
        collection.findOne({"username": username}).then(user => {
            console.log(username);
            client.close()
            user? resolve(user):reject()
            
        })
    })
}

export function createUser(user) {
    return new Promise((resolve, reject) => {
        let [client, collection] = connect()
        collection.insertOne(user)
        .then(savedDocument => {
            client.close()
            resolve(savedDocument)
        })
        .catch(err => reject(err))
    })
}