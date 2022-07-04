const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const app = express();
app.use(bodyParser.urlencoded({
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

// Express routes
app.post('/create-index', async (req, res) => {
    const result = await client.indices.create({
        index: req.body.index
    });

    await client.indices.refresh({ index: req.body.index })

    console.log(`%s${"[/create-index] "}` + `%s${"Index : \"" + req.body.index + "\" has been created !"}`, logStyle.fg.green, logStyle.fg.yellow);
    res.send(result);
});

app.get("/list-by-index", async (req, res) => {
    const result = await client.search({
        index: req.query.index
    });

    console.log(`%s${"[/list-by-index] "}` + `%s${"All documents from Index : \"" + req.query.index + "\" has been sent to : \"" + req.get('host') + "\" !"}`, logStyle.fg.cyan, logStyle.fg.white);
    res.json(result);
});

app.delete("/remove-index", async (req, res) => {
    const result = await client.indices.delete({
        index: req.body.index
    });

    console.log(`%s${"[/remove-index] "}` + `%s${"Index : \"" + req.body.index + "\" has be removed with all underlying Documents!"}`, logStyle.fg.magenta, logStyle.fg.cyan);
    res.json(result);
});

app.post('/create-ad', upload.single('adFile'), async (req, res) => {
    var query = JSON.parse(req.body.newAd);
    const result = await client.index({
        index: query.index,
        body: {
            adFile: req.file,
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

    console.log(`%s${"[/create-ad] "}` + `%s${"New AD has been created on Index : \"" + query.index + "\" !"}`, logStyle.fg.green, logStyle.fg.yellow);
    res.send(result);
});

app.post('/create-admap', async (req, res) => {
    const result = await client.indices.putMapping({
        index: req.body.index,
        body: {
            properties: {
                adFile: { type: "object" },
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

    console.log(`%s${"[/create-admap] "}` + `%s${"Map for Index : \"" + req.body.index + "\" has been created !"}`, logStyle.fg.green, logStyle.fg.yellow);
    res.send(result);
});

app.post('/create-adspace', async (req, res) => {
    var targets = JSON.parse(req.body.targets);
    const result = await client.index({
        index: req.body.index,
        body: {
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

    console.log(`%s${"[/create-adspace] "}` + `%s${"New AD SPACE has been created on Index : \"" + req.body.index + "\" !"}`, logStyle.fg.green, logStyle.fg.yellow);
    res.send(result);
});

app.post('/create-spacemap', async (req, res) => {
    const result = await client.indices.putMapping({
        index: req.body.index,
        body: {
            properties: {
                adFile: { type: "object" },
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

    console.log(`%s${"[/create-spacemap] "}` + `%s${"Map for Index : \"" + req.body.index + "\" has been created !"}`, logStyle.fg.green, logStyle.fg.yellow);
    res.send(result);
});

app.delete("/remove-document", async (req, res) => {
    const result = await client.deleteByQuery({
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
    });

    console.log(`%s${"[/remove-document] "}` + `%s${"Document ID : \"" + req.body.id + "\" has be removed !"}`, logStyle.fg.magenta, logStyle.fg.cyan);
    res.json(result);
});

app.listen(8080);
console.log(`%s${"///////////////////////////////////////////////////"}`, logStyle.fg.blue);
console.log(`%s${"CONGRATULATIONS 😁 "}` + `%s${"SERVER READY TO WORK ! 🤟"}`, logStyle.fg.yellow, logStyle.fg.green);
console.log(`%s${"LISTENING ON : "}` + `%s${"8080"}`, logStyle.fg.magenta, logStyle.fg.cyan);
console.log(`%s${"///////////////////////////////////////////////////"}`, logStyle.fg.blue);
