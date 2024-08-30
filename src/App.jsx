import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";

import PrivateRoute from "./PrivateRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Room_no from "./components/Room_no.jsx";
import G1 from "./components/G1.jsx";
import G2 from "./components/G2.jsx";
import A1 from "./components/firsfloor/A1.jsx";
import A2 from "./components/firsfloor/A2.jsx";
import A3 from "./components/firsfloor/A3.jsx";
import A4 from "./components/firsfloor/A4.jsx";
import A5 from "./components/firsfloor/A5.jsx";
import A6 from "./components/firsfloor/A6.jsx";
import A7 from "./components/firsfloor/A7.jsx";
import B1 from "./components/secondfloor/B1.jsx";
import B2 from "./components/secondfloor/B2.jsx";
import B3 from "./components/secondfloor/B3.jsx";
import B4 from "./components/secondfloor/B4.jsx";
import B5 from "./components/secondfloor/B5.jsx";
import B6 from "./components/secondfloor/B6.jsx";
import C1 from "./components/thirdfloor/C1.jsx";
import C2 from "./components/thirdfloor/C2.jsx";
import C3 from "./components/thirdfloor/C3.jsx";
import C4 from "./components/thirdfloor/C4.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

function Nav() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PublicRoute component={Login} />} />
        <Route path="/login" element={<PublicRoute component={Login} />} />

        <Route path="/signup" element={<PublicRoute component={Signup} />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute component={Dashboard} />}
        />
        <Route path="/room_no" element={<PrivateRoute component={Room_no} />} />
        <Route path="/g1" element={<PrivateRoute component={G1} />} />

        <Route path="/g2" element={<PrivateRoute component={G2} />} />
        <Route path="/a1" element={<PrivateRoute component={A1} />} />
        <Route path="/a2" element={<PrivateRoute component={A2} />} />
        <Route path="/a3" element={<PrivateRoute component={A3} />} />
        <Route path="/a4" element={<PrivateRoute component={A4} />} />
        <Route path="/a5" element={<PrivateRoute component={A5} />} />
        <Route path="/a6" element={<PrivateRoute component={A6} />} />
        <Route path="/a7" element={<PrivateRoute component={A7} />} />
        <Route path="/b1" element={<PrivateRoute component={B1} />} />
        <Route path="/b2" element={<PrivateRoute component={B2} />} />
        <Route path="/b3" element={<PrivateRoute component={B3} />} />
        <Route path="/b4" element={<PrivateRoute component={B4} />} />
        <Route path="/b5" element={<PrivateRoute component={B5} />} />
        <Route path="/b6" element={<PrivateRoute component={B6} />} />
        <Route path="/c1" element={<PrivateRoute component={C1} />} />
        <Route path="/c2" element={<PrivateRoute component={C2} />} />
        <Route path="/c3" element={<PrivateRoute component={C3} />} />
        <Route path="/c4" element={<PrivateRoute component={C4} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default Nav;
