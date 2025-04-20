import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from './pages/Home/home';
import Logein from './pages/Logein/logein';
import Profile from './pages/Profile/profile';
import SignUp from './pages/signUp/signUp';
import Events from './pages/Events/events';

const router = createBrowserRouter([
  {
    path: "",
    // element: <Applayout/>,
    children: [
      { path: "", element: <Home/> },
      { path: "Login", element: <Login/> },
      { path: "Profile", element: <Profile/> },
      {path: "SignUp", element:<SignUp/>},
      {path: "Eventsdetils", element:< Events/>}
    ],
  },
]);
function App() {
 
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
