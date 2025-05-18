import React from "react"
import Back from "../common/back/Back"
import UserSearch from "../../components/UserSearch"
import "./blog.css"

const Blog = () => {
  return (
    <div>
      <Back title='Friends' />
      <section className='blog padding'>
        <div className='container grid2'>
          <UserSearch />
        </div>
      </section>
    </div>
  )
}

export default Blog
