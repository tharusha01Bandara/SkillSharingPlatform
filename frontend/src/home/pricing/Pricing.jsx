import React from "react"
import Back from "../common/back/Back"
import PriceCard from "./PriceCard"
import "./price.css"
import Faq from "./Faq"
import LearningPlanList from "../../components/LearningPlanList"

const Pricing = () => {
  return (
    <div>
      <Back title='Choose The Right Plan' />
      <section className='price padding'>
        <div className='container grid'>
          <LearningPlanList />
        
        </div>
      </section>
      <Faq />
    </div>
  )
}

export default Pricing
