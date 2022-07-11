const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));

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

//GLOBAL DATA XD
var createAd = [];
var createSpace = [];
var deleteDocument = [];

// Express routes
app.post('/create-index', async (req, res) => {
    var startTime = Date.now();
    const result = await client.indices.create({
        index: req.body.index
    });

    await client.indices.refresh({ index: req.body.index })

    var elapsedTime = Date.now() - startTime;
    console.log(`%s${"[/create-index] "}` + `%s${"Index : \"" + req.body.index + "\" has been created !"}` + `%s${" +" + elapsedTime + "ms"}`, logStyle.fg.green, logStyle.fg.yellow, logStyle.fg.green);
    res.send(result);
});

app.get("/list-by-index", async (req, res) => {
    var startTime = Date.now();
    const result = await client.search({
        index: req.query.index
    });

    var elapsedTime = Date.now() - startTime;
    console.log(`%s${"[/list-by-index] "}` + `%s${"All documents from Index : \"" + req.query.index + "\" has been sent to : \"" + req.get('host') + "\" !"}` + `%s${" +" + elapsedTime + "ms"}`, logStyle.fg.cyan, logStyle.fg.white, logStyle.fg.green);
    res.json(result);
});

app.get("/data-requests", async (req, res) => {
    var startTime = Date.now();

    var allData = {
        createAd: createAd,
        createSpace: createSpace,
        deleteDocument: deleteDocument
    };

    var elapsedTime = Date.now() - startTime;
    console.log(`%s${"[/data-requests] "}` + `%s${"All requests Datas has been sent to : \"" + req.get('host') + "\" !"}` + `%s${" +" + elapsedTime + "ms"}`, logStyle.fg.cyan, logStyle.fg.white, logStyle.fg.green);
    res.json(allData);
});

app.delete("/remove-index", async (req, res) => {
    var startTime = Date.now();
    const result = await client.indices.delete({
        index: req.body.index
    });

    var elapsedTime = Date.now() - startTime;
    console.log(`%s${"[/remove-index] "}` + `%s${"Index : \"" + req.body.index + "\" has be removed with all underlying Documents!"}` + `%s${" +" + elapsedTime + "ms"}`, logStyle.fg.magenta, logStyle.fg.cyan, logStyle.fg.green);
    res.json(result);
});

app.post('/create-ad', async (req, res) => {
    var startTime = Date.now();
    var query = JSON.parse(req.body.newAd);
    const result = await client.index({
        index: query.index,
        body: {
            adFile: {
                adTitle: query.title,
                adFile: req.body.adFile
            },
            targets: {
                userProfile: {
                    age: {
                        from: query.targets.userProfile.age.from,
                        to: query.targets.userProfile.age.to
                    },
                    sex: query.targets.userProfile.sex
                },
                restrictedContent: {
                    mature: query.targets.restrictedContent.mature,
                    gamble: query.targets.restrictedContent.gamble,
                    politic: query.targets.restrictedContent.politic,
                    religion: query.targets.restrictedContent.religion
                },
                bid: {
                    min: query.targets.bid.min,
                    max: query.targets.bid.max
                },
                period: {
                    from: query.targets.period.from,
                    to: query.targets.period.to
                }
            }
        }
    });

    await client.indices.refresh({ index: query.index });

    var elapsedTime = Date.now() - startTime;
    var date = new Date();
    date = date.toISOString().split('T')[0].split('-');
    date = date[2] + '-' + date[1] + '-' + date[0];
    createAd.push([date, elapsedTime]);
    console.log(`%s${"[/create-ad] "}` + `%s${"New AD has been created on Index : \"" + query.index + "\" !"}` + `%s${" +" + elapsedTime + "ms"}`, logStyle.fg.green, logStyle.fg.yellow, logStyle.fg.green);
    res.send(result);
});

app.post('/create-admap', async (req, res) => {
    var startTime = Date.now();
    const result = await client.indices.putMapping({
        index: req.body.index,
        body: {
            properties: {
                adFile: {
                    properties: {
                        adTitle: { type: "text" },
                        adFile: { type: "text" }
                    }
                },
                targets: {
                    properties: {
                        userProfile: {
                            properties: {
                                age: {
                                    properties: {
                                        from: { type: "integer" },
                                        to: { type: "integer" }
                                    }
                                },
                                sex: { type: "text" }
                            }
                        },
                        restrictedContent: {
                            properties: {
                                mature: { type: "boolean" },
                                gamble: { type: "boolean" },
                                politic: { type: "boolean" },
                                religion: { type: "boolean" }
                            }
                        },
                        bid: {
                            properties: {
                                min: { type: "float" },
                                max: { type: "float" }
                            }
                        },
                        period: {
                            properties: {
                                from: {
                                    type: "date",
                                    format: "dd-MM-yyyy"
                                },
                                to: {
                                    type: "date",
                                    format: "dd-MM-yyyy"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    await client.indices.refresh({ index: req.body.index })

    var elapsedTime = Date.now() - startTime;
    console.log(`%s${"[/create-admap] "}` + `%s${"Map for Index : \"" + req.body.index + "\" has been created !"}` + `%s${" +" + elapsedTime + "ms"}`, logStyle.fg.green, logStyle.fg.yellow, logStyle.fg.green);
    res.send(result);
});

app.post('/create-adspace', async (req, res) => {
    var startTime = Date.now();
    var targets = JSON.parse(req.body.targets);
    const result = await client.index({
        index: req.body.index,
        body: {
            name: targets.name,
            userProfile: {
                age: {
                    from: targets.userProfile.age.from,
                    to: targets.userProfile.age.to
                },
                sex: targets.userProfile.sex
            },
            restrictedContent: {
                mature: targets.restrictedContent.mature,
                gamble: targets.restrictedContent.gamble,
                politic: targets.restrictedContent.politic,
                religion: targets.restrictedContent.religion
            },
            validConditions: {
                minBid: targets.validConditions.minBid
            }
        }
    });

    await client.indices.refresh({ index: req.body.index });

    var elapsedTime = Date.now() - startTime;
    var date = new Date();
    date = date.toISOString().split('T')[0].split('-');
    date = date[2] + '-' + date[1] + '-' + date[0];
    createSpace.push([date, elapsedTime]);
    console.log(`%s${"[/create-adspace] "}` + `%s${"New AD SPACE has been created on Index : \"" + req.body.index + "\" !"}` + `%s${" +" + elapsedTime + "ms"}`, logStyle.fg.green, logStyle.fg.yellow, logStyle.fg.green);
    res.send(result);
});

app.post('/create-spacemap', async (req, res) => {
    var startTime = Date.now();
    const result = await client.indices.putMapping({
        index: req.body.index,
        body: {
            properties: {
                name: { type: "text" },
                targets: {
                    properties: {
                        userProfile: {
                            properties: {
                                age: {
                                    properties: {
                                        from: { type: "integer" },
                                        to: { type: "integer" }
                                    }
                                },
                                sex: { type: "text" }
                            }
                        },
                        restrictedContent: {
                            properties: {
                                mature: { type: "boolean" },
                                gamble: { type: "boolean" },
                                politic: { type: "boolean" },
                                religion: { type: "boolean" }
                            }
                        },
                        validConditions: {
                            properties: {
                                minBid: { type: "float" }
                            }
                        }
                    }
                }
            }
        }
    });

    await client.indices.refresh({ index: req.body.index })

    var elapsedTime = Date.now() - startTime;
    console.log(`%s${"[/create-spacemap] "}` + `%s${"Map for Index : \"" + req.body.index + "\" has been created !"}` + `%s${" +" + elapsedTime + "ms"}`, logStyle.fg.green, logStyle.fg.yellow, logStyle.fg.green);
    res.send(result);
});

app.delete("/remove-document", async (req, res) => {
    try {
        var startTime = Date.now();
        await client.deleteByQuery({
            index: req.body.index,
            body: {
                query: {
                    "ids": {
                        "values": [
                            req.body.id
                        ]
                    }
                }
            }
        }).then(async result => {
            var startTime = Date.now();
            await client.search({
                index: req.body.index
            }).then(data => {
                var elapsedTime = Date.now() - startTime;
                var date = new Date();
                date = date.toISOString().split('T')[0].split('-');
                date = date[2] + '-' + date[1] + '-' + date[0];
                deleteDocument.push([req.body.index, date, elapsedTime]);
                console.log(`%s${"[/remove-document] "}` + `%s${"Document ID : \"" + req.body.id + "\" has be removed !"}` + `%s${" +" + elapsedTime + "ms"}`, logStyle.fg.magenta, logStyle.fg.cyan, logStyle.fg.green);    
                console.log(`%s${"[/list-by-index] "}` + `%s${"All documents from Index : \"" + req.body.index + "\" has been sent to : \"" + req.get('host') + "\" !"}` + `%s${" +" + elapsedTime + "ms"}`, logStyle.fg.cyan, logStyle.fg.white, logStyle.fg.green);
                res.json(data);
            });
        });
    } catch (error) {
    }
});

app.listen(8080);
console.log(`%s${"///////////////////////////////////////////////////"}`, logStyle.fg.blue);
console.log(`%s${"CONGRATULATIONS 😁 "}` + `%s${"SERVER READY TO WORK ! 🤟"}`, logStyle.fg.yellow, logStyle.fg.green);
console.log(`%s${"LISTENING ON : "}` + `%s${"8080"}`, logStyle.fg.magenta, logStyle.fg.cyan);
console.log(`%s${"///////////////////////////////////////////////////"}`, logStyle.fg.blue);
