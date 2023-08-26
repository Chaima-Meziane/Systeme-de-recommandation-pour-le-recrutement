import React from "react"

const Head = () => {
  return (
    <>
      <section className='head'>
        <div className='container flexSB'>
          <div className='logo'>
            <h1>Esprit's Job Center</h1>
            <span> ÉPANOUISSEMENT PROFESSIONNEL ASSURÉ</span>
          </div>

          <div className='social'>
            <a href='https://www.facebook.com/esprit.tn'><i className='fab fa-facebook-f icon'></i></a>
            <a href='https://www.instagram.com/esprit_ingenieur/?hl=fr'><i className='fab fa-instagram icon'></i></a>
            <a href='https://twitter.com/esprittn?lang=fr'><i className='fab fa-twitter icon'></i></a>
            <a href='https://www.youtube.com/@esprit-ecolesuppriveedinge5115'><i className='fab fa-youtube icon'></i></a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Head
