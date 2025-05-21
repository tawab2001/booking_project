import './App.css'
import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Applayout from './components/AppLayout';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Profile from './pages/Profile/profile';
import SignUp from './pages/signUp/signUp';
import Events from './pages/Events/events';
import AddEvent from './pages/AddEvent/addevent';
import AdminDashboard from './pages/AdminDashboard/admindashboard';
import Booking from './pages/Booking/booking';
import Contact from './pages/ContactUs/contactus';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import RequestReset from './pages/ResetPassword/RequestReset';


const router = createBrowserRouter([
  {
    path: "",  
    element: <Applayout/>,
    children: [
      { path: "home", element: <Home/> },
      { path: "", element: <Home/> },
       
      { path: "profile", element: <Profile/> },
      
      { path: "events", element: <Events/> },
      {path: "addEvent", element: <AddEvent/>},
      {path:"admin", element: <AdminDashboard/>},
      {path: "booking/:eventId", element: <Booking/>},
      {path: "contactus", element:<Contact/> },
      { path: "reset-password", element: <RequestReset/> },
      { path: "reset-password/:token", element: <ResetPassword/> },

    ],
 
  },
       { path: "signup", element: <SignUp/> },
     { path: "login", element: <Login/> },
]);
function App() {
 
  return (
    <>
      <RouterProvider router={router} />

    </>
  )
}

export default App
