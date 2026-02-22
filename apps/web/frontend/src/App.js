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
import SuitesList from "./Dashboard/Tester/Suites/SuitesList";

import VersionsList from "./Dashboard/Tester/TestCases/VersionsList";
import VersionDetail from "./Dashboard/Tester/TestCases/VersionDetail";
import AdminTestCases from "./Dashboard/AdminTestCases";
import AdminDashboard from "./Dashboard/AdminDashboard"
import DashboardLayout from "./Dashboard/DashboardLayout";
import DeveloperDashboard from "./Dashboard/DeveloperDashboard";
import ExecutionPage from "./Execution/ExecutionPage";
import HomePage from "./Dashboard/HomePage";
import ExecutionList from "./Execution/ExecutionList";
import CreateTestRun from "./TestRun/CreateTestRun";
import TestRunList from "./TestRun/TestRunList";
import MyRuns from "./TestRun/MyRuns";
import RunDetails from "./TestRun/RunDetails";
import RunProgressDashboard from "./TestRun/RunProgressDashboard";
import EditTestRun from "./TestRun/EditTestRun";
import TesterExecutions from "./Execution/TesterExecutions";
import BugReport from "./Bugs/BugReport";
import BugDashboard from "./Bugs/BugDashboard";

import ExecutionHistory from "./Execution/ExecutionHistory";
import ExecutionCompare from "./Execution/ExecutionCompare";
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
     


      {/* Routes */}
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot" element={<ForgotPassword />} />
  <Route path="/reset/:token" element={<ResetPassword />} />
  <Route path="/verify/:token" element={<Verify />} />
  <Route path="/change-password" element={<ChangePassword />} />
 

  
   <Route path="/testcases/:id/edit" element={<EditTestCase />} />
 
   <Route path="/admin/dashboard" element={<AdminDashboard />}>
  <Route path="testcases" element={<AdminTestCases />} />

 <Route path="testruns" element={<TestRunList />} />
  <Route path="testruns/create" element={<CreateTestRun />} />
  <Route path="/admin/dashboard/bugs" element={<BugDashboard />} />
</Route>
<Route path="/developer/dashboard" element={<DeveloperDashboard />} />
<Route path="/dashboard/home" element={<HomePage />} />
  <Route
  path="/dashboard/testcases/:id/versions"
  element={<VersionsList />}
/>

<Route
  path="/admin/dashboard/testruns/:id"
  element={<RunProgressDashboard />}
/>

<Route
  path="/admin/dashboard/testruns/edit/:id"
  element={<EditTestRun />}
/>

<Route
  path="/admin/dashboard/testruns/edit/:id"
  element={<EditTestRun />}
/>


<Route
  path="/dashboard/version/:id"
  element={<VersionDetail />}
/>



<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <TesterDashboard />
    </ProtectedRoute>
  }
>
  <Route index element={null} />

  <Route path="home" element={<HomePage />} />
  <Route path="testcases" element={<TestCases />} />
 <Route path="testcases/edit/:id" element={<EditTestCase />} />
  <Route path="testcases/view/:id" element={<ViewTestCase />} />
  <Route path="testcases/create" element={<CreateTestCase />} />
  <Route path="templates" element={<TemplateList />} />
  <Route path="import" element={<ImportTestCases />} />
  <Route path="suites" element={<SuitesList />} />

   <Route path="execution" element={<ExecutionList />} />

  <Route path="execution/:id" element={<ExecutionPage />} />
  <Route path="/dashboard/bugs" element={<BugDashboard />} />

   <Route
  path="my-runs"
  element={<MyRuns />}
/>
<Route path="my-runs/:id" element={<RunDetails />} />
<Route
  path="my-executions"
  element={<TesterExecutions />}
/>
<Route
  path="/dashboard/bug-report"
  element={<BugReport />}
/>
<Route
  path="/dashboard/compare"
  element={<ExecutionCompare />}
/>

</Route>

<Route
  path="/dashboard/execution-history/:testCaseId"
  element={<ExecutionHistory />}
/>



</Routes>

    </>
  );
}

export default App;
