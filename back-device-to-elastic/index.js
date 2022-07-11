const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(bodyParser.json());

const logStyle = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    // Foreground (text) colors
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m"
    },
    // Background colors
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};

// Express routes
app.get('/get-my-ad', async (req, res) => {
    try {
        var startTime = Date.now();

        const space = await client.search({
            index: "adspaces",
            body: {
                query: {
                    "ids": {
                        "values": [
                            req.query.spaceid
                        ]
                    }
                }
            }
        }).then(async response => {
            const ad = await client.search({
                index: "advertisements",
                body: {
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "match": {
                                        "targets.userProfile.sex": response.hits.hits[0]._source.userProfile.sex
                                    }
                                },
                                {
                                    "match": {
                                        "targets.restrictedContent.mature": response.hits.hits[0]._source.restrictedContent.mature
                                    }
                                },
                                {
                                    "match": {
                                        "targets.restrictedContent.gamble": response.hits.hits[0]._source.restrictedContent.gamble
                                    }
                                },
                                {
                                    "match": {
                                        "targets.restrictedContent.politic": response.hits.hits[0]._source.restrictedContent.politic
                                    }
                                },
                                {
                                    "match": {
                                        "targets.restrictedContent.religion": response.hits.hits[0]._source.restrictedContent.religion
                                    }
                                },
                                {
                                    "range": {
                                        "targets.bid.max": {
                                            "gte": response.hits.hits[0]._source.validConditions.minBid
                                        }
                                    }
                                },
                                {
                                    "range": {
                                        "targets.userProfile.age.from": {
                                            "lte": response.hits.hits[0]._source.userProfile.age.minBid
                                        }
                                    }
                                },
                                {
                                    "range": {
                                        "targets.userProfile.age.to": {
                                            "gte": response.hits.hits[0]._source.userProfile.age.maxBid
                                        }
                                    }
                                }
                            ],
                            "minimum_should_match": "100%"
                        }
                    },
                    "sort": [
                        {
                            "targets.bid.max": {
                                "order": "desc"
                            }
                        }
                    ]
                }
            }).then(ad => {
                var elapsedTime = Date.now() - startTime;
                var adId = 0;
                if (ad.hits.hits[0])
                    adId = ad.hits.hits[0]._id;
                console.log(`%s${"[/get-my-ad] "}` + `%s${"Advertisement ID : \"" + adId + "\" has been sent to : \"" + req.get('host') + "\" !"}` + `%s${" +" + elapsedTime + "ms"}`, logStyle.fg.cyan, logStyle.fg.white, logStyle.fg.green);
                res.send(ad);
            });
        });
    } catch (error) {
    }
});

app.listen(8081);
console.log(`%s${"///////////////////////////////////////////////////"}`, logStyle.fg.blue);
console.log(`%s${"CONGRATULATIONS 😁 "}` + `%s${"SERVER READY TO WORK ! 🤟"}`, logStyle.fg.yellow, logStyle.fg.green);
console.log(`%s${"LISTENING ON : "}` + `%s${"8081"}`, logStyle.fg.magenta, logStyle.fg.cyan);
console.log(`%s${"///////////////////////////////////////////////////"}`, logStyle.fg.blue);
