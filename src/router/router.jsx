import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile";
import JobCreate from "../pages/Jobs/JobCreate";
import AllJobs from "../pages/Jobs/AllJobs";
import JobEdit from "../pages/Jobs/JobEdit";
import JobView from "../pages/Jobs/JobView";
import Users from "../pages/Users/Users";
import Moderators from "../pages/Auth/Moderators/Moderators";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <Navigate to="/" replace />,
      },
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },

      {
        path: "/jobs/create",
        element: <JobCreate />,
      },
      {
        path: "/jobs/read",
        element: <AllJobs />,
      },
      {
        path: "/jobs/edit/:id",
        element: <JobEdit />,
      },
      {
        path: "/jobs/view/:id",
        element: <JobView />,
      },
      {
        path: "/jobs/view/:id",
        element: <JobView />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      //   {
      //     path: "/add-user",
      //     element: <Moderators />,
      //   },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
