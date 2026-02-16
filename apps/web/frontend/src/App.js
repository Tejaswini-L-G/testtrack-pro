import { Routes, Route, useNavigate } from "react-router-dom";



import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ChangePassword from "./ChangePassword";
import Verify from "./Verify";
import Dashboard from "./Dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import TestCases from "./Dashboard/Tester/TestCases/TestCases";
import CreateTestCase from "./Dashboard/Tester/TestCases/CreateTestCase";
import EditTestCase from "./Dashboard/Tester/TestCases/EditTestCase";
import TemplateList from "./Dashboard/Tester/TestCases/TemplateList";
import ImportTestCases from "./Dashboard/Tester/TestCases/ImportTestCases";
import ViewTestCase from "./Dashboard/Tester/TestCases/ViewTestCase";
import TesterDashboard  from "./Dashboard/TesterDashboard";






import "./styles.css";









function App() {
  
  const navigate = useNavigate();

  return (
    <>
      {/* Floating background bubbles */}
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>

      {/* Top Bar */}
      <div className="switch-bar">
  <button onClick={() => navigate("/")}>Login</button>
  <button onClick={() => navigate("/register")}>Register</button>

  {localStorage.getItem("token") && (
    <button onClick={() => navigate("/change-password")}>
      Change Password
    </button>
  )}
</div>


      {/* Routes */}
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot" element={<ForgotPassword />} />
  <Route path="/reset/:token" element={<ResetPassword />} />
  <Route path="/verify/:token" element={<Verify />} />
  <Route path="/change-password" element={<ChangePassword />} />
  <Route path="/testcases" element={<TestCases />} />
   <Route path="/testcases/create" element={<CreateTestCase />} />
   <Route path="/testcases/:id/edit" element={<EditTestCase />} />
   <Route
path="/dashboard/testcases/edit/:id"
  element={<EditTestCase />}
/>
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <TesterDashboard />
    </ProtectedRoute>
  }
>
  <Route path="testcases/:id" element={<ViewTestCase />} />
</Route>
<Route path="/templates" element={<TemplateList />} />
<Route path="/import" element={<ImportTestCases />} />
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
</Routes>

    </>
  );
}

export default App;
