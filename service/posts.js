const mongo = require('koa-mongo')
const config = require('../config')
const collectionName = 'posts'

const posts = {
  // get posts list
  async getList (mongoClient, filter) {
    const cursor = await mongoClient.db(config.mongodb.db).collection(collectionName)
    .find({}, { title: true, createtime: true })
    .sort({ createtime: -1 })
    .skip((filter.pageIndex - 1) * config.pageSize)
    .limit(config.pageSize)

    return await {
      hasNext: await cursor.hasNext(),
      data: await cursor.toArray()
    }
  },
  async getTotalCount (mongoClient) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .find()
    .count()
  },
  // add a post
  async add (mongoClient, post) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .insert(post)
  },
  // get a post
  async get (mongoClient, id) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .findOne({ _id: mongo.ObjectId(id) })
  },
  // update a post
  async update (mongoClient, id, updator) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .updateOne({ _id: mongo.ObjectId(id) }, { $set: updator })
  },
  // delete a post
  async del (mongoClient, id) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .remove({ _id: mongo.ObjectId(id) })
  }
}

module.exports = posts
