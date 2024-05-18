import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../Adminpage.css";
import { AdminContext } from "../../../App";
import axios from "axios";
import { logDOM } from "@testing-library/react";

const Devicetypecreate = () => {
  const [openModel, setOpenModel] = useState(false);
  const [deletebutton, setDeleteButton] = useState(false);
  const [devicetoadd, setDeviceToAdd] = useState(false);
  const [totaldevicetype, setTotaldevicetype] = useState(0);
  const [alldevice, setAlldevice] = useState([]);
  const [devicetypeerror, setDevicetypeerror] = useState("");

  //START creatye device type
  const devicename = useRef(null);
  const deviceversion = useRef(null);
  async function newdeviceadd(dataofnewdevice) {
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_App_Ip}/devicetype_create/`,
        dataofnewdevice
      );
    } catch (error) {
      console.log(error);
    }
  }
  //END creatye device type

  //START Edit Device type
  const [devicedata, setDevicedata] = useState("");
  const devicetypename = useRef(null);
  const devicetypeversion = useRef(null);

  async function editdevice(deviceinfo) {
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_App_Ip}/devicetype_edit/`,
        deviceinfo
      );
    } catch (error) {
      console.log(error);
    }
  }

  //END Edit Device type

  // START Delete DEVICE type

  async function deletedevicetype(devicedata) {
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_App_Ip}/devicetype_delete/`,
        devicedata
      );
    } catch (error) {
      console.log(error);
    }
  }

  // END Delete DEVICE type

  //context
  const { isSidebarOpen } = useContext(AdminContext);

  const openModels = () => {
    setOpenModel(!openModel);
  };
  const deviceadd = () => {
    setDeviceToAdd(!devicetoadd);
  };
  const openDeleteModels = () => {
    setDeleteButton(!deletebutton);
  };

  const Devicetype = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_App_Ip}/devicetype_view/`);
      setTotaldevicetype(response.data.results.length);
      setAlldevice(response.data.results);
    } catch (error) {
      setDevicetypeerror(error);
    }
  };

  useEffect(() => {
    Devicetype();
  }, []);

  return (
    <>
      {/* Page Start */}
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
              Device Types
            </p>
          </div>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "25px",
              padding: "10px",
              margin: "2px 2px 4px 2px",
            }}
          >
            {totaldevicetype}
          </p>
        </div>

        {/* Total User Count End */}

        {/* CreateDeviceType start */}
        <button
          type="button"
          className="btn btn-primary"
          style={{
            borderRadius: "16px",
            fontSize: "20px",
            verticalAlign: "cenetr",
            marginTop: "20px",
          }}
          onClick={deviceadd}
        >
          Create Device Type
        </button>

        {/* CreateDeviceType End */}

        {/* Table start */}

        <div className="parent-div-of-table ">
          <table className="table table-bordered table-striped table-hover table-design">
            <thead style={{ backgroundColor: "#7DE1AF" }}>
              <tr>
                <th
                  className=""
                  scope="col"
                  style={{
                    backgroundColor: "#7CDFAD",
                    borderTopLeftRadius: "7px",
                    textAlign: "center",
                  }}
                >
                  Sl.No
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#7CDFAD", textAlign: "center" }}
                >
                  Name
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#7CDFAD", textAlign: "center" }}
                >
                  Version
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#7CDFAD", textAlign: "center" }}
                >
                  Status
                </th>
                <th
                  scope="col"
                  style={{
                    backgroundColor: "#7CDFAD",
                    borderTopRightRadius: "7px",
                    textAlign: "center",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {alldevice.map((data, index) => (
                <tr key={index + 1}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{data[0]}</td>
                  <td className="text-center">{data[1]}</td>
                  <td className="text-center">enabled</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-warning"
                      style={{
                        borderRadius: "16px",
                        fontSize: "20px",
                        verticalAlign: "cenetr",
                      }}
                      onClick={() => {
                        const thisdevicedata = {
                          devicename: data[0],
                          deviceversion: data[1],
                        };
                        openModels();

                        setDevicedata(thisdevicedata);
                      }}
                    >
                      Edit
                    </button>

                    <Link
                      to={`/admin/devicetypecreate/deviceassignctrls/${data[0]}/${data[1]}`}
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          borderRadius: "16px",
                          fontSize: "20px",
                          verticalAlign: "cenetr",
                          marginLeft: "8px",
                        }}
                      >
                        View
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{
                        borderRadius: "16px",
                        fontSize: "20px",
                        verticalAlign: "cenetr",
                        marginLeft: "8px",
                      }}
                      onClick={() => {
                        const thisdevicedata = {
                          devicename: data[0],
                          deviceversion: data[1],
                        };
                        openDeleteModels();

                        setDevicedata(thisdevicedata);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table End */}

        {/* Redirect Start */}
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
          >
            Previous
          </button>{" "}
          <p style={{ marginTop: "09px" }}>Page 1 of 1 </p>
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
          >
            Next
          </button>
        </div>
        {/* Redirect End */}
      </div>
      {/* Page End */}

      {/* Modal Start */}

      {openModel ? (
        <div className="check-model ">
          <div
            className="model"
            style={{ fontSize: "23px", width: "600px", height: "370px" }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginTop: "8px", marginLeft: "30px", fontSize: 25 }}>
                Device Type
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30 }}
                onClick={openModels}
              ></i>
            </div>
            {/* Modal Content */}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const devicedatas = {
                  olddevicetypename: devicedata.devicename,
                  olddevicetypeversion: devicedata.deviceversion,
                  newtypeversion: devicetypeversion.current.value,
                  newtypename: devicetypename.current.value,
                };

                editdevice(devicedatas);
                openModels();
                setTimeout(() => {
                  Devicetype();
                }, 500);
              }}
            >
              <div style={{ marginLeft: "20px", marginTop: "30px" }}>
                <div style={{ marginLeft: "25px" }}>
                  <label htmlFor="formGroupExampleInput">Name</label>
                  <input
                    type="text"
                    ref={devicetypename}
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter Account Name"
                    style={{ width: "400px" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Please Enter Device Type Name"
                      )
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  ></input>

                  <label htmlFor="formGroupExampleInput">Version</label>
                  <input
                    type="text"
                    ref={devicetypeversion}
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter Account Name"
                    style={{ width: "400px" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Please Enter Version")
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  ></input>

                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="defaultCheck1"
                    style={{ fontSize: "20px", marginTop: "20px" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="defaultCheck1"
                    style={{
                      fontSize: "20px",
                      marginLeft: "10px",
                      marginTop: "14px",
                    }}
                  >
                    Enable
                  </label>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="submit"
                    className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "cenetr",
                      marginRight: "15px",
                    }}
                  >
                    Update Device
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal End */}

      {/* Add device modal start */}
      {devicetoadd ? (
        <div className="check-model ">
          <div
            className="model"
            style={{ fontSize: "23px", width: "600px", height: "370px" }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginTop: "8px", marginLeft: "30px", fontSize: 25 }}>
                Device Type
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30 }}
                onClick={deviceadd}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginLeft: "20px", marginTop: "30px" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newdevicedata = {
                    typeversion: deviceversion.current.value,
                    typename: devicename.current.value,
                  };

                  newdeviceadd(newdevicedata);
                  deviceadd();
                  setTimeout(() => {
                    Devicetype();
                  }, 1000);
                }}
              >
                <div style={{ marginLeft: "25px" }}>
                  <label htmlFor="formGroupExampleInput">Name</label>
                  <input
                    ref={devicename}
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter Account Name"
                    style={{ width: "400px" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Please Enter Device Type Name"
                      )
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  ></input>

                  <label htmlFor="formGroupExampleInput">Version</label>
                  <input
                    ref={deviceversion}
                    type="number"
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter Account Name"
                    style={{ width: "400px" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Please Enter Version")
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  ></input>

                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="defaultCheck1"
                    style={{ fontSize: "20px", marginTop: "20px" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="defaultCheck1"
                    style={{
                      fontSize: "20px",
                      marginLeft: "10px",
                      marginTop: "14px",
                    }}
                  >
                    Enable
                  </label>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="submit"
                    className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "cenetr",
                      marginRight: "15px",
                    }}
                  >
                    Create Device
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {/* Add device Modal End */}

      {/* Delete button Modal Start */}

      {deletebutton ? (
        <div className="check-model ">
          <div
            className="model"
            style={{ fontSize: "23px", width: "600px", height: "200px" }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginTop: "8px", marginLeft: "30px", fontSize: 25 }}>
                Delete Account
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30 }}
                onClick={openDeleteModels}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginLeft: "20px", marginTop: "30px" }}>
              <div style={{ marginLeft: "25px" }}>
                <p> Are you sure to Delete the deivce-type Permanently ?</p>
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
                    const devicedatafordelete = {
                      devicetypename: devicedata.devicename,
                      devicetypeversion: devicedata.deviceversion,
                    };
                    deletedevicetype(devicedatafordelete);
                    openDeleteModels();
                    setTimeout(() => {
                      Devicetype();
                    }, 500);
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
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* DeleteButton Modal End */}
    </>
  );
};

export default Devicetypecreate;