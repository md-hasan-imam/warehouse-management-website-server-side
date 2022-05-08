const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
// const { json } = require('express/lib/response');

const ObjectId = require('mongodb').ObjectId;



// app.use(express.json());
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://inventoryManager:ZDgVFWJjc6ysWP5Q@cluster0.mlrdp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const inventoryCollection = client.db('stoCare').collection('inventories');


    // loading all inventories 
    app.get('/inventories', async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const inventories = await cursor.toArray();
      res.send(inventories);
      console.log(inventories)
    })

    // loading single inventories using dynamic url
    app.get('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventory = await inventoryCollection.findOne(query);
      res.send(inventory);
    })

    // update quantity of single inventory
    app.put('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const updateQuantity = req.body;
      const updatedQuantity = updateQuantity.newQuantity;
      const options = { upsert: true };
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          quantity: updatedQuantity
        },
      };
      const result = await inventoryCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    // delete single item from database
    app.delete('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await inventoryCollection.deleteOne(query);
      res.send(result);
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('running my inventory server')
})


app.listen(port, () => {
  console.log('server is running on port', port);
})