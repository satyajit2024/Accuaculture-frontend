// import React, { useState, useEffect } from 'react';
// import Chart from 'react-apexcharts';

// const Chartbox = ({ metric, data }) => {
//   const [seriesData, setSeriesData] = useState({});
//   const [options] = useState({
//     chart: {
//       id: 'realtime',
//       height: 350,
//       type: 'line',
//       animations: {
//         enabled: true,
//         easing: 'linear',
//         dynamicAnimation: {
//           speed: 1000,
//         },
//       },
//       toolbar: {
//         show: true,
//       },
//       zoom: {
//         enabled: true,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       curve: 'smooth',
//       width: 2,
//       fill: {
//         type: 'gradient',
//         gradient: {
//           shadeIntensity: 4,
//           opacityFrom: 0.7,
//           opacityTo: 0.3,
//           stops: [0, 90, 100],
//         }
//       }
//     },
//     title: {
//       text: ` ${metric}`,
//       align: 'left',
//     },
//     markers: {
//       size: 0,
//     },
//     xaxis: {
//       type: 'category',
//       categories: [],
//     },
//     // yaxis: {
//     //   max: 100,
//     // },
//     legend: {
//       show: true,
//     },
//   });

//   useEffect(() => {
//     console.log(data);
//     if (data.paramType === metric) {
//       setSeriesData(prevSeriesData => {
//         const newData = {
//           x: data.dataPoint.split(' ')[1], // Extract time portion
//           y: parseFloat(data.paramValue).toFixed(2), // Format paramValue to two decimal places
//         };

//         const deviceId = data.deviceId;
//         const existingSeries = prevSeriesData[deviceId] || [];

//         // Maintain only the last 20 data points for each deviceId
//         const newSeries = [...existingSeries.slice(-19), newData];

//         return { ...prevSeriesData, [deviceId]: newSeries };
//       });
//     }
//   }, [data, metric]);

//   const chartSeries = Object.keys(seriesData).map(deviceId => ({
//     name: `Device ${deviceId}`,
//     data: seriesData[deviceId]
//   }));

//   return (
//     <div className='col-12 col-md-6 ' >
//       <Chart options={options} series={chartSeries} type="line" height={350}  />
//     </div>
//   );
// };

// export default Chartbox;


import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const Chartbox = ({ metric, data }) => {
  const [seriesData, setSeriesData] = useState({});
  const [options] = useState({
    chart: {
      id: 'realtime',
      height: 350,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 4,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
    },
    title: {
      text: ` ${metric}`,
      align: 'left',
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'category',
      categories: [],
    },
    legend: {
      show: true,
    },
  });

  useEffect(() => {
    console.log(data);
    if (data.paramType === metric) {
      setSeriesData(prevSeriesData => {
        const newData = {
          x: data.dataPoint.split(' ')[1], // Extract time portion
          y: parseFloat(data.paramValue).toFixed(2), // Format paramValue to two decimal places
        };

        const deviceId = data.deviceId;
        const existingSeries = prevSeriesData[deviceId] || [];

        // Maintain only the last 20 data points for each deviceId
        const newSeries = [...existingSeries.slice(-19), newData];

        return { ...prevSeriesData, [deviceId]: newSeries };
      });
    }
  }, [data, metric]);

  const chartSeries = Object.keys(seriesData).map(deviceId => ({
    name: `Device ${deviceId}`,
    data: seriesData[deviceId]
  }));

  const dummyChartData = [
    { x: '0', y: 20 },
    { x: '0', y: 25 },
    { x: '0', y: 30 },
    { x: '0', y: 35 },
    { x: '0', y: 40 },
  ];

  if (Object.keys(chartSeries).length === 0) {
    return (
      <div className='col-12 col-md-6'>
        <div className="dummy-chart">
          
          <Chart options={options} series={[{ data: dummyChartData }]} type="line" height={350} />
        </div>
      </div>
    );
  }

  return (
    <div className='col-12 col-md-6'>
      <Chart options={options} series={chartSeries} type="line" height={350} />
    </div>
  );
};

export default Chartbox;
