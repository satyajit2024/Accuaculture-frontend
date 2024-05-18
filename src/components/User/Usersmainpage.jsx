import Content from "./Content/Content";
import Navbars from "./Navbars/Navbars";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Usersmainpage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mobno = urlParams.get("mobno");
  localStorage.setItem("usermob", mobno);

  const [toggleStates, setToggleStates] = useState({
    Current: false,
    Voltage: false,
    pH: false,
    ORP: false,
    DO: false,
    TDS: false,
    // Add more metrics as needed
  });

  const handleToggle = (metric) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [metric]: !prevState[metric],
    }));
  };

  const[localupdate,setLocalupdate]=useState(false);
  const update=()=>{
    setLocalupdate(!localupdate);
    console.log("hiitsclick");
  }

  //update lat lng  and for user accounts
  const [oneaccountdetails, setOneAccountDetails] = useState({
    latitude: "",
    longitude: "",
    Address: "",
  });

  const updateCoordinates = (lat, lng, address) => {
    
    setOneAccountDetails({
      latitude: lat,
      longitude: lng,
      Address: address,
    });
  };
  //  API call For Accounts Of User

  const [useraccount, SetUseraccount] = useState({ items: [] });

  const accountFetch = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_App_Ip}/account_view/${mobno}/`
      );
      console.log(response);
      SetUseraccount(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    accountFetch();
  }, []);

  useEffect(() => {
    if (useraccount.items && useraccount.items.length > 0) {
      setOneAccountDetails({
        latitude: useraccount.items[0][2],
        longitude: useraccount.items[0][3],
        Address: useraccount.items[0][4],
      });
    }
  }, [useraccount]);
  // vcariable for devices to pass content page
  const [devicesofaUser, setdevicesofaUser] = useState([]);

  const setdevice = (deviceArray) => {
    setdevicesofaUser(deviceArray);
  };
  useEffect(() => {
    setdevice([]);
  }, []);

  useEffect(() => {
    if (devicesofaUser && devicesofaUser.length > 0) {
      console.log(devicesofaUser);
    }
  }, [devicesofaUser]);

 
  return (
    <>
      <Navbars
        handleToggle={handleToggle}
        useraccount={useraccount}
        updateCoordinates={updateCoordinates}
        setdevice={setdevice}
        update={update}
      />
      <Content
        toggleStates={toggleStates}
        oneaccountdata={oneaccountdetails}
        devicesofaUser={devicesofaUser}
        localupdate={localupdate}
      />
    </>
  );
};

export default Usersmainpage;

