import React from "react"
import Heading from "../../common/heading/Heading"
import "./Hero.css"

const Hero = () => {
  const scrollToOffers = () => {
    const offersSection = document.getElementById("offers-section");
    offersSection.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <>
      
      <section className='hero'> {/* Ajoutez l'identifiant "scrollToSection" */}
      
        <div  className='container'>
          <div className='row'>
            <Heading subtitle='BIENVENUE SUR EPRIT’S JOB CENTER' title='Développez Votre Carrière Avec Nous' />
            {/*<Heading title='BIENVENUE SUR EPRIT’S JOB CENTER' />*/}
            <p style={{color: 'white'}}>Explorez des opportunités uniques qui correspondent à votre vision et à vos aspirations.</p>
            
          </div>
        </div>
        
      </section>
  
      <div className='button1'>
            <button className='primary-btn' onClick={scrollToOffers}>
              DÉCOUVREZ NOS OFFRES <i className='fa fa-long-arrow-alt-right'></i>
            </button>
            </div>
            
      <div className='margin'></div>
    </>
  )
}

export default Hero
