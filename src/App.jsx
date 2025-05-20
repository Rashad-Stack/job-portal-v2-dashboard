import { Toaster } from "sonner";
import "./App.css";
import Router from "./router/router";

function App() {
  // return <RouterProvider router={router} />;
  return (
    <>
    <Toaster position="top-center" richColors />
    <Router />
    </>
  );
}

export default App;
