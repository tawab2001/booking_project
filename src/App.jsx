import { RouterProvider, createBrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
// import Applayout from "./components/Applayout";
import Home from './pages/Home/home';
import Logein from './pages/Logein/logein'; 
import Profile from './pages/Profile/profile';
import SignUp from './pages/signUp/signUp';
import Events from './pages/Events/events';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Applayout />, // استدعينا Applayout هنا
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Logein /> },
      { path: "profile", element: <Profile /> },
      { path: "signup", element: <SignUp /> },
      { path: "eventdetails", element: <Events /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
