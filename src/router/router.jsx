import { Routes, Route, Navigate, BrowserRouter } from "react-router"; // use 'react-router-dom'

import DashboardLayout from "../layout/DashboardLayout.jsx";
import Home from "../pages/Home/Home.jsx";
import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import ChangePassword from "../pages/Password/ChangePassword.jsx";
import JobCreate from "../pages/Jobs/JobCreate.jsx";
import AllJobs from "../pages/Jobs/AllJobs.jsx";
import JobEdit from "../pages/Jobs/JobEdit.jsx";
import JobView from "../pages/Jobs/JobView.jsx";
import Moderators from "../pages/Auth/Moderators/Moderators.jsx";
import PrivateRoute from "./PrivectRoute.jsx";
import Status from "../pages/jobIndex/Status.jsx";
import Category from "../pages/jobIndex/Category.jsx";
import Manage from "../pages/jobIndex/ManageJobIndex.jsx";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="dashboard/profile" element={<Profile />} />
          <Route
            path="dashboard/change-password"
            element={<ChangePassword />}
          />
          <Route path="jobs/create" element={<JobCreate />} />
          <Route path="jobs/read" element={<AllJobs />} />
          <Route path="jobs/edit/:id" element={<JobEdit />} />
          <Route path="jobs/view/:id" element={<JobView />} />
          <Route path="setting/manage_moderator" element={<Moderators />} />
          <Route path="moderator/register" element={<Register />} />
          <Route path="/job-index/status" element={<Status />} />
          <Route path="/job-index/manage" element={<Manage />} />
          <Route path="/job-index/category" element={<Category />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
