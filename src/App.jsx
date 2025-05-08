import './App.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Applayout from './components/AppLayout';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Profile from './pages/Profile/profile';
import SignUp from './pages/signUp/signUp';
import Events from './pages/Events/events';
import AdminDashboard from './pages/AdminDashboard/admindashboard';
import Booking from './pages/Booking/booking';

const router = createBrowserRouter([
  {
    path: "",  
    element: <Applayout/>,
    children: [
      { path: "home", element: <Home/> },
      { path: "login", element: <Login/> },  
      { path: "profile", element: <Profile/> },
      { path: "signup", element: <SignUp/> },
      { path: "events", element: <Events/> },
      {path: "AdminDashboard", element: <AdminDashboard/>},
      {path:"booking" , element: <Booking/>}
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
