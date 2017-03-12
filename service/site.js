const mongo = require('koa-mongo')
const config = require('../config')
const collectionName = 'site'

const site = {
  // get site
  async get (mongoClient) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName).findOne()
  },
  // add site
  async add (mongoClient, site) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName).insert(site)
  },
  // update
  async update (mongoClient, id, updator) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .updateOne({ _id: mongo.ObjectId(id) }, { $set: updator })
  }
}

module.exports = site
