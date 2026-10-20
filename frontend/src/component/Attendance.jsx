
import { useState } from "react";
import { Link } from "react-router-dom";

function Attendance() {
  const [studentName, setStudentName] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("Present");
  const [attendanceList, setAttendanceList] = useState(() => {
    try {
      const saved = localStorage.getItem("attendanceList");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  function handleSubmit(e) {
    e.preventDefault();

    const attendance = {
      studentName: studentName,
      subject: subject,
      status: status,
    };

    const updatedList = [...attendanceList, attendance];
    setAttendanceList(updatedList);
    localStorage.setItem("attendanceList", JSON.stringify(updatedList));

    setStudentName("");
    setSubject("");
    setStatus("Present");
  }

  return (
    <div>
      <h1>Mark Attendance</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter student name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Enter subject name"
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

        <button type="submit">Save Attendance</button>
      </form>

      <h2>Attendance List</h2>

      <ul>
        {attendanceList.map((item, index) => (
          <li key={index}>
            {iteam.studentName} - {iteam.subject} - {iteam.status}
          </li>
        ))}
      </ul>

      <br />
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
}

export default Attendance;
