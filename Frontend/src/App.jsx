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
import AdminDashboard from './pages/organizetion_dashboard/organizetion_dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import EventManagement from './admin/eventmangement';
import ProtectedRoute from './components/ProtectedRoute';
import EditEvent from './pages/organizetion_dashboard/EditEvent';
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter([
  {
    path: "",  
    element: <Applayout/>,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Home/> },
      { path: "home", element: <Home/> },
      { 
        path: "profile", 
        element: <ProtectedRoute><Profile/></ProtectedRoute> 
      },
      { 
        path: "events", 
        element: <ProtectedRoute><Events/></ProtectedRoute> 
      },
      { 
        path: "addEvent", 
        element: <ProtectedRoute><AddEvent/></ProtectedRoute>
      },
      { 
        path: "event/:id", 
        element: <ProtectedRoute><EventDetails/></ProtectedRoute>
      },
      { 
        path: "booking/:eventId", 
        element: <ProtectedRoute><Booking/></ProtectedRoute>
      },
      { 
        path: "contactus", 
        element: <ProtectedRoute><Contact/></ProtectedRoute> 
      },
      { 
        path: "reset-password", 
        element: <RequestReset/> 
      },
      { 
        path: "reset-password/:token", 
        element: <ResetPassword/> 
      },
      {
        path: "admindashboard",
        element: <ProtectedRoute><AdminDashboard/></ProtectedRoute>
      },
      {
        path: "organizer/events/edit/:eventId",
        element: <ProtectedRoute><EditEvent/></ProtectedRoute>
      }
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
    <GoogleOAuthProvider clientId="30494993317-v50imvkvdnuf5jp4thadqv55573svnva.apps.googleusercontent.com">
      <PayPalScriptProvider 
        options={{
          "client-id": "AcB_TLetjBymVxpDUrOUBtAC3yTGuurN3dLZM7Uf949ODzkzQEbZ3wOO6vm0DJhMMXtmrSl7kxCgerfW",
          currency: "USD",
          intent: "capture",
          components: "buttons",
          "enable-funding": "paypal"
        }}
        onError={(err) => console.error("PayPal Script Error:", err)}
        deferLoading={false}
      >
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </GoogleOAuthProvider>
  );
}

export default App;