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

const socket = io('http://localhost:9700/');


function App() {
  const [testing, setTesting] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [height, setHeight] = React.useState(window.innerHeight - 129)
  const inline = {
    zones: {
      height: height,
      flexWrap: "wrap"
    }
  }
  React.useLayoutEffect(() => {
    axios.get('/api/speed/status')
      .then(response => {
        setTesting(response.data)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }, [])

  window.addEventListener('resize', () => {
    setHeight(window.innerHeight - 129)
  })

  const start = () => {
    setLoading(true)
    axios.get('/api/speed/start')
      .then(response => {
        setTesting(true)
        setLoading(false)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }

  const stop = () => {
    setLoading(true)
    axios.get('/api/speed/stop')
      .then(response => {
        setTesting(false)
        setLoading(false)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }

  const clear = () => {
    setLoading(true)
    axios.get('/api/speed/clear')
      .then(response => {
        setTesting(false)
        setLoading(false)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }

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
            <Graph socket={socket} />
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
