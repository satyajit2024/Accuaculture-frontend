import React, { useContext } from "react";
import "./Adminpage.css";
import { AdminContext } from "../../App";
const Ocr = () => {
  //context
  const {isSidebarOpen}=useContext(AdminContext);
  return (
    <>
    <div style={{ marginLeft: isSidebarOpen ? "280px":'110px' , marginTop:'7px'}}>

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
              <th  className="text-center" scope="col" style={{ backgroundColor: "#7CDFAD" }}>
                Name
              </th>
              <th  className="text-center" scope="col" style={{ backgroundColor: "#7CDFAD" }}>
                Mobile No
              </th>
              <th  className="text-center" scope="col" style={{ backgroundColor: "#7CDFAD" }}>
                Image Name
              </th>
              <th  className="text-center"
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
      </div>
    </>
  );
};

export default Ocr;
