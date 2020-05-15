const express = require('express');
const app = express();
const path = require('path');
const imu = require("node-sense-hat").Imu;
const IMU = new imu.IMU();


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
    history: [],
    system: {
        active: true
    }
}

db.defaults(defaultDB).write();

const convertToF = (celsius) => {
    return ((celsius * (9 / 5)) + 32).toFixed(2);
}

const getPressure = (pressure) => {
    return (pressure / 33.864).toFixed(2);
}

const getHumidity = (humidity) => {
    return data.humidity.toFixed(2);
}
const run = () => {
    setTimeout(() => {
        IMU.getValue((err, data) => {
            if (err !== null) {
                console.error("Could not read sensor data: ", err);
                return;
            }
            console.log("Temp is: ", convertToF(data.temperature));
            console.log("Pressure is: ", getPressure(data.pressure));
            console.log("Humidity is: ", getHumidity(data.humidity));
            db.get('history')
                .push({
                    humidity: getHumidity(data.humidity),
                    temperature: convertToF(data.temperature),
                    pressure: getPressure(data.pressure),
                    time: new Date(),
                })
                .write()
            io.emit('weather_update', db.get('history').value())
            run();
        });
    }, 10000);
}

app.get('/api/weather/history', (req, res) => {
    console.log({ route: "/api/weather/history" })
    res.send(db.get('history')
        .value())
})

app.get('/api/weather/current', (req, res) => {
    console.log({ route: "/api/weather/current" })
    IMU.getValue((err, data) => {
        if (err !== null) {
            console.error("Could not read sensor data: ", err);
            return;
        }
        console.log("Temp is: ", convertToF(data.temperature));
        console.log("Pressure is: ", getPressure(data.pressure));
        console.log("Humidity is: ", getHumidity(data.humidity));
        db.get('history')
            .push({
                humidity: getHumidity(data.humidity),
                temperature: convertToF(data.temperature),
                pressure: getPressure(data.pressure),
                time: new Date(),
            })
            .write()
        io.emit('weather_update', db.get('history').value())
        res.send({
            humidity: getHumidity(data.humidity),
            temperature: convertToF(data.temperature),
            pressure: getPressure(data.pressure),
            time: new Date(),
        });
    });
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