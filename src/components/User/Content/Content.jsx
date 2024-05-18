import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap-icons/font/bootstrap-icons";
import "./Content.css";
import tempretureimg from "../usersimage/humidity.png";
import drop from "../usersimage/drop (2).png";
import wind from "../usersimage/windspeed.png";
import mappin from "../usersimage/map-pin.png";
import Chartbox from "../Chartbox";
import mqtt from "mqtt";
import GoogleMapComponent from "../../Mapview";

const Content = ({ toggleStates, oneaccountdata, devicesofaUser ,localupdate}) => {
  const [wdata, setWdata] = useState(null);

  const [chartData, setChartData] = useState([]);

 

  useEffect(() => {
    const mqttClient = mqtt.connect({
      hostname: "4.240.114.7",
      port: 9001,
      protocol: "ws",
      username: "BarifloLabs",
      password: "Bfl@123",
    });

    // setClient(mqttClient);

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      // mqttClient.subscribe(`${542484815423712}/data`);
      // mqttClient.subscribe(`${578689832956829}/data`);
      // mqttClient.subscribe(`${372582595849208}/data`);
      devicesofaUser.forEach((device) => {
        const deviceId = device[1];
        console.log(deviceId);
        mqttClient.subscribe(`${deviceId}/data`);
      });
    });

    mqttClient.on("message", (topic, payload) => {
      const data = JSON.parse(payload.toString());
      // console.log(data);
      setChartData(data);
      // console.log(chartData);
    });

    

    return () => {
      if (mqttClient) {
        mqttClient.end();
        console.log("Disconnected from MQTT broker");
      }
    };
  }, [devicesofaUser]);


  let centerr = {
    lat: oneaccountdata.latitude,
    lng: oneaccountdata.longitude,
    address: oneaccountdata.Address,
  };

  useEffect(() => {
    const weatherData = async ({ lat, lng }) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&exclude={part}&appid=5de227dcd9d14b80bb39771618ef96d5`
        );
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setWdata(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    weatherData({ lat: centerr ?.lat, lng: centerr?.lng });
  }, [centerr.lat, centerr.lng]);
useEffect(()=>{
  console.log("hi");
},[oneaccountdata]);
  return (
    <>
      <div className="contain p-3">
        <div className="mapbox shadow">
          {/* <GoogleMapdata containerStyle={containerStyle} lat={center.lat} lng={center.lng} address={center.address} devices={devicesofaUser} /> */}
          <GoogleMapComponent
            devicesNamesList={devicesofaUser}
            latitude={centerr.lat} longitude={centerr.lng} address={centerr ?.address}
            localupdate={localupdate}
          />
        </div>
        <div
          className="weatherbox shadow"
          style={{ padding: "5px", width: "350px" }}
        >
          {wdata ? (
            <div className="weatherdata">
              <div
                className="d-flex"
                style={{ justifyContent: "space-between" }}
              >
                <div>
                  <p className="tempheading">Temperature </p>
                  <p className="data">
                    {(wdata.main.temp - 273.0).toFixed(2)}℃
                  </p>
                </div>
                <div>
                  <img
                    className="tempretureimg"
                    src={tempretureimg}
                    alt="temperetureicon"
                  />
                </div>
              </div>
              <div
                className="d-flex"
                style={{ justifyContent: "space-between" }}
              >
                <div>
                  <p className="tempheading">Humidity </p>
                  <p className="data">{wdata.main.humidity} %</p>
                </div>
                <div>
                  <img className="humidityimg" src={drop} alt="humidityimg" />
                </div>
              </div>
              <div
                className="d-flex"
                style={{ justifyContent: "space-between" }}
              >
                <div>
                  <p className="tempheading">WindSpeed </p>
                  <p className="data">{wdata.wind.speed.toFixed(2)}Km/Hr</p>
                </div>
                <div>
                  <img className="windspeedimg" src={wind} alt="windspeedimg" />
                </div>
              </div>
              <div
                className="d-flex"
                style={{ justifyContent: "space-between" }}
              >
                <div>
                  <p className="tempheading">Location </p>
                  <p className="data">{wdata.name}</p>
                </div>
                <div>
                  <img
                    className="windspeedimg"
                    src={mappin}
                    alt="windspeedimg"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p>Loading Weatherdata.........</p>
          )}
        </div>
      </div>
      <div className="chartcontainer">
        <div  style={{ padding: "8px",width:'100%',display:'flex',flexWrap:'wrap'}}>
          {Object.keys(toggleStates).map(
            (metric) =>
              toggleStates[metric] && (
                <Chartbox key={metric} metric={metric} data={chartData} />
              )
          )}
        </div>
      </div>
    </>
  );
};

export default Content;
