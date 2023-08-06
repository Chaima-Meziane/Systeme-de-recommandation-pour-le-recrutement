import React from "react"
import AboutCard from "../about/AboutCard"
import Hblog from "./Hblog"
import Offers from './Offers'
import Hero from "./hero/Hero"
import Hprice from "./Hprice"
import Testimonal from "./testimonal/Testimonal"

const Home = () => {
  return (
    <>
      <Hero />
      <AboutCard />
      <Offers />
      <Testimonal />
      <Hblog />
      <Hprice />
    </>
  )
}

export default Home
