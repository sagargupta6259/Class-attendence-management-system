import React from 'react'
import {Link} from "react-router-dom"

function Dashboard() {
    const student = window.JSON.parse(window.localStorage.getItem("student")
);
  return (
    
    <div>
        <h1>attendence mangement sysyem</h1>
        <h2>Dashboard</h2>
        <p>welcome,{student ? student.name:"student"}</p>
        <ul>
            <li>
                <Link to="/subject">manage subject</Link>
                <br />
                <Link to="/attendance">Mark Attendance</Link>
                <br />
                <Link to="/report">Attendance Report</Link>
                <br />
            </li>
        </ul>
        <Link to="/">Back to login</Link>


    </div>
  )
}

export default Dashboard