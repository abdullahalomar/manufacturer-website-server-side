const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g1hr7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('ram-manufacturer').collection('products');
        const orderCollection = client.db('ram-manufacturer').collection('orders');
        const reviewCollection = client.db('ram-manufacturer').collection('reviews');

        
         
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        app.get('/order', async (req, res) => {
            const user = req.query.user;
            const query = { user_id: user };
            const orders = orderCollection.find(query);
            const result = await orders.toArray();
            res.send(result);
        })

        app.post('/create-order', async (req, res) => {
            const newOrders = req.body;
            const result = await orderCollection.insertOne(newOrders);
            res.send(result);
        })

        app.get('/delete-order/:order', async (req, res) => {
            const order = req.params.order;
            const result = await orderCollection.findOneAndDelete({ '_id': ObjectId(order) });
            res.send(result);

        });

        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/add-review', async (req, res) => {
            const newReviews = req.body;
            const result = await reviewCollection.insertOne(newReviews);
            res.send(result);
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