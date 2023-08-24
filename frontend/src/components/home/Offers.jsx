import React, { useState, useEffect, useContext } from "react";
import OnlineCourses from "../allcourses/OnlineCourses"
import Heading from "../common/heading/Heading"
import "../allcourses/courses.css"
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from "axios";
import { getoffre } from "../../services/ApiService";




const Offers = () => {
  const [liked, setLiked] = useState(false); // Define liked state
  const { user } = useContext(UserContext); 
  const [offres, setOffres] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [userCandidatures, setUserCandidatures] = useState([]);
  const [userCandidaturesLoading, setUserCandidaturesLoading] = useState(true);
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

   // Fetch data from the backend using Axios
   useEffect(() => {
    let isMounted = true; // Add a flag to check if the component is still mounted

    getoffre()
      .then((res) => {
        if (isMounted) {
          console.log("resultat api", res)
          const filteredOffers = filterOffers(res); // Filter offers based on search query
          setOffres(res)
          const offersWithLikedStatus = res.map((offer) => {
            // Fetch liked status for each offer
            return getLikeStatus(user.id, offer.id)
              .then((likeStatus) => {
                return {
                  ...offer,
                  liked: likeStatus.liked,
                };
              })
              .catch((error) => {
                console.error(`Error fetching like status for offer ${offer.id}:`, error);
                return {
                  ...offer,
                  liked: false,
                };
              });
          });

          Promise.all(offersWithLikedStatus)
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
      // Charger les candidatures de l'utilisateur depuis l'API
      getCandidaturesByUserId(user.id)
      .then((res) => {
        if (isMounted) {
          setUserCandidatures(res.candidatures);
          setUserCandidaturesLoading(false); // Set loading state to false after fetching data
        }
      })
      .catch((error) => {
        console.error('Error fetching user candidatures:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLike = async (offreId) => {
    try {
      // Send the like/dislike request to the server
      await axios.post(`http://127.0.0.1:8000/like/like_offre/${offreId}/`, {
        userId: user.id,
      });
  
      // Update the liked status on the frontend
      setOffres((prevOffres) =>
        prevOffres.map((o) =>
          o.id === offreId ? { ...o, liked: !o.liked } : o
        )
      );
    } catch (error) {
      console.error(`Error liking/offre ${offreId}:`, error);
    }
  };
  

  

  return (
    <>
      <section className='homeAbout'>
        <div className='container'>
          <Heading subtitle='our job offers' title='explore available job offers' />
          <Link to={`/OffersByCoordinator`}><button className='outline-btn'>coordinator offers</button></Link>
          <Link to={`/addoffre`}><button className='outline-btn'>add offer</button></Link>
          <Link to={`/recommendedoffers`}><button className='outline-btn'>offres recommandées</button></Link>
          <Link to={`/recommendedoffersbylikes/${user.id}`}><button className='outline-btn'>Recommended offers</button></Link>
          <Link to={`/MesCandidatures`}><button className='outline-btn'>Mes Candidatures</button></Link>
          <Link to={`/calendar`}><button className='outline-btn'>Mes entretiens</button></Link>

          <input
            type="text"
            placeholder="Search job offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className='coursesCard'>
            {/* copy code form  coursesCard */}
            <div className='grid2'>
            {filterOffers(offres).map((offre) => (
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
                  
                 


                  
                  <Link to={`/details/${offre.id}`}>
                  <button className='outline-btn'>VIEW JOB DETAILS</button>
                  </Link>

                  {/* Check if user candidatures are still loading */}
              {userCandidaturesLoading ? (
                <button className='outline-btn' disabled>Loading...</button>
              ) : (
                <>

                   {/* Vérification si l'utilisateur a déjà postulé à cette offre */}
                {userCandidatures.some(
                  (candidature) => candidature.offre_id === offre.id
                ) ? (
                  <button className="outline-btn" disabled>Vous avez déjà postulé</button>

                ) : (
                  <Link to={`/${offre.id}/addcandidature`}>
                    <button className="outline-btn">POSTULER</button>
                  </Link>
                )}
                </>  
              )}

                  <button className={`like-button ${offre.liked ? "liked" : ""}`} onClick={() => handleLike(offre.id)}>
                  {offre.liked ? (
                      <span>
                        <i className="fas fa-thumbs-up"></i> Liked
                      </span>
                    ) : (
                      <span>
                        <i className="far fa-thumbs-up"></i> Like
                      </span>
                    )}
                  </button>
              
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