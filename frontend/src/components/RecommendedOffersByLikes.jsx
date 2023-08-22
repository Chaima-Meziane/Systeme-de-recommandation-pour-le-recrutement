// components/BestOffersPage.js

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Heading from './common/heading/Heading';
import "./allcourses/courses.css"
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import job_offer from '../../public/images/job_offer.png';
import logo_esprit from '../../public/images/logo_esprit.png';
const RecommendedOffersByLikes = () => {
    const [bestOffers, setBestOffers] = useState([]);
    const { user } = useContext(UserContext);
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/like/best_offers/${user.id}/`)
            .then(response => {
                setBestOffers(response.data);
            })
            .catch(error => {
                console.error('Error fetching best offers:', error);
            });
    }, []);

    return (<section className='homeAbout'>
    <div className='container'>
      <Heading subtitle='our job offers' title='explore available job offers' />
        
      <div className='coursesCard'>
        {/* copy code form  coursesCard */}
        <div className='grid2'>
        {bestOffers.map(offre => (
            <div className='items'key={offre.id}>
              <div className='content flex'>
                <div className='left'>
                  <div className='img'>
                  <img src={job_offer} alt='' />
                  </div>
                </div>
                <div className='text'>
                  <h1>{offre.titreDuPoste}</h1>
                  
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
                <h4>{offre.localisation}</h4>
              </div>
                  
                  <div className='details'>
                    
                      <>
                        <div className='container'>
                          <div className='left2'>
                          <div className='dimg'>
                          <img src={logo_esprit} alt='' />
                          </div>
                          
                          <div className='text2'>
                          <div className='para'>
                            <h4>{offre.entreprise}</h4>
                          </div></div>
                          <p>Similarity score : {offre.similarity_score}</p>
                        </div></div>
                        
                        {/*<span>{offre.description}</span>*/}
                      </>
                    
                  </div>
                </div>
              </div>
              <div className='price'>
                <h3>
                  {offre.competences}
                </h3>
              </div>
              <Link to={`/details/${offre.id}`}><button className='outline-btn'>VIEW JOB DETAILS</button></Link>
              

            </div>
          ))}
        </div>
      </div>
    </div>
    
  </section>
        
    );
};

export default RecommendedOffersByLikes;
