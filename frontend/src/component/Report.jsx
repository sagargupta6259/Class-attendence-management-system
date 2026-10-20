
import { useState } from "react";

function Report() {
  const [studentName, setStudentName] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("Present");
  const [reports, setReports] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    const report = {
      studentName: studentName,
      subject: subject,
      status: status,
    };

    setReports([...reports, report]);

    setStudentName("");
    setSubject("");
    setStatus("Present");
  }

  return (
    <div>
      <h1>Attendance Report</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter the student name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Enter the subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <br /><br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <br /><br />

        <button type="submit">Submit</button>
      </form>

      <h2>Report List</h2>

      <ul>
        {reports.map((item, index) => (
          <li key={index}>
            {item.studentName} - {item.subject} - {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Report;
