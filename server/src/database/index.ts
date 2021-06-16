import { MongoClient } from "mongodb";

import { Database } from "../lib/types";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/Cluster0?retryWrites=true&w=majority`;

//function to connect to mongodb
export const connectDatabase = async (): Promise<Database> => {
  //connect to mongddb
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  //get the the database

  const db = client.db("main");

  return {
    listings: db.collection("test_listings"),
  };
};
