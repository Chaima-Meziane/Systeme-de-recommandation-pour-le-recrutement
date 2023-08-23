import React, {useContext, useState, useEffect} from "react"
import Heading from "../common/heading/Heading"
import "./about.css"
import Awrapper from "./Awrapper"
import { UserContext } from '../UserContext'
import axios from 'axios';

import { useParams, Link } from "react-router-dom";
import { getoffrebyid } from "../../services/ApiService";
import on_recrute_image from '../../../public/images/on_recrute.png';
const AboutCard = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { setUser } = useContext(UserContext);
  const [jobOffer, setJobOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCandidatures, setUserCandidatures] = useState([]);
  const getCandidaturesByUserId = (userId) => {
    return axios.get(`http://127.0.0.1:8000/api/mesCandidatures/${userId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching user candidatures:", error);
        throw error;
      });
  };
  
  useEffect(() => {
    let isMounted = true; // Add a flag to check if the component is still mounted

    getoffrebyid(id)
      .then((res) => {
        if (isMounted) {
          setJobOffer(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
      getCandidaturesByUserId(user.id)
    .then((res) => {
      if (isMounted) {
        setUserCandidatures(res.candidatures);
      }
    });

    // Clean-up function to prevent setting state on an unmounted component
    return () => {
      isMounted = false;
    };
  }, [id, user.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!jobOffer) {
    return <div>Job offer not found.</div>;
  }
    

  return (
    <>
      <section className='aboutHome'>
        <div className='container flexSB'>
          <div className='left row'>
            <img src={on_recrute_image} alt='' />
          </div>
          <div className='right row'>
            <Heading subtitle='Available Job Offer' title='Job Offer Details'/>
            <div className='items'>
              
                  <div className='item flexSB'>
                    {/*<div className='img'>
                      <img src={val.cover} alt='' />
                    </div>*/}
                    <div className='text'>
                      <h2>Titre du poste</h2>
                      <p>{jobOffer.titreDuPoste}</p>
                    </div>
                  </div>
                  <div className='item flexSB'>
                    {/*<div className='img'>
                      <img src={val.cover} alt='' />
                    </div>*/}
                    <div className='text'>
                    <h2>Entreprise : {jobOffer.entreprise}</h2>
                    <div className='localisation'> 
                      <i className="fas fa-map-marker-alt"></i>
                    <p>{jobOffer.localisation}</p>
                  </div>
                  </div>
                  </div>

                  <div className='item flexSB'>
                    
                    <div className='text'>
                    <h2>Type d'emploi proposé</h2>
                      <p>{jobOffer.typeEmploi}</p>
                    </div>
                  </div>


                  <div className='item flexSB'>
                    
                    <div className='text'>
                    <h2>Description du poste</h2>
                      <p>{jobOffer.description}</p>
                    </div>
                  </div>

                  <div className='item flexSB'>
                    
                    <div className='text'>
                    <h2>Compétences requises</h2>
                      <p>{jobOffer.competences}</p>
                    </div>
                  </div>

                  

                  <div className='item flexSB'>

                    <div className='text'>
                      {jobOffer.statut === 'Ouvert' ? (
                      <>
                      <h2>Statut de l'offre</h2>
                      <p>Cette offre est encore disponible.</p>
      
                      </>
                      ) : (
                      <p>Cette offre n'est plus disponible.</p>
                      )}
                    </div>
                  </div>
                  <div className='item flexSB'>
                  <div className='text'>
                    <p> Êtes-vous intéressé(e) par cette offre ? </p></div></div>

                    <Link to={`/${id}/addCandidature`}>
                    {userCandidatures.some((candidature) => candidature.offre_id === jobOffer.id) ? (
                      <button className='outline-btn' disabled>Vous avez déjà postulé</button>
                    ) : (
                      <button className='outline-btn'>Postuler</button>
                    )}
                  </Link>

                 
                  
                  

                
            </div>
          </div>
        </div>
      </section>
      <Awrapper />
    </>
  )
}

export default AboutCard
