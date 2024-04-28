const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6iad9fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    // Get the database and collection on which to run the operation
    const database = client.db("tourismDB");
    const spotsCollection = database.collection("spots");
    const countryCollection = database.collection("countries");
    const usersCollection = database.collection("users");

    // reading all spots
    app.get("/spots", async (req, res) => {
      const result = spotsCollection.find();
      const spots = await result.toArray();
      res.send(spots);
    });
    // reading single spot
    app.get("/spots/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };

      const result = await spotsCollection.findOne(query);
      res.send(result);
    });
    // creating spots
    app.post("/spots", async (req, res) => {
      const newSpot = req.body;
      const result = await spotsCollection.insertOne(newSpot);
      res.send(result);
    });
    //updating spot
    app.put("/spots/:id", async (req, res) => {
      res.send("updating spot");
    });
    // deleting spot
    app.delete("/spots/:id", async (req, res) => {
      res.send("deleting spot");
    });
    app.get("/lists/:email", async (req, res) => {
      const query = {
        user_email: req.params.email,
      };
      // const result = spotsCollection.find(query).sort({ average_cost: 1 });
      const result = spotsCollection.find(query);
      const listedSpots = await result.toArray();
      res.send(listedSpots);
    });
    // reading all countries
    app.get("/countries", async (req, res) => {
      const result = countryCollection.find();
      const countries = await result.toArray();
      res.send(countries);
    });
    // reading single country
    app.get("/countries/:countryName", async (req, res) => {
      const query = { name: req.params.countryName };

      const result = await countryCollection.findOne(query);
      res.send(result);
    });
    // reading users
    app.get("/users", async (req, res) => {
      const result = usersCollection.find();
      const users = await result.toArray();
      res.send(users);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", async (req, res) => {
  res.send("server is running..");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
