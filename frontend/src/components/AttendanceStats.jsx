import React from "react";
import { BookOpen, CheckCircle, AlertCircle, PieChart, Calendar } from "lucide-react";

const AttendanceStats = ({ stats, email, phone }) => {
    // Check if stats and required properties exist
    if (!stats || !stats.overallAttendance || !stats.subjectAttendance) {
        return (
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Loading attendance data...</h3>
            </div>
        );
    }

    return (
        <div className="md:col-span-2 md:row-span-2 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <PieChart className="text-blue-600" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Attendance Overview</h3>
                </div>
                <span className="text-sm bg-blue-50 text-blue-600 py-1 px-3 rounded-full font-medium">
                    Current Semester
                </span>
            </div>

            {/* Overall Attendance Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <CheckCircle className="text-white" size={18} />
                        </div>
                        <span className="font-medium text-gray-700">Overall Attendance</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`text-2xl font-bold ${parseFloat(stats.overallAttendance) >= 75
                            ? "text-green-600"
                            : parseFloat(stats.overallAttendance) >= 60
                                ? "text-amber-500"
                                : "text-red-500"
                            }`}>
                            {stats.overallAttendance}
                        </span>
                        <span className="text-xs text-gray-500">Attendance Rate</span>
                    </div>
                </div>
            </div>

            {/* Subject-wise Attendance */}
            <h4 className="text-md font-medium text-gray-700 mb-3">Subject-wise Breakdown</h4>
            <div className="space-y-4">
                {stats.subjectAttendance.map((subject, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <BookOpen className="text-indigo-600" size={16} />
                                </div>
                                <span className="font-medium text-gray-800">{subject.subjectName}</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${parseFloat(subject.attendancePercentage) >= 75
                                ? "bg-green-100 text-green-600"
                                : parseFloat(subject.attendancePercentage) >= 60
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-red-100 text-red-600"
                                }`}>
                                {subject.attendancePercentage}
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 ml-11">
                            <div className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                <span>Total: {subject.totalLectures} lectures</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle size={14} className="mr-1" />
                                <span>Present: {subject.presentCount}</span>
                            </div>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-3 ml-11 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${parseFloat(subject.attendancePercentage) >= 75
                                    ? "bg-green-500"
                                    : parseFloat(subject.attendancePercentage) >= 60
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                    }`}
                                style={{ width: subject.attendancePercentage }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Attendance Warning */}
            {parseFloat(stats.overallAttendance) < 75 && (
                <div className="mt-12 flex items-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle size={18} className="text-amber-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-amber-700">
                        Your overall attendance is below 75%. Please improve your attendance to avoid academic penalties.
                    </p>
                </div>
            )}
            <div className="md:col-span-2 h-fit bg-gray-100 p-10 mt-12 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-800">
                            {email}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-800">
                            {phone}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceStats;