import React, { useContext} from 'react';
import "./footer.css"
import { UserContext } from '../../UserContext';
import { Link} from 'react-router-dom';

const Footer = () => {
  const { user } = useContext(UserContext);
console.log(user);
  return (
    <>
      <section className='newletter'>
        <div className='container flexSB'>
          
        <div className="center-container">
      <h1>Naviguez vers une carrière réussie.</h1>
    </div>
            {/*<span>Far far away, behind the word mountains</span>*/}
          
          {/*<div className='right row'>
            <input type='text' placeholder='Enter email address' />
            <i className='fa fa-paper-plane'></i>
          </div>*/}
        </div>
      </section>
      <footer>
        <div className='container padding'>
          <div className='box logo'>
            <h1>Esprit's Job Center</h1><br/>
            <span>ÉPANOUISSEMENT PROFESSIONNEL ASSURÉ</span>
            <p> Votre parcours sur mesure vers des correspondances professionnelles idéales.</p>
            
          </div>
          {user.is_candidat ? (
          <div className='box link'>
            <h3>Menu</h3>
            <ul>
              <a href='/'><li>Accueil</li></a>
              <a href='/MesCandidatures'><li>Mes candidatures</li></a>
              <a href='/recommendedoffers'><li>Meilleures offres pour vous</li></a>
              <a href={`/recommendedoffersbylikes/${user.id}`}><li>Meilleures offres pour vous</li></a>

              <a href='/calendar'><li>Mes entretiens</li></a>
            </ul>
          </div>
        ) : (
          <div className='box link'>
            <h3>Menu</h3>
            <ul>
              <a href='/'><li>Accueil</li></a>
              <a href='/OffersByCoordinator'><li>Mes offres</li></a>
              <a href='/addoffre'><li>Ajouter une offre</li></a>
              <a href='/calendar'><li>Mes entretiens</li></a>
              
            </ul>
          </div>
        )}
       
          
          
          
          <div className='box last'>
            <h3>Contactez-nous</h3>
            <ul>
              <li>
              <i className='fas fa-map-marker-alt'></i>
                <a href='https://www.google.com/maps/place/ESPRIT/@36.8988892,10.1871341,17z/data=!4m10!1m2!2m1!1sESPRIT,+Cebalat+Ben+Ammar,+Ariana,+Tunisia!3m6!1s0x12e2cb7454c6ed51:0x683b3ab5565cd357!8m2!3d36.8992878!4d10.1893674!15sCipFU1BSSVQsIENlYmFsYXQgQmVuIEFtbWFyLCBBcmlhbmEsIFR1bmlzaWGSARJwcml2YXRlX3VuaXZlcnNpdHngAQA!16s%2Fg%2F11bwdw7k77?entry=ttu'> lot 13, V5XR+M37 Résidence Essalem II, Av. Fethi Zouhir, Cebalat Ben Ammar 2083</a>
              </li>
              <li>
                <i className='fa fa-phone-alt'></i>
                +(216) 70 685 685
              </li>
              <li>
                <i className='fa fa-paper-plane'></i>
                contact@esprit.tn
              </li>
            </ul>
            
          </div>
          <div className='box logo'>
            
            <h3> Suivez-nous</h3>
            
            <a href='https://www.facebook.com/esprit.tn'><i className='fab fa-facebook-f icon'></i></a><br/><br/>
            <a href='https://twitter.com/esprittn?lang=fr'><i className='fab fa-twitter icon'></i></a><br/><br/>
            <a href='https://www.instagram.com/esprit_ingenieur/?hl=fr'><i className='fab fa-instagram icon'></i></a></div>
        </div>
      </footer>
      <div className='pays'>
      <p><i className="fas fa-globe"></i> Tunisie | Français</p>
      </div>
    </>
  )
}

export default Footer
