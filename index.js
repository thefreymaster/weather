const express = require('express');
const app = express();
const path = require('path')

const port = 6700;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const os = require('os');
const networkInterfaces = os.networkInterfaces();

app.use(express.json());
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/images'));

const server = require('http').Server(app);
const io = require('socket.io')(server);

const defaultZones = []

const defaultDB = {
    zones: defaultZones,
    calendar: [],
    system: {
        active: true
    }
}

db.defaults(defaultDB).write()

app.get('/api/status', (req, res) => {
    console.log({ route: "/api/status" })
    res.send({
        active: true,
        version: '1.0.0',
        app: 'Weather',
        uptime: `${process.uptime().toFixed(0)} seconds`,
        ip: networkInterfaces
    })
})

app.get('/api', (req, res) => {
    res.send({
        status: {
            description: "Get the status of the server",
            route: "/api/status"
        },
        zones: {
            description: "Get the status of all zones",
            route: "/api/zones",
            on: {
                description: "Turn all zones on",
                route: "/api/zones/on",
            },
            off: {
                description: "Turn all zones off",
                route: "/api/zones/off",
            }
        },
        zone: {
            description: "Get the status of one zone",
            route: "/api/zone/:zone_id",
            on: {
                description: "Set a zone to active",
                route: "/api/zone/on/:zone_id"
            },
            off: {
                description: "Set a zone to inactive",
                route: "/api/zone/off/:zone_id"
            }
        }
    })
})

server.listen(port, () => {

});