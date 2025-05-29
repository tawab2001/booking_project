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
import EventDetails from './pages/EventDetails';

import Booking from './pages/Booking/booking';
import Contact from './pages/ContactUs/contactus';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import RequestReset from './pages/ResetPassword/RequestReset';
import DashboardLayout from './admin/DashboardLayout';
import Dashboard from './admin/Dashboard';
import AdminRoute from './admin/AdminRoute';
import UsersManagement from './admin/UsersManagement';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './pages/AdminDashboard/admindashboard';



const router = createBrowserRouter([
  {
    path: "",  
    element: <Applayout/>,
    children: [
      { path: "", element: <Home/> },
      { path: "home", element: <Home/> },
      { path: "profile", element: <Profile/> },
      { path: "events", element: <Events/> },
      { path: "addEvent", element: <AddEvent/>},
      { path: "event/:id", element: <EventDetails/>},
      { path: "booking/:eventId", element: <Booking/>},
      { path: "contactus", element: <Contact/> },
      { path: "reset-password", element: <RequestReset/> },
      { path: "reset-password/:token", element: <ResetPassword/> },
      {path:"admindashboard", element: <AdminDashboard/>}
    ]
  },
  { path: "signup", element: <SignUp/> },
  { path: "login", element: <Login/> },
  { path: "admin-login", element: <AdminLogin/> },
  {
    path: "admin",
    element: (
      <AdminRoute> 
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      { path: "", element: <Dashboard /> },
      { path: "users", element: <UsersManagement /> },
      // { path: "events", element: <EventsManagement /> },
      // { path: "settings", element: <Settings /> }
    ]
  }
]);
function App() {
<<<<<<< HEAD

=======
>>>>>>> aaa8c9f47842caa96e1a162c5ca022ef7b756e4a
  return (
    <RouterProvider router={router} />
  );
}
export default App;