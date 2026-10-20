
import { useState } from "react";

function Subject() {
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    if (subject.trim() === "") {
      return;
    }

    setSubjects([...subjects, subject]);
    setSubject("");
  }

  return (
    <div>
      <h1>Manage Subject</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter the subject name"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        

        <button type="submit">Add Subject</button>
      </form>

      <h2>Subject List</h2>

      <ul>
        {subjects.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default Subject;
