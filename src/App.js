import React, { useLayoutEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getZones } from './api/rest';
import io from 'socket.io-client';
import { Layout, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faWater, faShower, faRadiation, faWind } from '@fortawesome/free-solid-svg-icons'
import { isMobile } from 'react-device-detect';
import Graph from './components/Graph';
import axios from 'axios'
import Loader from 'react-loader-spinner'

const { Header, Footer, Sider, Content } = Layout;

const socket = io('http://192.168.124.22:6700/');


function App() {
  const [height, setHeight] = React.useState(window.innerHeight - 129);
  const [temperature, setTemperature] = React.useState([]);
  const [humidity, setHumidity] = React.useState([]);
  const [pressure, setPressure] = React.useState([]);

  const inline = {
    zones: {
      height: height,
      width: window.innerWidth,
      display: 'flex',

    }
  }

  React.useLayoutEffect(() => {
    socket.on('weather_update', (data) => {
      setTemperature([
        {
          id: "temperature",
          color: "hsl(57, 70%, 50%)",
          data: data.temperature,
        },
      ]);
      setHumidity([
        {
          id: "humidity",
          color: "hsl(266, 70%, 50%)",
          data: data.humidity,
        },
      ]);
      setPressure([
        {
          id: "pressure",
          color: "hsl(135, 70%, 50%)",
          data: data.pressure,
        }
      ]);
    })
    axios.get('/api/weather/history')
      .then(response => {
        setTemperature([
          {
            id: "temperature",
            color: "hsl(57, 70%, 50%)",
            data: response.data.temperature,
          },
        ]);
        setHumidity([
          {
            id: "humidity",
            color: "hsl(266, 70%, 50%)",
            data: response.data.humidity,
          },
        ]);
        setPressure([
          {
            id: "pressure",
            color: "hsl(135, 70%, 50%)",
            data: response.data.pressure,
          }
        ]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }, [])

  window.addEventListener('resize', () => {
    setHeight(window.innerHeight - 129)
  })

  if (temperature.length === 0 || humidity.length === 0 || pressure.length === 0) {
    return (
      <Loader
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={10000} //3 secs
      />
    );
  }

  console.log(temperature[0].data[temperature[0].data.length - 1])

  const currentTemp = temperature[0].data[temperature[0].data.length - 1].y;
  const currentHumidity = humidity[0].data[humidity[0].data.length - 1].y;
  const currentPressure = pressure[0].data[pressure[0].data.length - 1].y;

  return (
    <Layout>
      <Header>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: isMobile ? "center" : "flex-start", alignItems: "center" }}>
          <FontAwesomeIcon color="white" icon={faWind} />
          <div style={{ color: "white", fontWeight: 900, marginLeft: 10 }}>SKYNET Weather Station</div>
          <div style={{ flexGrow: 1 }} />
          <div style={{ marginLeft: 10 }} />
          {!isMobile && <div>
            <Typography.Text disabled>
              {currentTemp}° | {currentHumidity}% | {currentPressure} inHg
            </Typography.Text>
          </div>}
        </div>
      </Header>
      <Layout>
        <Content>
          <div className="zones-container" style={inline.zones}>
            {isMobile
              ?
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100%', flexDirection: 'column' }}>

                <Typography.Title disabled>{currentTemp}°</Typography.Title>
                <Typography.Text disabled>Temperature</Typography.Text>

                <Typography.Title disabled>{currentHumidity}%</Typography.Title>
                <Typography.Text disabled>Humidity</Typography.Text>

                <Typography.Title disabled>{currentPressure} inHg</Typography.Title>
                <Typography.Text disabled>Pressure</Typography.Text>
              </div>
              :
              <React.Fragment>
                <div style={{ flexDirection: 'column', minWidth: '33%' }}>
                  <Typography.Title disabled>{currentTemp}°</Typography.Title>
                  <Typography.Text disabled>Temperature</Typography.Text>
                  <Graph color="#29659d" data={temperature} socket={socket} yAxis="Temperature" min={50} max={90} />
                </div>
                <div style={{ flexDirection: 'column', minWidth: '33%' }}>
                  <Typography.Title disabled>{currentHumidity}%</Typography.Title>
                  <Typography.Text disabled>Humidity</Typography.Text>
                  <Graph color="#29659d" data={humidity} socket={socket} yAxis="Humidty" min={0} max={100} />
                </div>
                <div style={{ flexDirection: 'column', minWidth: '33%' }}>
                  <Typography.Title disabled>{currentPressure} inHg</Typography.Title>
                  <Typography.Text disabled>Pressure</Typography.Text>
                  <Graph color="#29659d" data={pressure} socket={socket} yAxis="Pressure" min={28} max={32} />
                </div>
              </React.Fragment>
            }
          </div>
        </Content>
      </Layout>
      <Footer>
        <div style={{ display: "flex", justifyContent: "center", fontSize: 11, color: "#b4b6ba" }}>
          Canvas 23 Studios
        </div>
      </Footer>
    </Layout>

  );
}

export default App;
