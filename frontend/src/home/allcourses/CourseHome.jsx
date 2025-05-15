import React from "react"
import Back from "../common/back/Back"
import CoursesCard from "./CoursesCard"
import OnlineCourses from "./OnlineCourses"
import CourseList from "../../components/CourseList"

const CourseHome = () => {
  return (
    <div>
      <Back title='Explore Courses' />
      <CoursesCard />
      <OnlineCourses />
      <CourseList />
    </div>
  )
}

export default CourseHome
