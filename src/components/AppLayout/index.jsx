import Header from "./Navbar/navbar";
import { Outlet } from "react-router-dom";

function Applayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default Applayout;
