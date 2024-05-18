import AdminMainPage from "./components/Admin/AdminMainPage";
import Usersmainpage from "./components/User/Usersmainpage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createContext, useState } from "react";
import {  LoadScript} from "@react-google-maps/api";

export const AdminContext = createContext();

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <AdminContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_Google_map_Api}>
          <Routes>
            <Route path="/admin/*" element={<AdminMainPage />} />
            
            <Route path="/users/*" element={<Usersmainpage />} />
          </Routes>
        </LoadScript>
      </AdminContext.Provider>
    </Router>
  );
}

export default App;


