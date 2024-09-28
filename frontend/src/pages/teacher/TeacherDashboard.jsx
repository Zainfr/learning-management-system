import React from "react";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { useNavigate, useParams } from "react-router-dom";
import Assigmnment from "../../assets/give-assignment.jfif";
import ViewAssigmnment from "../../assets/View-assignment.jfif";

const TeacherDashboard = () => {
  const header1 = <img src={Assigmnment} alt="ass" />;
  const header2 = <img src={ViewAssigmnment} alt="ass1" />;
  const { id } = useParams();
  const navigate = useNavigate();
  const handleClick1 = () => {
    navigate(`/teacher/assignment/${id}`);
  };
  const handleClick2 = () => {
    navigate(`/teacher/submissions/${id}`);
  };

  return (
    <div className="">
      <Header user="Teacher" />
      <div className="flex">
        <Card
          title="Create Assignment"
          subTitle="Assignment"
          onClick={handleClick1}
          header={header1}
          className="w-80 h-fit hover:cursor-pointer transition-all duration-300 ease-in-out hover:p-2 my-8 ml-8 mr4"
        ></Card>
        <Card
          title="View Assignments"
          subTitle="Submissions"
          onClick={handleClick2}
          header={header2}
          className="w-80 h-fit hover:cursor-pointer transition-all duration-300 ease-in-out hover:p-2 m-8"
        ></Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
