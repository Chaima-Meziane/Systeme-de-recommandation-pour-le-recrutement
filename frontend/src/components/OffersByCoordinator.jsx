import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import OnlineCourses from "./allcourses/OnlineCourses"
import Heading from './common/heading/Heading'; 
import "./allcourses/courses.css"
import { Link } from 'react-router-dom';
import Back from "./common/back/Back"


const OffersByCoordinator = () => {
  const { user } = useContext(UserContext);
  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const filterOffers = (offers) => {
    return offers.filter((offre) => {
      // You can customize this filtering logic based on your use case
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        offre.titreDuPoste.toLowerCase().includes(lowerCaseQuery) ||
        offre.localisation.toLowerCase().includes(lowerCaseQuery) ||
        offre.competences.toLowerCase().includes(lowerCaseQuery) ||
        offre.entreprise.toLowerCase().includes(lowerCaseQuery) ||
        offre.typeEmploi.toLowerCase().includes(lowerCaseQuery)
        );
    });
  };
  useEffect(() => {
    if (user) {
      // Fetch offers for the logged-in coordinator
      axios.get(`http://localhost:8000/api/offres/coordinator/${user.id}/`)
        .then(response => {
          setOffers(response.data);
          const filteredOffers = filterOffers(response.data); // Filter offers based on search query

        })
        .catch(error => {
          console.error('Error fetching offers:', error);
        });
    }
  }, [user]);

  return (
    <>
    <Back title='Mes Offres' />
    <section className='homeAbout'>
    <div className='container'>
      <Heading subtitle='our job offers' title='explore available job offers' />
      {/*<Link to={`/addoffre`}><button className='outline-btn'>add offre</button></Link>*/}
      <input
            type="text"
            placeholder="Rechercher des offres d'emploi ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      <div className='coursesCard'>
        {/* copy code form  coursesCard */}
        <div className='grid2'>
        {filterOffers(offers).map((offre) => (
            <div className='items  offer-hoverable'key={offre.id}>
               <div className='hidden'>
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
                    {/*<label htmlFor=''>(5.0)</label>*/}
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
              <div className='buttons-on-hover' style={{ marginTop: '10%' }}>
              <Link to={`/dashboard/${offre.id}`}>
                  <button className='outline-btn-btn'>Tableau de bord</button>
              </Link>
              <Link to={`/owner/details/${offre.id}`}><button className='outline-btn-btn'>Détails du poste</button></Link>
              <Link to={`/candidaturesbyoffer/${offre.id}`}><button className='outline-btn-btn'>Candidatures reçues</button></Link>
              <Link to={`/recommendations/${offre.id}`}><button className='outline-btn-btn'>Profils suggérés</button></Link>

            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <OnlineCourses />
  </section>
  </>
  );
};

export default OffersByCoordinator;