
import { Outlet } from "react-router-dom";
import React from 'react'
import Header from "../Navbar/navbar";
import Footer from "../Footer/footer";

function Applayout() {
  return (
    <>
    <div>
    <Header/>
    <Outlet/>
    <Footer/>
    </div>
    </>
  );
}

export default Applayout;
