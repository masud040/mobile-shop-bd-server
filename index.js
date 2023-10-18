const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const productCollections = client.db("ProductDB").collection("product");
    const brandCollections = client.db("BrandDB").collection("brand");
    const cartCollections = client.db("CartDB").collection("cart");
    const bannerCollections = client.db("BannerDB").collection("banner");
    // brandProduct
    app.get("/products/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brandName: brandName };
      const cursor = await productCollections.find(query).toArray();
      res.send(cursor);
    });
    app.get("/detailsProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollections.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollections.insertOne(product);
      res.send(result);
    });
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          productName: product.productName,
          brandName: product.brandName,
          type: product.type,
          price: product.price,
          image: product.image,
          rating: product.rating,
          descriptions: product.descriptions,
        },
      };
      const result = await productCollections.updateOne(
        filter,
        updateProduct,
        options
      );

      res.send(result);
    });

    // cart Product
    app.get("/cartProducts", async (req, res) => {
      const result = await cartCollections.find().toArray();
      res.send(result);
    });
    app.post("/cartProducts", async (req, res) => {
      const product = req.body;
      const result = await cartCollections.insertOne(product);
      res.send(result);
    });
    app.delete("/cartProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollections.deleteOne(query);
      res.send(result);
    });
    // brands
    app.get("/brands", async (req, res) => {
      const result = await brandCollections.find().toArray();
      res.send(result);
    });

    app.get("/banners", async (req, res) => {
      const result = await bannerCollections.find().toArray();
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
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
