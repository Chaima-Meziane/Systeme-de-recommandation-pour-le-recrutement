import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Heading from './common/heading/Heading';
import job_offer from '../../public/images/job_offer.png';
import logo_esprit from '../../public/images/logo_esprit.png';
import Back from "./common/back/Back";
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';

function RecommendedOffersForUser(props) {
  const [recommendedOffers, setRecommendedOffers] = useState([]);
  const { user } = useContext(UserContext);
  const [userCandidatures, setUserCandidatures] = useState([]);
  const [userCandidaturesLoading, setUserCandidaturesLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is mounted

    // Fetch recommended offers
    axios.get(`http://127.0.0.1:8000/api/combine_and_sort_scores/${user.id}/`)
      .then(response => {
        if (isMounted) {
          const offers = response.data.recommended_offers;
          setRecommendedOffers(offers);
        }
      })
      .catch(error => {
        console.error('Error fetching recommended offers:', error);
      });

    // Fetch user candidatures
    getCandidaturesByUserId(user.id)
      .then((res) => {
        if (isMounted) {
          setUserCandidatures(res.candidatures);
          setUserCandidaturesLoading(false); 
        }
      })
      .catch((error) => {
        console.error('Error fetching user candidatures:', error);
      });

    return () => {
      isMounted = false; // Clean up the flag when the component unmounts
    };
  }, [user.id]);

  const getCandidaturesByUserId = (userId) => {
    return axios.get(`http://127.0.0.1:8000/api/mesCandidatures/${userId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching user candidatures:", error);
        throw error;
      });
  };

  return (
    <>
      <Back title='Offres recommandées' />
  
      <section className='homeAbout'>
        <div className='container'>
          <Heading subtitle='Offres sur Mesure' title="les plus adaptées à vous en premier" />
          {recommendedOffers.length === 0 ? (
            <div className="no-offers-message">
            <p >Nous n'avons actuellement aucune offre qui correspond à vos critères.</p>
            <p >Nous vous invitons à consulter régulièrement nos mises à jour.</p>
            <br></br>
            <br></br>
            <br></br>
          </div>
         
          
          ) : (
            <div className='coursesCard'>
              <div className='grid2'>
                {recommendedOffers.map(offre => (
                  <div className='items offer-hoverable' key={offre.id}>
                    <div className='hidden'>
                      <div className='content flex'>
                        <div className='left'>
                          <div className='img'>
                            <img src={job_offer} alt='' />
                          </div>
                        </div>
                        <div className='text'>
                          <h1>{offre.offer ? offre.offer.titreDuPoste : offre.titreDuPoste}</h1>
  
                          <div className='rate'>
                            <i className='fa fa-star'></i>
                            <i className='fa fa-star'></i>
                            <i className='fa fa-star'></i>
                            <i className='fa fa-star'></i>
                            <i className='fa fa-star'></i>
                          </div>
                          <div className='localisation'>
                            <i className="fas fa-map-marker-alt"></i>
                            <h4>{offre.offer ? offre.offer.localisation : offre.localisation}</h4>
                          </div>
  
                          <div className='details'>
                            <div className='container'>
                              <div className='left2'>
                                <div className='dimg'>
                                  <img src={logo_esprit} alt='' />
                                </div>
                                <div className='text2'>
                                  <div className='para'>
                                    <h4>{offre.offer ? offre.offer.entreprise : offre.entreprise}</h4>
                                  </div>
                                </div>
                                {/*<p>Similarity score : {offre.similarity}</p>*/}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
  
                      <div className='price'>
                        <h3>
                          {offre.offer ? offre.offer.competences : offre.competences}
                        </h3>
                      </div>
                    </div>
  
                    <div style={{ marginTop: '60px', height: '70%' }} className='buttons-on-hover'>
                      <Link to={`/details/${offre.offer ? offre.offer.id : offre.id}`}>
                        <button className='offers-btn'>DÉTAILS DE L'OFFRE</button>
                      </Link>
                      <br />
                      {userCandidaturesLoading ? (
                        <button className='offers-btn' disabled>Chargement...</button>
                      ) : (
                        <>
                          <br />
                          {userCandidatures.some(
                            (candidature) => candidature.offre_id === (offre.offer ? offre.offer.id : offre.id)
                          ) ? (
                            <button className="offers-btn" disabled>VOUS AVEZ DÉJÀ POSTULÉ POUR CETTE OFFRE</button>
                          ) : (
                            <Link to={`/${offre.offer ? offre.offer.id : offre.id}/addcandidature`}>
                              <button className="offers-btn">POSTULER</button>
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
  

}

export default RecommendedOffersForUser;
