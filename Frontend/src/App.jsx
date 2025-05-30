import './App.css'
import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
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
import ErrorBoundary from './components/ErrorBoundary';
import EventManagement from './admin/eventmangement';




const router = createBrowserRouter([
  {
    path: "",  
    element: <Applayout/>,
    errorElement: <ErrorBoundary />,
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
    errorElement: <ErrorBoundary />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "users", element: <UsersManagement /> },
      { path: "events", element: <EventManagement /> },
    ]
  },
  {
    path: '*',
    element: <ErrorBoundary />
  }
]);
function App() {
  return (
    <PayPalScriptProvider options={{
      "client-id": "AcB_TLetjBymVxpDUrOUBtAC3yTGuurN3dLZM7Uf949ODzkzQEbZ3wOO6vm0DJhMMXtmrSl7kxCgerfW",
      currency: "USD",
      intent: "capture"
    }}>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  );
}
export default App;