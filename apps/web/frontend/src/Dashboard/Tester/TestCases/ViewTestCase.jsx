import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import "./ViewTestCase.css";
import { useNavigate } from "react-router-dom";


function ViewTestCase() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [testCase, setTestCase] = useState(null);

  useEffect(() => {
    const fetchTestCase = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/testcases/${id}`,
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        const data = await res.json();
        setTestCase(data);
      } catch (err) {
        console.error("Failed to fetch test case");
      }
    };

    fetchTestCase();
  }, [id]);



  const startExecution = async () => {

  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5000/api/executions/start",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ testCaseId: testCase.id }),
    }
  );

  const data = await res.json();

  console.log("Start API response:", data);

  if (!data?.id) {
    alert("Failed to start execution");
    return;
  }

  navigate(`/dashboard/execution/${testCase.id}`, {
    state: { executionId: data.id },
  });
};

  if (!testCase) return <div>Loading...</div>;

  return (
    <div className="tc-view-container">

      
      <h2>{testCase.title}</h2>

      <div className="tc-section">
        <h3>Details</h3>

        <div className="tc-field">
          <div className="tc-label">Test Case ID</div>
          <div className="tc-value">{testCase.testCaseId}</div>
        </div>

        <div className="tc-field">
          <div className="tc-label">Module</div>
          <div className="tc-value">{testCase.module}</div>
        </div>

        <div className="tc-field">
          <div className="tc-label">Description</div>
          <div className="tc-value">{testCase.description}</div>
        </div>
      </div>

      <div className="tc-section">
  <h3>Project Specific Fields</h3>

  {testCase.TestCaseCustomValue?.length === 0 && (
    <p>No custom fields.</p>
  )}

  {testCase.TestCaseCustomValue?.map((item) => (
    <div key={item.id} className="tc-field">
      <div className="tc-label">
        {item.field.name}
      </div>
      <div className="tc-value">
        {item.value}
      </div>
    </div>
  ))}
</div>

      <div className="tc-section">
        <h3>Test Steps</h3>

        {testCase.steps?.map((step) => (
          <div key={step.id} className="tc-step">
            <strong>Step {step.stepNumber}</strong>
            <div><b>Action:</b> {step.action}</div>
            <div><b>Test Data:</b> {step.testData}</div>
            <div><b>Expected:</b> {step.expected}</div>
          </div>
        ))}
      </div>
<div className="tc-section">
  <h3>Attachments</h3>

  <input
    type="file"
    onChange={async (e) => {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      await fetch(
        `http://localhost:5000/testcases/${id}/attachments`,
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
          body: formData,
        }
      );

      window.location.reload();
    }}
  />

  {testCase.attachments?.length === 0 && (
    <p style={{ marginTop: "10px", color: "#6b7280" }}>
      No attachments uploaded.
    </p>
  )}

  {testCase.attachments?.map((file) => (
    <div key={file.id} className="attachment-item">
      <a
        href={`http://localhost:5000/${file.filePath}`}
        target="_blank"
        rel="noreferrer"
      >
        {file.fileName}
      </a>

      <button
        className="btn-link delete"
        onClick={async () => {
          await fetch(
            `http://localhost:5000/attachments/${file.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization:
                  "Bearer " + localStorage.getItem("token"),
              },
            }
          );

          window.location.reload();
        }}
      >
        Delete
      </button>
    </div>
  ))}
</div>

<button
  className="execute-btn"
  onClick={() =>
    navigate(`/dashboard/execution/${testCase.id}`)
  }
>
  Execute
</button>




    </div>

    
  );
}

export default ViewTestCase;
