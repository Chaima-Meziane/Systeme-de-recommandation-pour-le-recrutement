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

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/combine_and_sort_scores/${user.id}/`)
      .then(response => {
        const offers = response.data.recommended_offers;
        setRecommendedOffers(offers);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [user.id]);

  return (
    <>
      <Back title='Offres recommandées' />

      <section className='homeAbout'>
        <div className='container'>
          <Heading subtitle='our job offers' title='explore available job offers' />

          <div className='coursesCard'>
            <div className='grid2'>
              {recommendedOffers.map(offre => (
                <div className='items' key={offre.id}>
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
                        <label htmlFor=''>(5.0)</label>
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
                            <p>Similarity score : {offre.similarity}</p>
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
                  <Link to={`/details/${offre.offer ? offre.offer.id : offre.id}`}><button className='outline-btn'>VIEW JOB DETAILS</button></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default RecommendedOffersForUser;