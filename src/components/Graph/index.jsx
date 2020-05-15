import React from 'react';
import axios from 'axios'
import { ResponsiveLine } from '@nivo/line'


const Graph = ({ socket, data, yAxis, min, max, color }) => {
    return (
        <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min, max, stacked: true, reverse: false }}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: yAxis,
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            enableGridY={false}
            colors={[color]}
            pointSize={6}
            enablePoints={false}
            enableGridX={false}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            curve={"monotoneX"}
            crosshairType="cross"
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    )
}

export default Graph;