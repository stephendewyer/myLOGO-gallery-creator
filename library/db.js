import { MongoClient } from 'mongodb';

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTERNAME}.yw8phum.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

export async function connectToDatabase() {

    const client = await MongoClient.connect(connectionString);

    return client;
}