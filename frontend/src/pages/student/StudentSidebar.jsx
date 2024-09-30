import React from "react";

import { Link, useParams } from "react-router-dom";

const StudentSidebar = () => {
  const { id } = useParams();

  return (
    <div>
      <div className="flex flex-col h-screen bg-gradient-to-r from-violet-600 to-indigo-600 text-white w-52">
        <nav className="flex-1 overflow-y-auto">
          <ul>
            <li>
              <Link
                to={`/student/${id}`}
                className="block  p-6 hover:bg-gray-700 rounded-2xl text-xl font-bold"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to={`/student/note/${id}`}
                className="block  p-6 hover:bg-gray-700 rounded-2xl text-xl font-bold"
              >
                Notes
              </Link>
            </li>
            <li>
              <Link
                to={`/student/studentexperiment/${id}`}
                className="block p-6 hover:bg-gray-700 rounded-2xl text-xl font-bold"
              >
                Experiment
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default StudentSidebar;
