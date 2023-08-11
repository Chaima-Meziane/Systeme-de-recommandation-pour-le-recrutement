import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import OnlineCourses from "./allcourses/OnlineCourses"
import Heading from './common/heading/Heading'; 
import "./allcourses/courses.css"
import { Link } from 'react-router-dom';

const OffersByCoordinator = () => {
  const { user } = useContext(UserContext);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    if (user) {
      // Fetch offers for the logged-in coordinator
      axios.get(`http://localhost:8000/api/offres/coordinator/${user.id}/`)
        .then(response => {
          setOffers(response.data);
        })
        .catch(error => {
          console.error('Error fetching offers:', error);
        });
    }
  }, [user]);

  return (
    <section className='homeAbout'>
    <div className='container'>
      <Heading subtitle='our job offers' title='explore available job offers' />
      <Link to={`/addoffre`}><button className='outline-btn'>add offre</button></Link>

      <div className='coursesCard'>
        {/* copy code form  coursesCard */}
        <div className='grid2'>
          {offers.map((offre) => (
            <div className='items'key={offre.id}>
              <div className='content flex'>
                <div className='left'>
                  <div className='img'>
                    <img src='images/job_offer.png' alt='' />
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
                            <img src='images/logo_esprit.png' alt='' />
                          </div>
                          
                          <div className='text2'>
                          <div className='para'>
                            <h4>{offre.entreprise}</h4>
                          </div></div>
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
              
            </div>
          ))}
        </div>
      </div>
    </div>
    <OnlineCourses />
  </section>
  );
};

export default OffersByCoordinator;
