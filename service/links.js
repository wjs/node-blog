const mongo = require('koa-mongo')
const config = require('../config')
const collectionName = 'links'

const links = {
  // get links
  async getAll (mongoClient) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName).find().toArray()
  },
  // add links
  async add (mongoClient, link) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName).insert(link)
  },
  // update
  async update (mongoClient, id, updator) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .updateOne({ _id: mongo.ObjectId(id) }, { $set: updator })
  }
}

module.exports = links
