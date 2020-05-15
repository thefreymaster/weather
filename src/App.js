import React, { useLayoutEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getZones } from './api/rest';
import io from 'socket.io-client';
import { Layout, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faWater, faShower, faRadiation, faWind } from '@fortawesome/free-solid-svg-icons'
import { isMobile } from 'react-device-detect';
import Graph from './components/Graph';
import axios from 'axios'

const { Header, Footer, Sider, Content } = Layout;

const socket = io('http://192.168.124.22:6700/');


function App() {
  const [height, setHeight] = React.useState(window.innerHeight - 129);
  const [temperature, setTemperature] = React.useState([]);
  const [humidy, setHumidy] = React.useState([]);
  const [pressure, setPressure] = React.useState([]);

  const inline = {
    zones: {
      height: height,
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
      setHumidy([
        {
          id: "humidy",
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
        setHumidy([
          {
            id: "humidy",
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

  return (
    <Layout>
      <Header>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: isMobile ? "center" : "flex-start", alignItems: "center" }}>
          <FontAwesomeIcon color="white" icon={faWind} />
          <div style={{ color: "white", fontWeight: 900, marginLeft: 10 }}>SKYNET Weather Station</div>
          <div style={{ flexGrow: 1 }} />
          <div style={{ marginLeft: 10 }} />
        </div>
      </Header>
      <Layout>
        <Content>
          <div className="zones-container" style={inline.zones}>
            <Graph color="#29659d" data={temperature} socket={socket} yAxis="Temperature" min={50} max={90} />
            <Graph color="#29659d" data={humidy} socket={socket} yAxis="Humidty" min={0} max={100} />
            <Graph color="#29659d" data={pressure} socket={socket} yAxis="Pressure" min={28} max={32} />
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
