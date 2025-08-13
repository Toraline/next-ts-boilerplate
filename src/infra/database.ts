import "dotenv/config";
import { Client } from "pg";

const getNewClient = async () => {
  const url = process.env.DATABASE_URL;

  const client = new Client({ connectionString: url });

  await client.connect();

  return client;
};

export default {
  getNewClient,
};
