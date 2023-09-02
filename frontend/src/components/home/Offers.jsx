import React, { useState, useEffect, useContext } from "react";
import OnlineCourses from "../allcourses/OnlineCourses";
import Heading from "../common/heading/Heading";
import "../allcourses/courses.css";
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from "axios";
import { getoffre } from "../../services/ApiService";

const Offers = () => {
  const [offres, setOffres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userCandidatures, setUserCandidatures] = useState([]);
  const [userCandidaturesLoading, setUserCandidaturesLoading] = useState(true);

  const { user } = useContext(UserContext);

  const getCandidaturesByUserId = (userId) => {
    return axios.get(`http://127.0.0.1:8000/api/mesCandidatures/${userId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching user candidatures:", error);
        throw error;
      });
  };

  const getLikeStatus = (userId, offreId) => {
    return axios.get(`http://127.0.0.1:8000/like/getLikeStatus/${offreId}`, {
      params: {
        userId: userId,
      }
    })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching like status:", error);
        throw error;
      });
  };

  const filterOffers = (offers) => {
    return offers.filter((offre) => {
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
    let isMounted = true;

    getoffre()
      .then((res) => {
        if (isMounted) {
          const filteredOffers = filterOffers(res);
          setOffres(filteredOffers);

          const promises = filteredOffers.map((offer) => {
            return getLikeStatus(user.id, offer.id)
              .then((likeStatus) => ({
                ...offer,
                liked: likeStatus.liked,
              }))
              .catch((error) => {
                console.error(`Error fetching like status for offer ${offer.id}:`, error);
                return {
                  ...offer,
                  liked: false,
                };
              });
          });

          Promise.all(promises)
            .then((offersWithStatus) => {
              setOffres(offersWithStatus);
            })
            .catch((error) => {
              console.error("Error fetching like statuses:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
      });

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
      isMounted = false;
    };
  }, [user.id]);

  const handleLike = async (offreId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/like/like_offre/${offreId}/`, {
        userId: user.id,
      });

      setOffres((prevOffres) =>
        prevOffres.map((o) =>
          o.id === offreId ? { ...o, liked: !o.liked } : o
        )
      );
    } catch (error) {
      console.error(`Error liking/offre ${offreId}:`, error);
    }
  };

  // État pour gérer l'affichage du bouton J'aime au survol
  const [hoveredOffer, setHoveredOffer] = useState(null);

  return (
    <>
      <section id='offers-section' className='homeAbout'>
        <div className='container'>
          <Heading subtitle="Accueil" title='Explorez les opportunités professionnelles disponibles' />

          <input
            type="text"
            placeholder="Rechercher des offres d'emploi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className='coursesCard'>
            <div className='grid2'>
              {offres.map((offre) => (
                <div  className='items offer-hoverable' key={offre.id}>
                   <div className='hidden'>
                  <div className={`content flex ${hoveredOffer === offre.id ? 'offer-hoverable' : ''}`}
                       onMouseEnter={() => setHoveredOffer(offre.id)}
                       onMouseLeave={() => setHoveredOffer(null)}>
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
                      </div>
                      <div className='localisation'>
                        <i className="fas fa-map-marker-alt"></i>
                        <h4>{offre.localisation}</h4>
                      </div>
                      <div className='details'>
                        <div className='container'>
                          <div className='left2'>
                            <div className='dimg'>
                              <img src='images/logo_esprit.png' alt='' />
                            </div>
                            <div className='text2'>
                              <div className='para'>
                                <h4>{offre.entreprise}</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='price'>
                    <h3>{offre.competences}</h3>
                  </div>
                  </div>
                  <div className='buttons-on-hover'>
                    {user.is_candidat && (
                      <Link to={`/details/${offre.id}`}>
                        <button className='offers-btn' style={{ marginTop: '70px', height: '100px' }}>DÉTAILS DE L'OFFRE</button>
                      </Link>
                    )}
                    {!user.is_candidat && (
                      <Link to={`/details/${offre.id}`}>
                        <button className='offers-btn' style={{ marginTop: '70px', height: '100px' }}>DÉTAILS DE L'OFFRE</button>
                      </Link>
                    )}
                    <br /><br/>
                    
                    {/* Vérification si l'utilisateur a déjà postulé à cette offre */}
                    {user.is_candidat && (
                        userCandidatures.some((candidature) => candidature.offre_id === offre.id) ? (
                          <button className='offers-btn' disabled>
                            VOUS AVEZ DÉJÀ POSTULÉ POUR CETTE OFFRE
                          </button>
                        ) : (
                          <Link to={`/${offre.id}/addcandidature`}>
                            <button className='offers-btn'>POSTULER</button>
                          </Link>
                        )
                      )}

                  </div>
                  
                  
                  {user.is_candidat && (
                            <button style={{ width:'200px', height: '50%', marginLeft:'21%',marginTop:'65px' }}className={`like-button ${offre.liked ? "liked" : ""}`} onClick={() => handleLike(offre.id)}>
                              {offre.liked ? (
                                <span>
                                  <i className="fas fa-thumbs-up"></i> Aimée
                                </span>
                              ) : (
                                <span>
                                  <i className="far fa-thumbs-up"></i> J'aime
                                </span>
                              )}
                            </button>
                          )}
                    </div>
              
            
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Offers;
