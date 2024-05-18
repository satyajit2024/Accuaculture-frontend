import React, { useContext, useEffect, useRef, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import latitude from "./Constant img/latitude.png";
import longitude from "./Constant img/longitude.png";
import "./Adminpage.css";
import { GoogleMap, Marker } from "@react-google-maps/api";

import success from "./Constant img/success.gif";
import { AdminContext } from "../../App";
import axios from "axios";

const Usernotification = () => {
  const admin_id = localStorage.getItem("admin_id");

  const [openModel, setOpenModel] = useState(false);
  const [nextmodel, setNextModel] = useState(false);
  const [devicetype, setDeviceType] = useState(false);
  const [deviceadd, setDeviceAdd] = useState(false);
  const [showmap, setShowmap] = useState(false);
  const [completedeviceadd, setCompliteDeviceAdd] = useState(false);

  //context
  const { isSidebarOpen } = useContext(AdminContext);
  const [totaluser, setTotalUser] = useState(0);
  const [regestereduser, setRegestereduser] = useState([]);
  const [usernotificationerror, setUserNotificationerror] = useState("");
  const [userindex, setUserindex] = useState("");
  const [address, setAddress] = useState("");
  const [latitudes, setLatitude] = useState(20.2961); // Initial latitude FOR ADD USER
  const [longitudes, setLongitude] = useState(85.8245); // Initial longitude FOR ADD USER
  const [latitudesdevice, setlatitudesdevice] = useState(20.2961); // Initial latitude FOR ADD USER
  const [longitudesdevice, setlongitudesdevice] = useState(85.8245); // Initial longitude FOR ADD USER

  // variable for next and previous button
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);


  const GoogleMapdata = ({ containerStyle, latis, lngis }) => {
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: parseFloat(latis), lng: parseFloat(lngis) }}
        zoom={15}
        mapTypeId="satellite"
        onLoad={(map) => {
          new window.google.maps.Marker({
            position: { lat: parseFloat(latis), lng: parseFloat(lngis) },
            map: map,
            
          });
        }}
      />
    );
    
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = regestereduser.slice(indexOfFirstItem, indexOfLastItem);

  const [data, setData] = useState({
    userpic: null,
    userdocs: null,
    sensors: null,
  });

  // all variable fkor account create of a user
  const Password = useRef(null);
  const passwordenterrd = () => {
    setData({ ...data, password: Password.current.value });
  };

  const userLatitude = useRef(null);
  const userLongitude = useRef(null);
  const AccName = useRef(null);

  const latlngaccentered = () => {
    setData({
      ...data,
      mobno: regestereduser[userindex][1],
      address: address,
      account_nm: AccName.current.value,
      lat: parseFloat(userLatitude.current.value),
      long: parseFloat(userLongitude.current.value),
    });
  };

  //  varible for add device for a user
  const cityname = useRef(null);
  const handleSearch = async () => {
    const city = cityname.current.value;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyC-d-7RR_MQ45QLQXKSzOxviR2l11kN3wk`
      );
      const data = await response.json();
      const { lat, lng } = data.results[0].geometry.location;
      setlatitudesdevice(lat);
      setlongitudesdevice(lng);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const [devicecordinate, setdevicecordinate] = useState("");

  const handleMapClick = (e) => {
    const clickedLat = e.latLng.lat();
    const clickedLng = e.latLng.lng();
    const coordinates = `${clickedLat},${clickedLng}`;
    setdevicecordinate(coordinates);
  };

  const devicename = useRef(null);
  const device = useRef(null);
  const devicelocation = useRef(null);

  const devinametypelocentered = () => {
    setData({
      ...data,
      devicename: devicename.current.value,
      devicetype: device.current.value,
      location_data: devicelocation.current.value
        .split(",")
        .map((value) => parseFloat(value.trim())),
    });
  };

  const addNweUser = async () => {
    try {
      console.log(data);
      const response = await axios.post(
        `http://${process.env.REACT_APP_App_Ip}/user_create/`,
        data
      );
      console.log(response);
      if (response) {
        setCompliteDeviceAdd(!completedeviceadd);
        setTimeout(() => {
          setCompliteDeviceAdd(false);
        }, 1000);
        const res = await axios.get(
          `http://${process.env.REACT_APP_App_Ip}/email_send/${data.mobno}/`
        );
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
    console.log(data);
  };

  const userNotificationfetch = async () => {
    try {
      const responce = await axios.get(
        `http://${process.env.REACT_APP_App_Ip}/register_view/${admin_id}/`
      );
      setTotalUser(responce.data.items.length);
      setRegestereduser(responce.data.items);

      console.log(responce.data.items);
    } catch (error) {
      console.log(error);
      setUserNotificationerror(error);
    }
  };

  useEffect(() => {
    userNotificationfetch();
  }, []);

  const openModels = () => {
    setOpenModel(!openModel);
  };

  const opennextmodel = () => {
    setNextModel(!nextmodel);
  };

  const opendevicetypemodel = () => {
    setDeviceType(!devicetype);
  };
  const adddevice = () => {
    setDeviceAdd(!deviceadd);
  };
  const mapshow = () => {
    setShowmap(!showmap);
  };

  const [devicetypes, setDevicetypes] = useState([]);

  async function seedevicetype() {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_App_Ip}/devicetype_view/`
      );
      setDevicetypes(response.data.results);
    } catch (error) {
      console.log(error);
    }
  }

  //Here Content can take lat and lng props from backend

  function searchlatlng(lats, lngs) {
    setLatitude(
      lats === null || lats === undefined || lats === ""
        ? parseFloat(20.2961)
        : lats
    );
    setLongitude(
      lngs === null || lngs === undefined || lngs === ""
        ? parseFloat(85.8245)
        : lngs
    );
  }

  //Height and Width for Google Map
  const containerStyleforaccontadd = {
    width: "900px",
    height: "100%",
  };
  const containerStylefordeviceadd = {
    width: "610px",
    height: "100%",
  };

  useEffect(() => {
    const geocoder = new window.google.maps.Geocoder();
    const location = {
      lat: parseFloat(latitudes),
      lng: parseFloat(longitudes),
    };

    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          console.log(results[0].formatted_address);
          setAddress(results[0].formatted_address);
        } else {
          setAddress("Address not found");
        }
      } else {
        setAddress("Geocoder failed due to: " + status);
      }
    });
  }, [latitudes, longitudes]);

  return (
    <>
      <div
        style={{
          marginLeft: isSidebarOpen ? "280px" : "110px",
          marginTop: "7px",
        }}
      >
        {/* Total User Count Start */}
        <div className="userCount shadow">
          <div>
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "25px",
                padding: "10px",
                margin: "2px 2px 4px 2px",
                backgroundColor: "#7DE0AE",
                borderRadius: "20px",
              }}
            >
              Total User Requested
            </p>
          </div>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "30px",
              padding: "10px",
              fontWeight: "bold",
              margin: "2px 2px 4px 2px",
            }}
          >
            {totaluser}
          </p>
        </div>

        {/* Total User Count End */}

        {/* Table start */}

        <div className="parent-div-of-table">
          <table className="table table-bordered table-striped table-hover table-design">
            <thead style={{ backgroundColor: "#7DE1AF" }}>
              <tr>
                <th
                  className="text-center"
                  scope="col"
                  style={{
                    backgroundColor: "#7CDFAD",
                    borderTopLeftRadius: "7px",
                  }}
                >
                  Sl.No
                </th>
                <th
                  className="text-center"
                  scope="col"
                  style={{ backgroundColor: "#7CDFAD" }}
                >
                  Name
                </th>
                <th
                  className="text-center"
                  scope="col"
                  style={{ backgroundColor: "#7CDFAD" }}
                >
                  Mobile No
                </th>
                <th
                  className="text-center"
                  scope="col"
                  style={{ backgroundColor: "#7CDFAD" }}
                >
                  E-mail Id
                </th>
                <th
                  className="text-center"
                  scope="col"
                  style={{
                    backgroundColor: "#7CDFAD",
                    borderTopRightRadius: "7px",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((data, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{data[0]}</td>
                  <td className="text-center">{data[1]}</td>
                  <td className="text-center">{data[2]}</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                      style={{
                        textAlign: "cenetr",
                      }}
                      onClick={() => {
                        setUserindex(index);
                        openModels();
                      }}
                    >
                      Check
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table End */}
        {/* Error Handel  Message*/}
        {usernotificationerror ? (
          <>
            {" "}
            <div>
              <p
                style={{
                  fontSize: "25px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                Some Error Occured , Please Stay Tuned !
              </p>
            </div>
          </>
        ) : (
          <></>
        )}
        {/* Error Handel Message END */}

        {/* Rdirect Start */}
        <div className="redirects">
          <button
            type="button"
            className="btn "
            style={{
              borderRadius: "16px",
              fontSize: "17px",
              verticalAlign: "cenetr",
              marginRight: "10px",
              height: "43px",
              backgroundColor: "#5F9EFB",
              color: "white",
            }}
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            Previous
          </button>{" "}
          <p style={{ marginTop: "09px" }}>
            Page {currentPage} of{" "}
            {Math.ceil(regestereduser.length / itemsPerPage)}{" "}
          </p>
          <button
            type="button"
            className="btn btn-success"
            style={{
              borderRadius: "19px",
              fontSize: "17px",
              verticalAlign: "cenetr",
              height: "43px",
              marginLeft: "4px",
            }}
            disabled={indexOfLastItem >= regestereduser.length}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
        {/* Redirect End */}
      </div>

      {/* regestereduser[userindex] */}
      {/* model Start */}
      {openModel ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            openModels();
            opennextmodel();
            passwordenterrd();
          }}
        >
          <div className="check-model ">
            <div
              className="model"
              style={{ fontSize: "23px", marginTop: "10%", width: "600px" }}
            >
              <div className="heading d-flex justify-content-between ">
                <p
                  style={{
                    marginTop: "10px",
                    marginLeft: "30px",
                    fontSize: 25,
                  }}
                >
                  New User Details
                </p>
                <i
                  className="bi bi-x-octagon cancel-button-modal "
                  style={{ fontSize: 30 }}
                  onClick={openModels}
                ></i>
              </div>
              <div style={{ marginLeft: "20px", marginTop: "30px" }}>
                <div className="name d-flex">
                  <p>Name </p>
                  <p style={{ marginLeft: "25px" }}>
                    : {regestereduser[userindex][0]}
                  </p>
                </div>
                <div className="mobile d-flex">
                  <p>Mobile No </p>{" "}
                  <p style={{ marginLeft: "25px" }}>
                    :{regestereduser[userindex][1]}
                  </p>
                </div>
                <div className="adhar d-flex">
                  <p>Aadhaar No</p>
                  <p style={{ marginLeft: "25px" }}>
                    :{regestereduser[userindex][4]}
                  </p>
                </div>
                <div className="email d-flex">
                  <p>Email Id</p>{" "}
                  <p style={{ marginLeft: "25px" }}>
                    : {regestereduser[userindex][2]}
                  </p>
                </div>
                <div className="password ">
                  <p>
                    <div className="form-group d-flex">
                      <label for="exampleInputPassword1">Password</label>
                      <input
                        ref={Password}
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Password"
                        style={{ marginLeft: "25px", width: "400px" }}
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity(
                            "Please Enter Your Password For User"
                          )
                        }
                        onChange={(e) => e.target.setCustomValidity("")}
                      />
                    </div>
                  </p>
                </div>

                <div className="d-flex justify-content-end mt-5 p-2">
                  <button
                    type="submit"
                    className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "center",
                      marginRight: "15px",
                    }}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "cenetr",
                      marginRight: "25px",
                    }}
                    onClick={openModels}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : null}

      {/* Model Close */}

      {/* start model for on click of next of previos model */}
      {nextmodel ? (
        <div className="check-model ">
          <div
            className="model"
            style={{ fontSize: "23px", marginTop: "1px", height: "auto" }}
          >
            <div className="heading d-flex justify-content-between ">
              <p
                style={{ marginTop: "10px", marginLeft: "30px", fontSize: 25 }}
              >
                New User Details
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30 }}
                onClick={opennextmodel}
              ></i>
            </div>
            <div style={{ marginLeft: "20px", marginTop: "30px" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  searchlatlng(
                    userLatitude.current.value,
                    userLongitude.current.value
                  );
                }}
              >
                <div className="d-flex" style={{ height: "49px" }}>
                  <label for="formGroupExampleInput" style={{ width: "250px" }}>
                    {" "}
                    <img
                      src={latitude}
                      style={{ width: "20px", marginBottom: "5px" }}
                      alt="Latitude logo"
                    ></img>{" "}
                    Latitude
                  </label>
                  <label for="formGroupExampleInput" style={{ width: "250px" }}>
                    <img
                      src={longitude}
                      style={{
                        width: "20px",
                        marginBottom: "5px",
                        marginRight: "2px",
                      }}
                      alt="Longitude logo"
                    ></img>
                    Longitude
                  </label>

                  <label for="formGroupExampleInput" style={{ width: "250px" }}>
                    <i
                      className="bi bi-person-vcard"
                      style={{ fontSize: "20px", marginRight: "2px" }}
                    ></i>
                    Account Name
                  </label>
                </div>

                <div className="d-flex">
                  <input
                    ref={userLatitude}
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter Latitude"
                    style={{ width: "200px" }}
                  ></input>

                  <input
                    ref={userLongitude}
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter Longitude"
                    style={{ width: "200px", marginLeft: "50px" }}
                  ></input>

                  <input
                    ref={AccName}
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter AccountName"
                    style={{ width: "200px", marginLeft: "50px" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Please Enter Account Name")
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  ></input>

                  <button
                    type="submit"
                    className="btn btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "center",
                      marginLeft: "50px",
                    }}
                  >
                    <i
                      className="bi bi-search"
                      style={{ marginRight: "3px" }}
                    ></i>
                    Search
                  </button>
                </div>
              </form>

              <div style={{ marginTop: "20px", height: "400px" }}>
                <GoogleMapdata
                  containerStyle={containerStyleforaccontadd}
                  latis={latitudes}
                  lngis={longitudes}
                />
              </div>

              <div
                className="d-flex justify-content-end mt-2 "
                style={{ padding: "5px" }}
              >
                <button
                  type="button"
                  className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    latlngaccentered();

                    latlngaccentered();

                    opennextmodel();
                    opendevicetypemodel();
                  }}
                >
                  Next
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "25px",
                  }}
                  onClick={opennextmodel}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* End model for on click of "next" of previos model */}

      {/* start Modal  on click of "next" of previos modal */}

      {devicetype ? (
        <div className="check-model ">
          <div
            className="model"
            style={{
              fontSize: "23px",
              marginTop: "1px",
              width: "650px",
              height: "auto",
            }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginTop: "8px", marginLeft: "30px", fontSize: 25 }}>
                New User Device
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30 }}
                onClick={opendevicetypemodel}
              ></i>
            </div>
            {/* Modal Content */}
            <div
              style={{
                marginLeft: "20px",
                marginTop: "30px",
                marginRight: "10px",
              }}
            >
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Device Type</th>
                    <th scope="col">No. of Device</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {regestereduser[userindex][3].devicesList &&
                      regestereduser[userindex][3].devicesList[0] && (
                        <>
                          <td>
                            {regestereduser[userindex][3].devicesList[0].value}
                          </td>
                          <td>
                            {regestereduser[userindex][3].devicesList[0].count}
                          </td>
                        </>
                      )}
                  </tr>
                </tbody>
              </table>
              <button
                type="button"
                className="btn btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                style={{
                  textAlign: "cenetr",
                  marginRight: "15px",
                }}
                onClick={() => {
                  adddevice();
                  seedevicetype();
                }}
              >
                Add Device
              </button>

              <div className="d-flex justify-content-end ">
                <button
                  type="button"
                  className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                    margin: "10px 15px 10px 0",
                  }}
                  onClick={() => {
                    addNweUser();
                    opendevicetypemodel();
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* End Modal  on click of "next" of previos modal */}

      {/* start Modal  on click of "Add Device" of previos modal */}

      {deviceadd ? (
        <div className="check-model ">
          <div
            className="model"
            style={{
              fontSize: "20px",
              marginTop: "1px",
              width: "650px",
              height: "auto",
            }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginLeft: "30px", fontSize: 25 }}>Device Add</p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30 }}
                onClick={adddevice}
              ></i>
            </div>
            {/* Modal Content */}
            <div
              style={{
                marginLeft: "20px",
                marginTop: "30px",
                marginRight: "10px",
              }}
            >
              <label for="formGroupExampleInput">Device Name</label>
              <input
                ref={devicename}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                placeholder="Device Name"
                style={{ width: "400px" }}
              ></input>

              <div className="d-flex mt-2">
                <label for="formGroupExampleInput" style={{ width: "250px" }}>
                  Device Type
                </label>
                <label for="formGroupExampleInput">Device Location</label>
              </div>

              <div className="d-flex">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  style={{ width: "200px" }}
                  ref={device}
                >
                  <option selected>select Device Type</option>
                  {devicetypes.map((device, index) => (
                    <option key={index} value={device[0]}>
                      {device[0]}
                    </option>
                  ))}
                </select>

                <input
                  value={devicecordinate}
                  type="text"
                  className="form-control"
                  placeholder="Device Location...."
                  style={{ width: "200px", marginLeft: "50px" }}
                  ref={devicelocation}
                ></input>
              </div>

              <button
                type="button"
                className="btn btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                style={{
                  textAlign: "cenetr",
                  marginRight: "15px",
                }}
                onClick={mapshow}
              >
                Add Device Location
              </button>
              <button
                type="button"
                className="btn  btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                style={{
                  textAlign: "cenetr",
                  marginRight: "15px",
                  margin: "10px 15px 10px 0",
                }}
                onClick={() => {
                  adddevice();
                  devinametypelocentered();
                }}
              >
                Add Device
              </button>

              {showmap ? (
                <>
                  <div className="d-flex">
                    <input
                      ref={cityname}
                      className="form-control mr-sm-2"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      style={{ width: "200px" }}
                    />
                    <button
                      className="btn btn-outline-success my-2 my-sm-0"
                      type="submit"
                      style={{ marginLeft: "10px" }}
                      onClick={() => {
                        handleSearch();
                      }}
                    >
                      Search
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: "1px",
                      height: "400px",
                      width: "200px",
                    }}
                  >
                    <GoogleMap
                      mapContainerStyle={containerStylefordeviceadd}
                      center={{ lat: latitudesdevice, lng: longitudesdevice }}
                      zoom={10}
                      mapTypeId="satellite"
                      onClick={handleMapClick}
                    >
                      <Marker
                        position={{
                          lat: parseFloat(latitudesdevice),
                          lng: parseFloat(longitudesdevice),
                        }}
                      />
                    </GoogleMap>
                  </div>
                </>
              ) : null}
            </div>

            {/* Modal Content End */}
          </div>
        </div>
      ) : null}
      {/* End Modal  on click of "Add Device" of previos modal */}

      {/* device complete add Modal Start */}

      {completedeviceadd ? (
        <div className="check-model ">
          <div
            className="model"
            style={{ fontSize: "23px", width: "600px", height: "300px" }}
          >
            <img
              src={success}
              alt="successful"
              style={{ width: "200px", marginLeft: "30%" }}
            />
            <p style={{ marginLeft: "25%" }}>Device Added Successfully</p>
          </div>
        </div>
      ) : null}
      {/*device complete add Modal End */}
    </>
  );
};

export default Usernotification;


