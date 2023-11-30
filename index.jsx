require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqvmyxo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const mealsFile = client.db('mealsFile').collection('mealsCollection');
const upcomingFile = client.db('upcomingFile').collection('upcomingCollection');
const usersFile = client.db('usersFile').collection('usersCollection');
const requestFile = client.db('requestFile').collection('requestCollection');
const packageFile = client.db('packageFile').collection('packageCollection');

app.get('/allmeals', async (req, res) => {
  try {
    const meals = await mealsFile.find().toArray();
    res.send(meals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/allmeals', async (req, res) => {
  try {
    const product = req.body;
    const result = await mealsFile.insertOne(product);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/upcoming', async (req, res) => {
  try {
    const meals = await upcomingFile.find().toArray();
    res.send(meals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/upcoming', async (req, res) => {
  try {
    const product = req.body;
    const result = await upcomingFile.insertOne(product);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/request', async (req, res) => {
  try {
    const meals = await requestFile.find().toArray();
    res.send(meals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/req', async (req, res) => {
  try {
    const meals = await requestFile.find().toArray();
    res.send(meals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/req/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const queary = { _id: new ObjectId(id) };
    const meals = await requestFile.findOne(queary);
    res.send(meals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/request/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const queary = { email: email };
    const result = await requestFile.find(queary).toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/request', async (req, res) => {
  try {
    const product = req.body;
    const result = await requestFile.insertOne(product);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.patch('/req/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const queary = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        status: 'Delivered',
      },
    };
    const result = await requestFile.updateOne(queary, updatedDoc);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/package', async (req, res) => {
  try {
    const meals = await packageFile.find().toArray();
    res.send(meals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/package/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const queary = { _id: new ObjectId(id) };
    const meals = await packageFile.findOne(queary);
    res.send(meals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/users', async (req, res) => {
  try {
    const user = req.body;
    const query = { email: user.email };
    const existingUser = await usersFile.findOne(query);
    if (existingUser) {
      return res.send({ message: 'user already exists', insertedId: null });
    }
    const result = await usersFile.insertOne(user);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { price } = req.body;
    const amount = parseInt(price * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await usersFile.find().toArray();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const queary = { email: email };
    const result = await usersFile.findOne(queary);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users/:email/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.params.email;
    const queary = { _id: new ObjectId(id), email: email };
    const result = await usersFile.findOne(queary);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.patch('/users/:email/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.params.email;
    const queary = { _id: new ObjectId(id), email: email };
    const updatedDoc = {
      $set: {
        role: 'admin',
      },
    };
    const result = await usersFile.updateOne(queary, updatedDoc);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/us/:email/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.params.email;
    const queary = { _id: new ObjectId(id), email: email };
    const result = await usersFile.findOne(queary);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.patch('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const newSubscriptionStatus = req.body.subscriptionStatus;

    const query = { email: email };

    const updatedDoc = {
      $set: {
        subscriptionStatus: newSubscriptionStatus,
      },
    };
    const result = await usersFile.updateOne(query, updatedDoc);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.patch('/us/:email/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.params.email;
    const newSubscriptionStatus = req.body.subscriptionStatus;

    const query = { _id: new ObjectId(id), email: email };

    const updatedDoc = {
      $set: {
        subscriptionStatus: newSubscriptionStatus,
      },
    };
    const result = await usersFile.updateOne(query, updatedDoc);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/allmeals/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const queary = { _id: new ObjectId(id) };
    const result = await mealsFile.findOne(queary);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/allmeals/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const queary = { _id: new ObjectId(id) };
    const result = await mealsFile.deleteOne(queary);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
