import React, { useState, useEffect } from "react";
import OnlineCourses from "../allcourses/OnlineCourses"
import Heading from "../common/heading/Heading"
import "../allcourses/courses.css"
import { Link } from 'react-router-dom';

import { getoffre } from "../../services/ApiService";

const Offers = () => {
  const [offres, setOffres] = useState([]);
   // Fetch data from the backend using Axios
   useEffect(() => {
    let isMounted = true; // Add a flag to check if the component is still mounted

    getoffre()
      .then((res) => {
        if (isMounted) {
          console.log("resultat api", res)
          setOffres(res)
        }
      })

    // Clean-up function to prevent setting state on an unmounted component
    return () => {
      isMounted = false;
    }
  }, [])

  

  return (
    <>
      <section className='homeAbout'>
        <div className='container'>
          <Heading subtitle='our job offers' title='explore available job offers' />
          <Link to={`/OffersByCoordinator`}><button className='outline-btn'>coordinator offers</button></Link>

          <div className='coursesCard'>
            {/* copy code form  coursesCard */}
            <div className='grid2'>
              {offres.map((offre) => (
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
                  <Link to={`/details/${offre.id}`}><button className='outline-btn'>VIEW JOB DETAILS</button></Link>
                 


                  {/*
                  <Link to={`/details/${parseInt(offre.url.split('/').filter(Boolean).pop())}`}>
                  <button className='outline-btn'>VIEW JOB DETAILS</button>
                  </Link>
                  <Link to={`/${parseInt(offre.url.split('/').filter(Boolean).pop())}/addcandidature`}>
                  <button className='outline-btn'>POSTULER</button>
                  </Link>
              */}
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

export default Offers
