import React, { useContext, useState} from "react";
import "bootstrap-icons/font/bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import { NavLink} from "react-router-dom";
import companylogo from "./companylogo.png";
import "./SideBar.css";
import { AdminContext } from "../../../App";

const Sidebar = () => {
  //for showing logout popup on click of user logo on top navbar
  const [logouttext, setLogouttext] = useState(false);
  const [logout, setLogout] = useState(false);

  //for on and  off of sidebar if sidebar is open show icon with corresponding name if  close only show icon
  const [sidebartoggle, setSidebarToggle] = useState(false);

  // from context api for expand and collapse of content according to sidebar
  const { isSidebarOpen, setIsSidebarOpen } = useContext(AdminContext);

  const tologout = () => {
    setLogouttext(!logouttext);
  };
  const islogout = () => {
    setLogout(!logout);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_id");
  };

  const sidebar = () => {
    console.log("click");
    setSidebarToggle(!sidebartoggle);
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      {/* TopNavBar start */}
      <div className="topnavbarr shadow">
        <div className="d-flex justify-content-end">
          <i
            className=" userlogo  bi bi-person-circle "
            style={{
              fontSize: 30,
              height: "50px",
              alignItems: "center",
              marginRight: "50px",
            }}
            onClick={tologout}
          ></i>
        </div>
        <div className="d-flex justify-content-end ">
          {logouttext && (
            <>
              <div
                style={{
                  marginTop: "07px",
                  marginRight: "45px",
                  borderRadius: "10px",
                  backgroundColor: "#FFFFFF",
                  zIndex: 10,
                }}
              >
                <p
                  className="d-flex"
                  style={{
                    padding: "10px",
                    alignItems: "center",
                    marginTop: "10px",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={islogout}
                >
                  <i
                    class="bi bi-box-arrow-right"
                    style={{
                      alignItems: "center",
                      marginRight: "5px",
                      fontSize: 30,
                    }}
                  ></i>
                  Logout
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {/* TopNavBar end */}

      {/* Top heading start  */}

      <div
        style={{
          marginLeft: isSidebarOpen ? "280px" : "110px",
          marginTop: "7px",
        }}
      >
        <div className="heading">
          <p className=" headingText d-flex justify-content-center">
            Aqua Admin
          </p>
        </div>
      </div>

      {/* Top heading End  */}

      {/* Sidebar , Logic  for toggel  */}

      {sidebartoggle ? (
        <div className="sideBar d-flex flex-column">
          <div className="d-flex justify-content-end">
            <div
              style={{
                fontSize: 30,
                backgroundColor: "white",
                borderRadius: "50%",
                margin: "7px 0 5px 5px",
                height: "30px",
                cursor: "pointer",
              }}
            >
              <i
                class="bi bi-arrow-left-short"
                style={{ fontSize: 30, top: "-7px", position: "relative" }}
                onClick={sidebar}
              ></i>
            </div>
          </div>
          <div className="logos ">
            <img
              src={companylogo}
              alt="companylogo"
              style={{
                width: "80px",
                height: "80px",

                padding: "3px",

                margin: "10px 30px 0 77px",
              }}
            />

            {/* 1 */}
            <div className="outer">
              <NavLink
                to="/admin/usernotification"
                className="sidemenu d-flex align-items-center userNotification "
              >
                <i
                  className="bi bi-people"
                  style={{ color: "white", fontSize: 24 }}
                ></i>{" "}
                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "white",
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                  Notification
                </p>
              </NavLink>
            </div>

            {/* 2 */}

            <div className="outer">
              <NavLink
                to="/admin/createduser"
                className="sidemenu d-flex align-items-center userNotification"
              >
                <i
                  className="bi bi-person-check"
                  style={{ color: "white", fontSize: 24 }}
                >
                  {" "}
                </i>

                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "white",
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                  User
                </p>
              </NavLink>
            </div>

            {/* 3 */}
            <div className="outer">
              <NavLink
                to="/admin/devicetypecreate"
                className="sidemenu d-flex userNotification"
              >
                <i
                  className=" bi bi-diagram-3-fill"
                  style={{ color: "white", fontSize: 24 }}
                ></i>

                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "white",
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                  Device Type
                </p>
              </NavLink>
            </div>
            {/* 4 */}
            <div className="outer">
              <NavLink
                to="/admin/ocr"
                className="sidemenu d-flex userNotification"
              >
                <i
                  className="bi bi-search"
                  style={{ color: "white", fontSize: 24 }}
                ></i>{" "}
                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "white",
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                  OCR
                </p>
              </NavLink>
            </div>
            {/* 5 */}
            <div className="outer">
              <NavLink
                to="/admin/thermal"
                className="sidemenu d-flex userNotification"
              >
                <i
                  className="bi bi-inbox"
                  style={{ color: "white", fontSize: 24 }}
                ></i>{" "}
                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "white",
                    textAlign: "center",
                    fontSize: 20,
                  }}
                >
                  Thermal
                </p>
              </NavLink>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="sideBar d-flex flex-column" style={{ width: "60px" }}>
            <img
              src={companylogo}
              alt="companylogo"
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "white",
                padding: "3px",
                borderRadius: "50px",
                margin: "5px",
                cursor: "pointer",
              }}
              onClick={sidebar}
            />
            <div
              className="logos"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: 30,
              }}
            >
              {/* 1 */}

              <div style={{ marginTop: "8px" }}>
                <NavLink to="/admin/usernotification" className="sidemenu">
                  <i className="bi bi-people" style={{ color: "white" }}></i>
                </NavLink>
              </div>

              {/* 2 */}

              <div style={{ marginTop: "8px" }}>
                <NavLink to="/admin/createduser" className="sidemenu">
                  <i
                    className="bi bi-person-check"
                    style={{ color: "white" }}
                  ></i>
                </NavLink>
              </div>

              {/* 3 */}

              <div style={{ marginTop: "8px" }}>
                <NavLink to="/admin/devicetypecreate" className="sidemenu">
                  <i
                    className=" bi bi-diagram-3-fill"
                    style={{ color: "white" }}
                  ></i>
                </NavLink>
              </div>

              {/* 4 */}

              <div style={{ marginTop: "8px" }}>
                <NavLink to="/admin/ocr" className="sidemenu">
                  <i className="bi bi-search" style={{ color: "white" }}></i>
                </NavLink>
              </div>

              {/* 5 */}

              <div style={{ marginTop: "8px" }}>
                <NavLink to="/admin/thermal" className="sidemenu">
                  <i className="bi bi-inbox" style={{ color: "white" }}></i>
                </NavLink>
              </div>
            </div>
          </div>
        </>
      )}

      {/* End sidebar logic */}

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
    </>
  );
};

export default Sidebar;
