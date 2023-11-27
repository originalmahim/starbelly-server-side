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


  app.get('/allmeals', async(req,res) => {
      const meals = await mealsFile.find().toArray();
      res.send(meals)
  })
  
 
  app.post('/users', async(req,res) => {
    const users = req.body;
    const result = await usersFile.insertOne(users)
    res.send(result)
  })



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