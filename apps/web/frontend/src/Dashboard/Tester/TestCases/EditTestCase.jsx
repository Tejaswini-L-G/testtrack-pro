import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TestCaseForm from "./TestCaseForm";

function EditTestCase() {
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


  const handleUpdate = async (data) => {
    await axios.put(
      `http://localhost:5000/testcases/${id}`,
      data,
      {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("token")
        }
      }
    );

    
    navigate("/testcases");
setTimeout(() => {
  alert("Test case updated successfully.");
}, 300);

  };

  if (!testCase) return <div>Loading...</div>;

  return (
    <TestCaseForm
      initialData={testCase}
      onSubmit={handleUpdate}
      isEdit
    />
  );
}

export default EditTestCase;
