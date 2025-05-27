import { BrowserRouter, Navigate, Route, Routes } from "react-router"; // use 'react-router-dom'

import DashboardLayout from "../layout/DashboardLayout";
import Applications from "../pages/Applications/Applications.jsx";
import Login from "../pages/Auth/Login";
import Home from "../pages/Home/Home";
import Category from "../pages/jobIndex/Category.jsx";
import Manage from "../pages/jobIndex/ManageJobIndex.jsx";
import Status from "../pages/jobIndex/Status.jsx";
import AllJobs from "../pages/Jobs/AllJobs";
import JobCreate from "../pages/Jobs/JobCreate";
import JobEdit from "../pages/Jobs/JobEdit";
import JobView from "../pages/Jobs/JobView";
import CreateForms from "../pages/JobsForms/CreateForms.jsx";
import JobForms from "../pages/JobsForms/JobForms.jsx";
import ChangePassword from "../pages/Password/ChangePassword";
import Profile from "../pages/Profile/Profile";
import PrivateRoute from "./PrivateRoute.jsx";
import EditForms from "../pages/JobsForms/EditForms.jsx";
import TemplateForm from "../pages/JobsForms/TemplateForm.jsx";
import Users from "../pages/Auth/Users.jsx";
import Register from "../pages/Auth/Register.jsx";
import EditUser from "../pages/Auth/EditUser.jsx";

export default function Router() {
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
          <Route path="jobs/applications" element={<Applications />} />
          <Route path="dashboard/profile" element={<Profile />} />
          <Route
            path="dashboard/change-password"
            element={<ChangePassword />}
          />
          <Route path="jobs/create" element={<JobCreate />} />
          <Route path="jobs/read" element={<AllJobs />} />
          <Route path="jobs/edit/:id" element={<JobEdit />} />
          <Route path="jobs/view/:id" element={<JobView />} />
          <Route path="/jobs/forms" element={<JobForms />} />
          <Route path="/jobs/create/template/:id" element={<TemplateForm />} />
          <Route path="/jobs/forms/create" element={<CreateForms />} />
          <Route path="/jobs/forms/edit/:id" element={<EditForms />} />

          <Route
            path="setting/manage_moderator"
            element={
              <PrivateRoute requireAdmin={true}>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="moderator/edit/:id"
            element={
              <PrivateRoute requireAdmin={true}>
                <EditUser />
              </PrivateRoute>
            }
          />
          <Route
            path="moderator/register"
            element={
              <PrivateRoute requireAdmin={true}>
                <Register />
              </PrivateRoute>
            }
          />

          <Route path="/job-index/status" element={<Status />} />
          <Route path="/job-index/manage" element={<Manage />} />
          <Route path="/job-index/category" element={<Category />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="jobs/applications/:jobId" element={<Applications />} />
      </Routes>
    </BrowserRouter>
  );
}

// export default [
//   {
//     path: "/",
//     element: (
//       <PrivateRoute>
//         <DashboardLayout />
//       </PrivateRoute>
//     ),
//     hydrateFallbackElement: <div>Loading...</div>,
//     errorElement: <div>Error</div>,
//     children: [
//       {
//         index: true,
//         element: <Home />,
//       },
//       {
//         path: "dashboard",
//         element: <Navigate to="/" replace />,
//       },
//       {
//         path: "dashboard/profile",
//         element: <Profile />,
//       },
//       {
//         path: "dashboard/change-password",
//         element: <ChangePassword />,
//       },
//       {
//         path: "jobs/create",
//         element: <JobCreate />,
//       },
//       {
//         path: "jobs/read",
//         element: <AllJobs />,
//       },
//       {
//         path: "jobs/edit/:id",
//         element: <JobEdit />,
//       },
//       {
//         path: "jobs/view/:id",
//         element: <JobView />,
//       },
//       {
//         path: "/jobs/forms",
//         element: <JobForms />,
//       },
//       {
//         path: "/jobs/forms/create",
//         element: <CreateForms />,
//       },
//       {
//         path: "setting/manage_moderator",
//         element: <Moderators />,
//       },
//       {
//         path: "moderator/register",
//         element: <Register />,
//       },
//       {
//         path: "/job-index/status",
//         element: <Status />,
//       },
//       {
//         path: "/job-index/manage",
//         element: <Manage />,
//       },
//       {
//         path: "/job-index/category",
//         element: <Category />,
//       },
//     ],
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
// ];
