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

    // testing paginations stats
    app.get("/productbypaginate", async (req, res) => {
      const query = req.query;
      const page = parseInt(query.page);
      const size = parseInt(query.size);

      const result = await spotsCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    // reading the amount of product
    app.get("/productcount", async (req, res) => {
      const count = await spotsCollection.estimatedDocumentCount();
      res.send({ count });
    });
    // pagination testing end

    // reading all spots
    app.get("/spots", async (req, res) => {
      const result = spotsCollection.find().sort({ ...req.query });
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
      const updatedData = req.body;
      const filter = { _id: new ObjectId(req.params.id) };
      const updatedSpot = {
        $set: {
          tourist_spot_name: updatedData.tourist_spot_name,
          average_cost: updatedData.average_cost,
          location: updatedData.location,
          seasonality: updatedData.seasonality,
          country_name: updatedData.country_name,
          short_description: updatedData.short_description,
          image: updatedData.image,
          travel_time: updatedData.travel_time,
          total_visitors_per_year: updatedData.total_visitors_per_year,
          country_flag: updatedData.country_flag,
        },
      };
      const result = await spotsCollection.updateOne(filter, updatedSpot);

      res.send(result);
    });
    // deleting spot
    app.delete("/spots/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await spotsCollection.deleteOne(query);
      res.send(result);
    });
    // finding lists by user email
    app.get("/lists/:email", async (req, res) => {
      const query = {
        user_email: req.params.email,
      };

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
    // reading countrywise spots
    app.get("/countrywisespots/:country", async (req, res) => {
      const query = { country_name: req.params.country };
      const cursor = spotsCollection.find(query);
      const result = await cursor.toArray();
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
