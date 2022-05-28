const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g1hr7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('ram-manufacturer').collection('products');

        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

    }
    finally {
        
    }
    
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from ram manufacturer!')
})

app.listen(port, () => {
  console.log(`ram manufacturer app listening on port ${port}`)
})