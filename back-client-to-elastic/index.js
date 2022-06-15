const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

// Express routes
app.post('/create-index', async (req, res) => {
    const result = await client.index({
        index: req.body.index,
        id: req.body.id,
        body: {
            name: req.body.name,
            lastName: req.body.lastName
        }
    });

    await client.indices.refresh({ index: 'data' })

    res.send(result);
});

app.get("/search-index", async (req, res) => {
    const result = await client.search({
        index: req.query.index
    });
    res.json(result);
});

app.delete("/remove-by-index", async (req, res) => {
    const result = await client.indices.delete({
        index: req.body.index
    });

    res.json(result);
});

app.listen(8080);