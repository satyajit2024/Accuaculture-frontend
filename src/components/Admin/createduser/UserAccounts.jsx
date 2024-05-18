import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../Adminpage.css";
import { AdminContext } from "../../../App";
import axios from "axios";

const UserAccounts = () => {
  const [openModel, setOpenModel] = useState(false);
  const [deletebutton, setDeleteButton] = useState(false);
  // This useraccount save allAccounts of a user
  const [useraccount, setUseraccount] = useState([]);
  const updateaccountname = useRef(null);
  const [useraccounterror, setUseraccounterror] = useState("");
  const [tempaccountid, SetTempAccountId] = useState("");

  //This  'indivisualuserid' variable  save AccountId   of each Accounts of a user on click of edit button
  const [indivisualaccountsid, SetIndivisualaccountsid] = useState("");

  //context

  const { isSidebarOpen } = useContext(AdminContext);

  const { mob } = useParams();

  const openModels = () => {
    setOpenModel(!openModel);
  };
  const openDeleteModels = () => {
    setDeleteButton(!deletebutton);
  };

  const userAccountFetch = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_App_Ip}/account_view/${mob}/`
      );
      setUseraccount(response.data.items);
    } catch (error) {
      setUseraccounterror("Data Are Not Avilable !");
    }
  };

  useEffect(() => {
    userAccountFetch();
  }, []);

  // variable for next and previous button
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useraccount.slice(indexOfFirstItem, indexOfLastItem);

  async function accountNameUpdate() {
    const accountbody = {
      accountid: indivisualaccountsid,
      newaccountname: updateaccountname.current.value,
    };
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_App_Ip}/account_edit/`,
        accountbody
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteAccount = async () => {
    console.log(tempaccountid);
    const accountdata = {
      accountid: tempaccountid,
    };
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_App_Ip}/account_delete/`,
        accountdata
      );
      console.log(response);
      if (response) {
        setTimeout(() => {
          userAccountFetch();
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        <div
          className=" shadow"
          style={{
            width: "200px",
            backgroundColor: "#7DE0AE",
            borderRadius: "20px",
            marginTop: "10px",
          }}
        >
          <div>
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "25px",
                padding: "10px",
                margin: "2px 2px 4px 2px",
              }}
            >
              Accounts
            </p>
          </div>
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
                  Account ID
                </th>
                <th
                  className="text-center"
                  scope="col"
                  style={{ backgroundColor: "#7CDFAD" }}
                >
                  Account Name
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
                <tr key={index + 1}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{data[1]}</td>
                  <td className="text-center">{data[0]}</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn  btn-warning px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                      style={{
                        textAlign: "cenetr",
                      }}
                      onClick={() => {
                        openModels();
                        SetIndivisualaccountsid(data[1]);
                      }}
                    >
                      Edit
                    </button>
                    <Link
                      to={`/admin/createduser/useraccounts/UseraccountDevices/${data[1]}`}
                    >
                      <button
                        type="button"
                        className="btn btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                        style={{
                          textAlign: "cenetr",
                          marginLeft: "8px",
                        }}
                      >
                        Devices
                      </button>
                    </Link>

                    <button
                      type="button"
                      className="btn  btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                      style={{
                        textAlign: "cenetr",
                        marginLeft: "8px",
                      }}
                      onClick={() => {
                        openDeleteModels();
                        SetTempAccountId(data[1]);
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

        {/* Error Handel Message start */}
        {useraccounterror ? (
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
                No User Regesterd Yet... !
              </p>
            </div>
          </>
        ) : (
          <></>
        )}
        {/* Error Handel Message END */}

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
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            Previous
          </button>{" "}
          <p style={{ marginTop: "09px" }}>
            Page {currentPage} of {Math.ceil(useraccount.length / itemsPerPage)}{" "}
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
            disabled={indexOfLastItem >= useraccount.length}
            onClick={handleNextPage}
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              accountNameUpdate();
              openModels();
              setTimeout(() => {
                userAccountFetch();
              }, 1000);
            }}
          >
            <div
              className="model"
              style={{ fontSize: "23px", width: "600px", height: "270px" }}
            >
              {/* Modal Heading */}
              <div className="heading d-flex justify-content-between  ">
                <p
                  style={{ marginTop: "8px", marginLeft: "30px", fontSize: 25 }}
                >
                  Edit Account Name
                </p>
                <i
                  className="bi bi-x-octagon cancel-button-modal "
                  style={{ fontSize: 30 }}
                  onClick={openModels}
                ></i>
              </div>
              {/* Modal Content */}
              <div style={{ marginLeft: "20px", marginTop: "30px" }}>
                <div style={{ marginLeft: "25px" }}>
                  <label htmlFor="formGroupExampleInput">Account Name</label>
                  <input
                    ref={updateaccountname}
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter Account Name"
                    style={{ width: "400px" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Please Enter Updated Account Name"
                      )
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  ></input>
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
                    Update
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : null}

      {/* Modal End */}

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
                <p> Are you sure to Delete this Account Permanently ?</p>
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
                    deleteAccount();
                    openDeleteModels();
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
                    openDeleteModels();
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

export default UserAccounts;
