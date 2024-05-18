import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Chart from "react-apexcharts";
import { AdminContext } from "../../../App";
import mqtt from "mqtt";
import axios from "axios";

const NgxDynamic = () => {
  const { isSidebarOpen } = useContext(AdminContext);
  const { deviceType, deviceId, accountid } = useParams();
  const [client, setClient] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [devicetypedata, setdevicetypedata] = useState([]);

  useEffect(() => {
    const adminSideDeviceType = localStorage.getItem("adminSideDeviceType");
    if (adminSideDeviceType) {
      const [deviceType, version] = adminSideDeviceType.split(",");
      const apiUrl = `http://${process.env.REACT_APP_App_Ip}/controls_view/${deviceType}/${version}/`;
      const fetchData = async () => {
        try {
          const response = await axios.get(apiUrl);
          setdevicetypedata(response.data);
          let graphInfo = {};

          response.data.forEach(item => {
            if (item.graph) {
              const { display_name, x, y, params } = item.graph;
              const graphLabels = params.map(param => param.graph_label);
              graphInfo[display_name] = { x, y, labels: graphLabels };
            }
          });

          localStorage.setItem('graphinfo', JSON.stringify(graphInfo));
        } catch (error) {
          console.error("API Error:", error);
        }
      };
      fetchData();
    } else {
      console.log("adminSideDeviceType not found in localStorage or in an unexpected format.");
    }
  }, []);

  useEffect(() => {
    const mqttClient = mqtt.connect({
      hostname: "4.240.114.7",
      port: 9001,
      protocol: "ws",
      username: "BarifloLabs",
      password: "Bfl@123",
    });

    setClient(mqttClient);

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe(`${deviceId}/data`);
    });

    mqttClient.on("message", (topic, payload) => {
      const data = JSON.parse(payload.toString());
      console.log(data);
      updateChartData(data);
    });

    return () => {
      if (mqttClient) {
        mqttClient.end();
        console.log("Disconnected from MQTT broker");
      }
    };
  }, []);

  useEffect(() => {
    const graphInfoJSON = localStorage.getItem('graphinfo');
    const graphInfo = JSON.parse(graphInfoJSON);

    const chartsDataArray = Object.entries(graphInfo).map(([key, value]) => {
      const xAxisData = [];
      const seriesData = value.labels.map(() => []);

      return {
        key,
        x: value.x,
        y: value.y,
        seriesName: value.labels,
        seriesData: seriesData,
        xCategories: xAxisData
      };
    });

    setChartData(chartsDataArray);
  }, [devicetypedata]);

  const updateChartData = (mqttData) => {
    if (!mqttData || !mqttData.paramType || !mqttData.paramValue || !mqttData.dataPoint) {
      console.error('Invalid MQTT data:', mqttData);
      return;
    }
    const { paramType, paramValue, dataPoint } = mqttData;
    const formattedParamValue = parseFloat(paramValue).toFixed(2); // Format paramValue to fixed two decimal places
    const lastPortionDataPoint = dataPoint.split(' ').pop();


    setChartData(prevChartData => {
      return prevChartData.map(chart => {
        if (chart.seriesName.includes(paramType)) {
          const seriesIndex = chart.seriesName.indexOf(paramType);
          const existingIndex = chart.xCategories.indexOf(lastPortionDataPoint);

          // Update data if point exists, otherwise add new data
          if (existingIndex !== -1) {
            chart.seriesData[seriesIndex][existingIndex] = { x: lastPortionDataPoint, y: formattedParamValue };
          } else {
            // Remove oldest data if limit reached
            if (chart.seriesData[seriesIndex].length >= 15) {
              chart.seriesData[seriesIndex].shift(); // Remove oldest data point
              chart.xCategories.shift(); // Remove corresponding x-axis label
            }
            chart.seriesData[seriesIndex].push({ x: lastPortionDataPoint, y: formattedParamValue });
            chart.xCategories.push(lastPortionDataPoint);
          }
        }
        return chart;
      });
    });
  };

  const extractTime = (dataPoint) => {
    return dataPoint ? dataPoint.split(' ')[1] : '';
  };

  return (
    <>
      <div style={{ marginLeft: isSidebarOpen ? "280px" : "110px", marginTop: "7px" }}>
        <div className="option" style={{ marginTop: "7px", display: "flex" }}>
          <Dropdown>
            <Dropdown.Toggle style={{ backgroundColor: "#7EE2B0", borderRadius: "13px", color: "black", fontWeight: "bold" }}>
              Time period
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: "20px", backgroundColor: "#7EE2B0", fontSize: "17px" }}>
              <Dropdown.Item>Day- 1 </Dropdown.Item>
              <Dropdown.Item>Day- 2</Dropdown.Item>
              <Dropdown.Item>Day- 3</Dropdown.Item>
              <Dropdown.Item>Day- 4</Dropdown.Item>
              <Dropdown.Item>Day- 5</Dropdown.Item>
              <Dropdown.Item>Day- 6</Dropdown.Item>
              <Dropdown.Item>Day- 7</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Link to={`/admin/createduser/useraccounts/UseraccountDevices/${accountid}`}>
            <button type="button" className="btn btn-danger" style={{ marginLeft: "10px", borderRadius: "13px", fontWeight: "bold" }}>
              Back
            </button>
          </Link>
        </div>
        <div className="d-flex flex-wrap">
          {chartData.map(({ key, x, y, seriesName, seriesData, xCategories }) => {
            const timeCategories = xCategories.map(dateString => {
              const date = new Date(dateString);
              const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return time;
            });

            return (
              <div key={key} className="col-6">
                <h2>{key}</h2>
                <Chart
                  options={{
                    chart: {
                      id: 'realtime',
                      type: 'area',
                      stroke: {
                        curve: 'smooth'
                      },
                      zoom: {
                        enabled: true,
                        type: 'xy'
                      }
                    },
                    xaxis: {
                      title: { text: x },
                      categories: timeCategories
                    },
                    dataLabels:{
                      enabled:false
                    },
                    yaxis: {
                      title: { text: y },
                      labels: {
                        formatter: function (value) {
                          return parseFloat(value).toFixed(2); // Format y-axis labels to two decimal places
                        }
                      }
                    },
                    fill: {
                      type: 'gradient',
                      gradient:{
                        opacityFrom:0.4,
                        opacityTo:0.9
                      }
                    }
                  }}
                  series={seriesName.map((name, index) => ({
                    name,
                    data: seriesData[index].length > 0 ? seriesData[index] : [{ x: 'No Data', y: 0 }]
                  }))}
                  type="area"
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NgxDynamic;