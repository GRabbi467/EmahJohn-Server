const express = require('express');
const cors = require('cors');
const app= express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const  port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`EmaJohn  Running on port ${port}`)
})

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('EmaJhon Server is running')
})

const uri = `mongodb+srv://${process.env.EmaJhonDBUser}:${process.env.EmaJhonDBPass}
@cluster0.ctntq2l.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {

  try {
    const DB = client.db('Ema-Jhon').collection('ProductsCollection');
    app.get('/products',async(req,res)=>{
       
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);
        const query = {};
        const cursor = DB.find({});
        const products = await cursor.skip(page*size).limit(size).toArray();
        const count = await DB.estimatedDocumentCount();
        res.send({count,products});
    });


    app.post('/productsstored',async(req,res)=>{
      const ids = req.body;
      console.log(ids)
      const objectIds = ids.map(id =>new ObjectId(id))
      const query = {_id :{$in : objectIds}};
      const cursor = DB.find(query);
      const productsCart = await cursor.toArray();
      res.send(productsCart);
    })
    
  } finally {
   
    
  }
}
run().catch(console.dir);

