const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ibjkumr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const productCollections = client.db("ProductDB").collection("product");
    const brandCollections = client.db("BrandDB").collection("brand");

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollections.insertOne(product);
      res.send(result);
    });
    app.get("/brands", async (req, res) => {
      const result = await brandCollections.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Technology and Electronics management server is running");
});
app.listen(port, (req, res) => {
  console.log(`Your Server is running on port: ${port}`);
});
