import React from 'react';
import axios from 'axios'
import { ResponsiveLine } from '@nivo/line'


const Graph = ({ socket }) => {
    const [weather, setWeather] = React.useState([]);
    React.useLayoutEffect(() => {
        socket.on('speed_update', (data) => {
            setWeather([
                {
                    id: "Speed weather",
                    data: data
                }
            ])
        })
        axios.get('/api/weather/history')
            .then(response => {
                setWeather([
                    {
                        id: "Weather",
                        data: response.data
                    }
                ])
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }, [])
    return (
        <ResponsiveLine
            data={weather}
            margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Temperature/Humidity/Pressure',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            colors={{ scheme: 'paired' }}
            pointSize={6}
            enableArea
            enablePoints={false}
            enableGridX={false}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            useMesh={true}
            curve={"monotoneX"}
            crosshairType="x"
        />
    )
}

export default Graph;