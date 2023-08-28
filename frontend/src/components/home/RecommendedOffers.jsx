import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import OnlineCourses from "../allcourses/OnlineCourses"
import Heading from "../common/heading/Heading"
import "../allcourses/courses.css"
import { Link } from 'react-router-dom';
import Back from "../common/back/Back"

const RecommendedOffers = () => {
  const [recommendedOffers, setRecommendedOffers] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Faites une requête HTTP GET pour obtenir les offres recommandées pour l'utilisateur
    axios.get(`http://127.0.0.1:8000/api/recommend_offers_to_user/${user.id}/`)
      .then(response => {
        const recommendedOffersData = response.data.recommended_offers;
        setRecommendedOffers(recommendedOffersData);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des offres recommandées:', error);
      });
  }, [user]);

  return (
    <>
    <Back title='Offres recommandées' />
    <section className='homeAbout'>
      <div className='container'>
        <Heading subtitle='our job offers' title='explore available job offers' />
       

        <div className='coursesCard'>
          {/* copy code form  coursesCard */}
          <div className='grid2'>
            {recommendedOffers.map((offer) => (
              <div className='items'key={offer.id}>
                <div className='content flex'>
                  <div className='left'>
                    <div className='img'>
                      <img src='images/job_offer.png' alt='' />
                    </div>
                  </div>
                  <div className='text'>
                    <h1>{offer.titreDuPoste}</h1>
                    
                    <div className='rate'>
                      <i className='fa fa-star'></i>
                      <i className='fa fa-star'></i>
                      <i className='fa fa-star'></i>
                      <i className='fa fa-star'></i>
                      <i className='fa fa-star'></i>
                      <label htmlFor=''>(5.0)</label>
                    </div>
                    <div className='localisation'> 
                    <i className="fas fa-map-marker-alt"></i>
                  <h4>{offer.localisation}</h4>
                </div>
                    
                    <div className='details'>
                      
                        <>
                          <div className='container'>
                            <div className='left2'>
                            <div className='dimg'>
                              <img src='images/logo_esprit.png' alt='' />
                            </div>
                            
                            <div className='text2'>
                            <div className='para'>
                              <h4>{offer.entreprise}</h4>
                            </div></div>
                          </div></div>
                          
                          {/*<span>{offre.description}</span>*/}
                        </>
                      
                    </div>
                  </div>
                </div>
                <div className='price'>
                  <h3>
                    {offer.competences}
                  </h3>
                </div>
                <div className='price'>
                  <h3>
                    {offer.similarity}
                  </h3>
                </div>
                <Link to={`/details/${offer.id}`}><button className='outline-btn'>VIEW JOB DETAILS</button></Link>
               


              </div>
            ))}
          </div>
        </div>
      </div>
      <OnlineCourses />
    </section>
  </>
)
}

export default RecommendedOffers;