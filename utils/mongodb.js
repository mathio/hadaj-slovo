import { MongoClient, ObjectId } from "mongodb";

global.cachedClient = null;
global.cachedDb = null;

const getClient = async () => {
  if (global.cachedClient && global.cachedDb) {
    return {
      client: global.cachedClient,
      db: global.cachedDb,
    };
  }

  const uri = process.env.MONGODB_URL;
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = await client.db();

  global.cachedClient = client;
  global.cachedDb = db;

  return { client, db };
};

const getCollectionClient = async (collection) => {
  const { db } = await getClient();
  return await db.collection(collection);
};

export const getOne = async (collection, id) => {
  const client = await getCollectionClient(collection);
  const result = await client.findOne({ _id: ObjectId(id) });
  return result || {};
};

export const getAll = async (collection, query, sort = "created:-1") => {
  const client = await getCollectionClient(collection);
  const [sortKey, sortDirection] = `${sort}:1`.split(":");
  return await client
    .find(query)
    .sort({ [sortKey]: parseInt(sortDirection, 10) })
    .collation({ locale: "en_US", numericOrdering: true })
    .toArray();
};

export const insert = async (collection, data) => {
  const client = await getCollectionClient(collection);
  const created = Date.now();
  const { insertedId } = await client.insertOne({
    ...data,
    created,
    updated: created,
  });
  return await getOne(collection, insertedId);
};

export const update = async (collection, id, data) => {
  const client = await getCollectionClient(collection);
  await client.findOneAndUpdate(
    { _id: ObjectId(id) },
    { $set: { ...data, updated: Date.now() } }
  );
  return await getOne(collection, id);
};

export const remove = async (collection, id) => {
  const client = await getCollectionClient(collection);
  const { deletedCount } = await client.deleteOne({ _id: ObjectId(id) });
  return deletedCount === 1;
};
