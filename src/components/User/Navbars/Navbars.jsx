import React, { useEffect, useRef, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons";
import farmer from "../usersimage/farmer.png";
import group from "../usersimage/group.png";
import clipboard from "../usersimage/ClipboardMinus.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Navbars.css";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import addgif from "../usersimage/Added.gif";
import deletesuccess from "../usersimage/deleteanimation.gif";
import CalendarComponent from "../CalendarComponent ";
import loadingprofile from "../usersimage/loading.gif";
import mqtt from "mqtt";
import { NavLink } from "react-router-dom";

const Navbars = ({
  handleToggle,
  useraccount,
  updateCoordinates,
  setdevice,
  update
}) => {
  const mobileno = localStorage.getItem("usermob");
  console.log(mobileno);
  //for showing logout popup on click of user logo on top navbar
  const [logout, setLogout] = useState(false);
  //Variable visible and hide of account button of sidenavbar
  const [accountvisible, setaccountvisible] = useState(false);
  //all details of user
  const [userdetails, setUserdetails] = useState([""]);
  // variable for visible and hide of analatic button of sidenavbar
  const [analyticvisible, setAnalyticVisible] = useState(false);
  // variable for  input field open and close of topnavbar
  const [showInput, setShowInput] = useState(false);
  //variable for delete-> lable choose show
  const [showdelete, setShowdelete] = useState(false);
  //DEVICE DETAILS STORE FOR NAVBAR
  const [devicedetails, setdevicedetails] = useState([]);
  //Label add animation
  const [addanimation, setAddanimation] = useState(false);
  // DELETE OPTION FOR LABELS
  const [deleteoption, setDeleteoption] = useState(false);
  const [deleteanimation, setDeleteAnimation] = useState(false);
  // Variable for temporary divice id  on each device click
  const [accid, setaccid] = useState();
  //TOTAL LABELS PRESENT TO A ACCOUNT
  const [devicelabels, setdevicelabels] = useState([]);
  // SET FOR TEMPORARY STORE ALL DEVICE LABELS
  const uniqueValues = new Set();
  //total device type
  const [devicetypes, setDevicetypes] = useState([]);
  const [deviceStates, setDeviceStates] = useState(() => {
    const storedDeviceStates = localStorage.getItem("deviceStates");
    return storedDeviceStates ? JSON.parse(storedDeviceStates) : {};
  });

  //logout
  const handleLogout = () => {
    localStorage.removeItem("usermob");
  };

  // Function to initialize device states
  const initializeDeviceStates = () => {
    // Check if deviceStates is already initialized
    if (Object.keys(deviceStates).length === 0) {
      const updatedDeviceStates = {};
      devicedetails.forEach((devicedata) => {
        const deviceId = devicedata[1];
        if (deviceStates[deviceId] === undefined) {
          updatedDeviceStates[deviceId] = {
            checked: false,
            virtualPin: devicedata[2],
          };
        } else {
          updatedDeviceStates[deviceId] = {
            ...deviceStates[deviceId],
            virtualPin: devicedata[2],
          };
        }
      });
      setDeviceStates(updatedDeviceStates);
      localStorage.setItem("deviceStates", JSON.stringify(updatedDeviceStates));
    }
  };

  // Initialize device states when component mounts
  useEffect(() => {
    initializeDeviceStates();
  }, []);
  const handleCheckboxChange = (deviceId, isChecked, virtualPin) => {
    const updatedDeviceStates = {
      ...deviceStates,
      [deviceId]: { checked: isChecked, virtualPin },
    };
    setDeviceStates(updatedDeviceStates);
    localStorage.setItem("deviceStates", JSON.stringify(updatedDeviceStates));
    const mqttClient = mqtt.connect({
      hostname: "4.240.114.7",
      port: 9001,
      protocol: "ws",
      username: "BarifloLabs",
      password: "Bfl@123",
    });
    const storedDeviceStates = localStorage.getItem("deviceStates");
    if (storedDeviceStates) {
    
      const statusSend = {
        display_id: parseInt(deviceId),
        virtual_pin: virtualPin,
        status: isChecked, // Assuming 'on' when checked, 'off' when unchecked
      };

      // Log or use statusSend object as needed
      // console.log(statusSend);
      const topic = deviceId.toString();
      const message = JSON.stringify(statusSend);
      console.log(message, topic);

      console.log(topic, message);

      mqttClient.publish(topic, message);
      console.log("message sendf ");

      // });
    }
  };

 
  useEffect(() => {}, [handleCheckboxChange]);

  //user detaikls calkl
  const userdatas = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_App_Ip}/userside_user_view/${mobileno}/`
      );
      console.log(response);
      setUserdetails(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  // temporary labelname
  const [templabel, setTemplebel] = useState("");
  //show calender variable
  const [calendershow, setCalendershow] = useState(false);
  const showcalender = () => {
    setCalendershow(!calendershow);
  };

  //variable for profile picture upload
  const [selectedImage, setSelectedImage] = useState("");
  const handleImageChange = () => {
    const file = photo.current.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const [profilepicaddmodal, setProfilepicaddmodal] = useState(false);

  const dpUpload = () => {
    setProfilepicaddmodal(!profilepicaddmodal);
  };

  const [profilepicaddanimation, setProfilepicaddanimation] = useState(false);

  const photo = useRef(null);

  const profileadd = async () => {
    if (!photo.current.files[0]) {
      alert("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("Mobno", mobileno);
    formData.append("user_pic", photo.current.files[0]);
    formData.append("user_docs", null);
    console.log(formData);

    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_App_Ip}/user_pic_docs/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response) {
        setProfilepicaddanimation(true);
        setTimeout(() => {
          setProfilepicaddanimation(false);
          fetchProfilepicture();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [profileImage, setProfileImage] = useState(farmer);

  const fetchProfilepicture = async () => {
    try {
      //add api here by  mobileno
      const response = await axios.get(
        `http://${process.env.REACT_APP_App_Ip}/imageview/${mobileno}/`
      );
      console.log(response);
      if (response.data.image)
        setProfileImage(
          `http://${process.env.REACT_APP_App_Ip}${response.data.image}/`
        );
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  //number of device types per user
  async function seedevicetype() {
    try {
      if (accid) {
        const response = await axios.get(
          `http://${process.env.REACT_APP_App_Ip}/userside_devicetype/${accid}/`
        );

        setDevicetypes(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!showInput) {
      seedevicetype();
    }
  }, [showInput]);

  const islogout = () => {
    setLogout(!logout);
  };

  //  delete  labels
  const deletedevicetype = useRef(null);

  const labeldelete = async () => {
    const deletedata = {
      Mobno: mobileno,
      device_type: deletedevicetype.current.value,
      param: templabel,
    };

    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_App_Ip}/param_delete/`,
        deletedata
      );
      console.log(response);
      if (response) {
        setDeleteAnimation(!deleteanimation);
        setTimeout(() => {
          setDeleteAnimation(false);
        }, 2500);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  //delete modal for delete
  const [labeltodelete, Setlabeltodelete] = useState(false);

  //Add labels to device
  const devicetype = useRef(null);
  const labelname = useRef(null);
  const labeladd = async () => {
    const newData = {
      Mobno: mobileno,
      device_type: devicetype.current.value,
      param: labelname.current.value,
    };

    try {
      const response = await axios.patch(
        `http://${process.env.REACT_APP_App_Ip}/param_update/`,
        newData
      );
      console.log("Response:", response);
      if (response) {
        setAddanimation(true);
        setTimeout(() => {
          setAddanimation(false);
        }, 2500);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // API CALL TO SEE HOW MANY DEVICE PRESENT IN A ACCOUNT
  async function devicefetch(Accid) {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_App_Ip}/userside_device_view/${Accid}/`
      );

      setdevice(response.data);
      setdevicedetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // BY THIS FUNCTION CORDEINATE AND ADDRESS UPDATE ON USERMAIN PAGE  AND USERMAIN PAGE PASS THAT TO CONTENT TO SHOW ON MAP
  const handleClickAccountDetails = (latitude, longitude, address) => {
    updateCoordinates(latitude, longitude, address);
  };

  // HOW MANY LABELS PRESENT IN A DEVICE
  async function devicelabelFetch(Accid) {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_App_Ip}/userside_graph_view/${Accid}/`
      );
      for (const key in response.data) {
        response.data[key].forEach((value) => uniqueValues.add(value));
      }
      const uniqueArray = Array.from(uniqueValues);
      setdevicelabels(uniqueArray); // Update state with unique labels
    } catch (error) {
      console.log(error);
    }
  }
  // WHEN PAGE OPEN FIRST TIME IT CALL FOR DEVICE FETCH AND LABEL FETCH OF FIRST ACCOUNT OF  user
  useEffect(() => {
    if (useraccount.items && useraccount.items.length > 0) {
      devicefetch(useraccount.items[0][1]);
      setaccid(useraccount.items[0][1]);
      // console.log(useraccount.items[0][1]);
      devicelabelFetch(useraccount.items[0][1]);
      fetchProfilepicture();
      userdatas();
    }
  }, [useraccount]);

  return (
    <>
      {/* Top Navbar start */}

      <div className=" shadow-lg topnavbar h-auto  ">
        <div className=" d-flex  justify-content-end align-items-center bg-white ">
          <Dropdown>
            <Dropdown.Toggle variant="transparent" style={{ border: "none" }}>
              <i
                className=" img1 fa-solid fa-chart-line fs-3"
                style={{ fontSize: 30 }}
              ></i>
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                width: "270px",
                marginTop: "20px",
              }}
            >
              <>
                {/* START Logic  for adding input by buttotn click field  */}
                <div className="d-flex gap-1 px-1 ">
                  <button
                    style={{
                      width: "70%",
                      borderRadius: "5px",
                      backgroundColor: "#7ee2b0",
                      fontSize: "15px",
                    }}
                    onClick={() => {
                      setShowInput(!showInput);
                      setDeleteoption(false);
                      seedevicetype();
                      setShowdelete(false);
                    }}
                  >
                    Add Labels
                  </button>
                  <button
                    style={{
                      width: "30%",
                      borderRadius: "5px",
                      padding: "5px 8px",
                      backgroundColor: "#FF0000",
                      fontSize: "15px",
                    }}
                    onClick={() => {
                      seedevicetype();
                      setDeleteoption(!deleteoption);
                      setShowdelete(!showdelete);
                      setShowInput(false);
                    }}
                  >
                    Delete
                  </button>
                </div>

                {showdelete && (
                  <Form.Select
                    style={{
                      marginTop: "8px",
                      marginLeft: "8px",
                      width: "93%",
                      height: "34px",
                    }}
                    ref={deletedevicetype}
                  >
                    <option>Select Your device .....</option>
                    {devicetypes.map((device, index) => (
                      <option key={index} value={device}>
                        {device}
                      </option>
                    ))}
                  </Form.Select>
                )}
                {showInput && (
                  <div style={{ zIndex: "10" }}>
                    <Form.Select
                      style={{
                        marginTop: "8px",
                        marginLeft: "8px",
                        width: "93%",
                        height: "34px",
                      }}
                      ref={devicetype}
                    >
                      <option>Select Your device .....</option>
                      {devicetypes.map((device, index) => (
                        <option key={index} value={device}>
                          {device}
                        </option>
                      ))}
                    </Form.Select>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        labeladd();
                        setShowInput(false);
                        setTimeout(() => {
                          devicelabelFetch(accid);
                        }, 1000);
                      }}
                    >
                      <div className="p-2 d-flex justify-content-between">
                        <input
                          type="text"
                          className="form-control"
                          id="inlineFormInput"
                          placeholder="Add Your Labels....."
                          style={{
                            width: "80%",
                            height: "34px",
                          }}
                          ref={labelname}
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity(
                              "Please Enter Your Label Name"
                            )
                          }
                          onChange={(e) => e.target.setCustomValidity("")}
                        />

                        <button
                          type="submit"
                          className="btn btn-success px-0 py-0 text-center"
                          style={{
                            textAlign: "center",
                            height: "34px",
                            width: "45px",
                          }}
                        >
                          <i
                            className="bi bi-plus fw-bold"
                            style={{
                              fontSize: "25px",
                              cursor: "pointer",
                              display: "contents",
                            }}
                          ></i>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {/* END Logic  for adding input field  */}

                <div className="d-flex flex-column justify-content-between p-2 py-0 pt-1">
                  {/* Toggle switches for metrics */}
                  {devicelabels.map((metric) => (
                    <div
                      key={metric}
                      className="d-flex justify-content-between p-2 py-0 pt-1"
                      style={{ height: "39px" }}
                    >
                      {/* Wrap the elements in data div */}
                      <p style={{ fontSize: "18px", fontWeight: "500" }}>
                        {metric}
                      </p>
                      {deleteoption ? (
                        <i
                          class="bi bi-trash"
                          style={{
                            fontSize: "20px",
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setTemplebel(metric);
                            Setlabeltodelete(!labeltodelete);
                          }}
                        ></i>
                      ) : (
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            style={{ fontSize: "20px" }}
                            onChange={(e) =>
                              handleToggle(metric, e.target.checked)
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="transparent" style={{ border: "none" }}>
              <i
                className="img1 bi bi-diagram-3-fill "
                style={{ fontSize: 30 }}
              ></i>
            </Dropdown.Toggle>

            <Dropdown.Menu
              style={{
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                width: "270px",
                marginTop: "10px",
              }}
            >
              {devicedetails.map((devicedata) => (
                <>
                  <div className="d-flex justify-content-between p-2">
                    <div>
                      <p className="mb-0">
                        <span style={{ fontWeight: 500 }}>ID:</span>{" "}
                        {devicedata[1]}
                      </p>
                      <p className="mb-0">
                        <span style={{ fontWeight: 500 }}>Dev_Name:</span>{" "}
                        {devicedata[0]}
                      </p>
                    </div>

                    <div
                      className=" form-check form-switch"
                      style={{ fontSize: "x-large" }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={
                          deviceStates[devicedata[1]]
                            ? deviceStates[devicedata[1]].checked
                            : false
                        }
                        onChange={(e) => {
                          handleCheckboxChange(
                            devicedata[1],
                            e.target.checked,
                            devicedata[3]
                          );
                          update();
                        }}
                      />
                    </div>
                  </div>
                  <hr className="my-0 text-secondary" />
                </>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <i
            className="img1 bi bi-brightness-high-fill m-3"
            style={{ fontSize: 30 }}
          ></i>

          <i
            className="img2 bi bi-calendar-week m-3"
            style={{ fontSize: 30 }}
            onClick={() => {
              showcalender();
            }}
          ></i>

          <i className="img3 bi bi-bell-fill m-3" style={{ fontSize: 30 }}></i>

          <i
            className="img4 bi bi-question-circle m-3 "
            style={{ fontSize: 30 }}
          ></i>

          <i
            className="img5 bi bi-box-arrow-right m-3 "
            style={{ fontSize: 30 }}
            onClick={islogout}
          ></i>
        </div>
      </div>

      {/* TopNavbar End */}

      {/* SideNavbar Start */}

      <div className="side d-flex  flex-column  ">
        <Dropdown drop="end">
          <Dropdown.Toggle
            variant="transparent"
            style={{ border: "none", height: "40px" }}
          >
            <img
              src={profileImage}
              alt="farmer"
              style={{
                backgroundColor: "white",
                width: "39px",
                marginTop: 20,
                borderRadius: "50%",
                padding: "2px",
                height: "45px",
                cursor: "pointer",
                display: "flex",
              }}
              //
            />
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropclass"
            style={{
              fontSize: "15px",
              fontWeight: "500",
              width: "200px",

              marginTop: "10px",
            }}
          >
            <div>
              <div className="d-flex flex-row justify-content-between p-2">
                <p>Name :</p>
                <p>{userdetails[0][2]}</p>
              </div>
              <div className="d-flex flex-row justify-content-between p-2">
                <p>Mob : </p>
                <p>{userdetails[0][0]}</p>
              </div>
              <div className="d-flex flex-row justify-content-between p-2">
                <p>E-Mail:</p>
                <p>{userdetails[0][1]}</p>
              </div>
              <div className="d-flex flex-row justify-content-between p-2">
                <p>Adhar-No.:</p>
                <p>{userdetails[0][3]}</p>
              </div>
              <div className="d-flex flex-row justify-content-between p-2">
                <p style={{ cursor: "pointer" }} onClick={dpUpload}>
                  Update Your Profile Photo HERE!{" "}
                </p>
              </div>
            </div>
          </Dropdown.Menu>
        </Dropdown>

        <div className="logos">
          <img
            className="sideimg"
            src={group}
            alt="group"
            style={{ padding: "7px", borderRadius: "4px" }}
          />

          <i
            className="sideimg bi  bi-person-lines-fill"
            onClick={() => {
              setaccountvisible(!accountvisible);
            }}
            style={{
              color: "white",
              fontSize: 30,
              padding: "5px",
              borderRadius: "4px",
              height: "45px",
            }}
          ></i>
          {accountvisible && (
            <>
              {useraccount &&
                useraccount.items &&
                useraccount.items.map((data) => {
                  return (
                    <Dropdown drop="end" key={data[1]}>
                      <Dropdown.Toggle
                        variant="transparent"
                        style={{ border: "none", height: "40px" }}
                      >
                        <i
                          className="sideimg bi bi-person-gear"
                          style={{
                            color: "white",
                            fontSize: 30,
                            padding: "5px",
                            borderRadius: "4px",
                            display: "flex",
                            height: "auto",
                          }}
                        ></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="dropclass"
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                          width: "200px",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          const newAccountid = data[1];
                          devicefetch(newAccountid);
                          handleClickAccountDetails(data[2], data[3], data[4]);
                          devicelabelFetch(newAccountid);
                          setaccid(data[1]);
                        }}
                      >
                        <div>
                          <div className="d-flex flex-row justify-content-between p-2">
                            <p>ID :</p>
                            <p>{data[1]}</p>
                          </div>
                          <div className="d-flex flex-row justify-content-between p-2">
                            <p>Name :</p>
                            <p>{data[0]}</p>
                          </div>
                          <div className="d-flex flex-row justify-content-between p-2">
                            <p>Address :</p>
                            <p>{data[4]}</p>
                          </div>
                          <div className="d-flex flex-row justify-content-between p-2 ">
                            <p>No Of Devices :</p>
                            <p>{data[5]}</p>
                          </div>
                          <div className="d-flex flex-row justify-content-between p-2">
                            <p>Opex :</p>
                            <p>{data.opex}</p>
                          </div>
                          <div className="d-flex flex-row justify-content-between p-2">
                            <p>Capex :</p>
                            <p>{data.capex}</p>
                          </div>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  );
                })}
            </>
          )}

          <i
            className=" sideimg bi bi-wallet "
            style={{
              color: "white",
              fontSize: 30,
              padding: "5px",
              borderRadius: "4px",
              height: "45px",
            }}
          ></i>
          <i
            className=" sideimg bi bi-cart4 "
            style={{
              color: "white",
              fontSize: 30,
              padding: "5px",
              borderRadius: "4px",
              height: "45px",
            }}
          ></i>
          <img
            className="sideimg"
            src={clipboard}
            alt="clipboard"
            style={{ padding: "7px", borderRadius: "4px", height: "45px" }}
            onClick={() => {
              setAnalyticVisible(!analyticvisible);
            }}
          />
          {analyticvisible && (
            <>
              <Dropdown drop="end">
                <Dropdown.Toggle
                  variant="transparent"
                  style={{ border: "none", height: "45px" }}
                >
                  <i
                    className=" sideimg bi bi-file-earmark-plus "
                    style={{
                      color: "white",
                      fontSize: 27,
                      padding: "5px",
                      borderRadius: "4px",
                      display: "flex",
                    }}
                  ></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropclass">
                  <Dropdown.Item
                    className="d-flex justify-content-between"
                    style={{ fontWeight: "500" }}
                  >
                    <i
                      className=" sideimg fa-solid fa-fish-fins"
                      style={{ alignSelf: "center" }}
                    ></i>
                    Fish/Shrimp{" "}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="d-flex justify-content-between"
                    style={{ fontWeight: "500" }}
                  >
                    <i
                      className="sideimg bi bi-droplet-half"
                      style={{ alignSelf: "center" }}
                    >
                      {" "}
                    </i>
                    Waterbody{" "}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <i
                className=" sideimg fa-solid fa-user-doctor "
                style={{
                  color: "white",
                  fontSize: 25,
                  padding: "5px",
                  borderRadius: "4px",
                  height: "37px",
                }}
              ></i>
              <i
                className=" sideimg bi bi-capsule-pill "
                style={{
                  color: "white",
                  fontSize: 25,
                  padding: "5px",
                  borderRadius: "4px",
                  height: "40px",
                }}
              ></i>
            </>
          )}
        </div>
      </div>

      {/* SideNavbar End */}

      {/* Logout Modal Start */}

      {logout ? (
        <div className="check-model ">
          <div
            className="model"
            style={{
              fontSize: "23px",
              width: "600px",
              height: "200px",
            }}
          >
            {/* Modal Heading */}
            <div
              className="heading d-flex justify-content-between  "
              style={{ backgroundColor: "#00216e" }}
            >
              <p
                style={{
                  marginTop: "8px",
                  marginLeft: "30px",
                  fontSize: 25,
                  color: "white",
                }}
              >
                Log OUT
              </p>
              <i
                class="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30 }}
                onClick={islogout}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginLeft: "20px", marginTop: "30px" }}>
              <div style={{ marginLeft: "25px" }}>
                <p> Are you sure About Logout !</p>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <NavLink to="http://localhost:4200/login">
                  <button
                    type="button"
                    className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "center",
                      marginRight: "15px",
                    }}
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Yes
                  </button>
                </NavLink>
                <button
                  type="button"
                  className="btn btn-warning px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={islogout}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* Logout Modal End */}

      {/* START ADD aNIMATION */}
      {addanimation ? (
        <div
          className="check-model"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>
            <img
              src={addgif}
              alt="successful"
              style={{ width: "200px", transform: "scale(2)" }}
            />
          </div>
        </div>
      ) : null}
      {/* END ADD aNIMATION */}

      {/* START Delete Label Modal  */}
      {labeltodelete ? (
        <div className="check-model ">
          <div
            className="model"
            style={{
              fontSize: "23px",
              width: "600px",
              height: "200px",
            }}
          >
            {/* Modal Heading */}
            <div
              className="heading d-flex justify-content-between  "
              style={{ backgroundColor: "#00216e" }}
            >
              <p
                style={{
                  marginTop: "8px",
                  marginLeft: "30px",
                  fontSize: 25,
                  color: "white",
                }}
              >
                DELETE Parameter
              </p>
              <i
                class="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30, color: "red" }}
                onClick={() => {
                  Setlabeltodelete(false);
                }}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginLeft: "20px", marginTop: "30px" }}>
              <div style={{ marginLeft: "25px" }}>
                <p> Hey ! Are you sure to Delete This Parameter ?</p>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    Setlabeltodelete(!labeltodelete);
                    labeldelete();
                    setTimeout(() => {
                      devicelabelFetch(accid);
                    }, 1000);
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-warning px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    Setlabeltodelete(!labeltodelete);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* DeleteButton Modal End */}

      {/* START dELETE aNIMATION */}
      {deleteanimation ? (
        <div
          className="check-model"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>
            <img
              src={deletesuccess}
              alt="successful"
              style={{ width: "200px", transform: "scale(3)" }}
            />
          </div>
        </div>
      ) : null}
      {/* END dELETE aNIMATION */}

      {/* START calender Modal  */}
      {calendershow ? (
        <div className="check-model ">
          <div
            className="model"
            style={{
              width: "850px",
              top: "10px",
              padding: "10px",
              marginTop: "20px",
            }}
          >
            {/* Modal Heading */}
            <div
              className="heading d-flex justify-content-between  "
              style={{ backgroundColor: "#00216e" }}
            >
              <p
                style={{
                  marginTop: "8px",
                  marginLeft: "30px",
                  fontSize: 25,
                  color: "white",
                }}
              >
                Calender
              </p>
              <i
                class="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30, color: "red" }}
                onClick={() => {
                  showcalender();
                }}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginTop: "30px" }}>
              <CalendarComponent />
            </div>
          </div>
        </div>
      ) : null}
      {/* calender Modal End */}

      {/* Start Profile picture Input Label Modal  */}
      {profilepicaddmodal ? (
        <div className="check-model ">
          <div
            className="model"
            style={{
              fontSize: "23px",
              width: "600px",
            }}
          >
            {/* Modal Heading */}
            <div
              className="heading d-flex justify-content-between  "
              style={{ backgroundColor: "#00216e" }}
            >
              <p
                style={{
                  marginTop: "8px",
                  marginLeft: "30px",
                  fontSize: 25,
                  color: "white",
                }}
              >
                Upload Your Best One
              </p>
              <i
                class="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30, color: "red" }}
                onClick={() => {
                  dpUpload();
                }}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginLeft: "20px", marginTop: "30px" }}>
              <div>
                <i
                  class="bi bi-person-bounding-box d-flex"
                  style={{ justifyContent: "center", fontSize: 90 }}
                ></i>
                <br />
                <input
                  ref={photo}
                  type="file"
                  onChange={handleImageChange}
                  accept=".jpg , .png"
                />

                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    style={{ maxWidth: "50%", margin: "5px 0 0 3px" }}
                  />
                )}
              </div>

              <div className="d-flex justify-content-end mt-3 p-2">
                <button
                  type="button"
                  className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    dpUpload();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    dpUpload();
                    profileadd();
                  }}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* End Profile picture Input Label Modal*/}

      {/* START profile pic Added aNIMATION */}
      {profilepicaddanimation ? (
        <div
          className="check-model"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>
            <img
              src={loadingprofile}
              alt="successful"
              className="transparent-background"
              style={{ width: "200px", transform: "scale(2)" }}
            />
          </div>
        </div>
      ) : null}
      {/* END profilepic upload aNIMATION */}
    </>
  );
};

export default Navbars;
