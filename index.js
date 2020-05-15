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

const defaultDB = {
    history: [
        {
            humidity: 40,
            temperature: 91,
            pressure: 1.2,
            time: new Date(),
        }
    ],
    system: {
        active: true
    }
}

db.defaults(defaultDB).write();

const run = () => {
    setTimeout(() => {
        db.get('history')
            .push({
                humidity: 40,
                temperature: 91,
                pressure: 1.2,
                time: new Date(),
            })
            .write()
        io.emit('weather_update', db.get('history').value())
        run();

    }, 60000);
}

app.get('/api/weather/history', (req, res) => {
    console.log({ route: "/api/weather/history" })
    res.send(db.get('history')
        .value())
})

app.get('/api/weather/current', (req, res) => {
    console.log({ route: "/api/weather/current" })
    res.send({
        humidity: 40,
        temperature: 91,
        pressure: 1.2,
        time: new Date(),
    })
})

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
        weather: {
            description: "Get the status of all zones",
            route: "/api/weather",
            history: {
                description: "Get historic weather data",
                route: "/api/zones/on",
            },
        },
    })
})

server.listen(port, () => {
    console.log('Weather Station running on :6700');
    run();
});