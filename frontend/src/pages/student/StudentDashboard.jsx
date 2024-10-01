import React from "react";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { useNavigate, useParams } from "react-router-dom";
import Assigmnment from "../../assets/give-assignment.jfif";

const StudentDashboard = () => {
  const header1 = <img src={Assigmnment} alt="ass" />;
  const { id } = useParams();
  const navigate = useNavigate();
  const handleClick1 = () => {
    navigate(`/student/assignments/${id}`);
  };
  return (
    <div>
      <Header user="Student" />
      <div className="flex">
        <Card
          title="Assignments"
          subTitle="View Assignments"
          onClick={handleClick1}
          header={header1}
          className="w-80 h-fit hover:cursor-pointer transition-all duration-300 ease-in-out hover:p-2 my-8 ml-8 mr4"
        ></Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
