const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000 ;
require('dotenv').config()
app.use(cors())
app.use(express.json())


  const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqvmyxo.mongodb.net/?retryWrites=true&w=majority`;

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const mealsFile = client.db('mealsFile').collection('mealsCollection')
  const usersFile = client.db('usersFile').collection('usersCollection')
  const packageFile = client.db('packageFile').collection('packageCollection')

  app.get('/allmeals', async(req,res) => {
      const meals = await mealsFile.find().toArray();
      res.send(meals)
  })

  app.get('/package', async(req,res) => {
    const meals = await packageFile.find().toArray();
    res.send(meals)
})
app.get('/package/:id', async(req,res) => {
  const id = req.params.id;
  const queary = {_id: new ObjectId(id)}
    const meals = await packageFile.findOne(queary)
    res.send(meals)
})
  
 
  app.post('/users', async (req, res) => {
    const user = req.body;
    const query = { email: user.email }
    const existingUser = await usersFile.findOne(query);
    if (existingUser) {
      return res.send({ message: 'user already exists', insertedId: null })
    }
    const result = await usersFile.insertOne(user);
    res.send(result);
  });

  app.get('/users', async(req,res) => {
    const users = await usersFile.find().toArray();
    res.send(users)
})


app.get('/users/:email', async(req,res) => {
  const email = req.params.email
  const queary = { email: email}
  const result = await usersFile.findOne(queary)
  res.send(result)
})

app.get('/users/:email/:id', async(req,res) => {
  const id = req.params.id;
  const email = req.params.email;
  const queary = {_id: new ObjectId(id), email: email}
  const result = await usersFile.findOne(queary)
  res.send(result)
})

app.patch('/users/:email/:id', async(req,res) => {
  const id = req.params.id;
  const email = req.params.email;
  const queary = {_id: new ObjectId(id), email: email}
  const updatedDoc = {
    $set: {
      role: 'admin'
    }
  }
  const result = await usersFile.updateOne(queary, updatedDoc)
  res.send(result)
})

app.patch('/users/:email/:id', async (req, res) => {
  const id = req.params.id;
  const email = req.params.email;
  const newSubscriptionStatus = req.body.subscriptionStatus;

  const query = { _id: new ObjectId(id), email: email };
  const existingUser = await usersFile.findOne(query);

  // Check if the subscriptionStatus is already the same
  if (existingUser.subscriptionStatus === newSubscriptionStatus) {
    return res.status(200).json({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 0,
      upsertedCount: 0,
      upsertedId: null,
      message: 'Subscription status is already the same.',
    });
  }

  const updatedDoc = {
    $set: {
      subscriptionStatus: newSubscriptionStatus,
    },
  };

  const result = await usersFile.updateOne(query, updatedDoc);
  res.json(result);
});




  app.get('/allmeals/:id', async(req,res) => {
  const id = req.params.id
  const queary = {_id: new ObjectId(id)}
  const result = await mealsFile.findOne(queary)
  res.send(result)
})





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})