import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import OnlineCourses from "../allcourses/OnlineCourses"
import Heading from "../common/heading/Heading"
import "../allcourses/courses.css"
import { Link } from 'react-router-dom';

function MesCandidatures() {
    const [candidatures, setCandidatures] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/mesCandidatures/${user.id}/`)
            .then(response => {
                setCandidatures(response.data.candidatures);
            })
            .catch(error => {
                console.error(error);
            });
    }, [user]);

    return (
    <>
    <section className='homeAbout'>
      <div className='container'>
        <Heading subtitle='our job offers' title='explore available job offers' />
       

        <div className='coursesCard'>
          {/* copy code form  coursesCard */}
          <div className='grid2'>
                {candidatures.map(candidature => (
                    <div className='items' key={candidature.offre_id}>
                          <div className='content flex'>
                  <div className='left'>
                    <div className='img'>
                      <img src='images/job_offer.png' alt='' />
                    </div>
                  </div>
                  <div className='text'>
                    <h1>{candidature.titre_du_poste}</h1>
                    
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
                  <h4>{candidature.localisation}</h4>
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
                              <h4>{candidature.entreprise}</h4>
                            </div></div>
                          </div></div>
                          
                        </>
                      
                    </div>
                  </div>
                </div>
                <div className='price'>
                  <h3>
                    {candidature.competences}
                  </h3>
                </div>
                <div  >
                  <h3>
                    Votre candidature est {candidature.etat.toLowerCase()}
                  </h3>
                </div>
                <br />
                <Link to={`/details/${candidature.offre_id}`}><button className='outline-btn'>VIEW JOB DETAILS</button></Link>
                
              </div>
            ))}
          </div>
        </div>
      </div>
      <OnlineCourses />
    </section>
  </>
    );
}

export default MesCandidatures;
