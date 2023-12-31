import React, {useContext, useState, useEffect} from "react"
import Heading from "../common/heading/Heading"
import "./about.css"
import Back from "../common/back/Back"
import Awrapper from "./Awrapper"
import { UserContext } from '../UserContext'
import { useParams, Link } from "react-router-dom";
import { getoffrebyid } from "../../services/ApiService";
import on_recrute_image from '../../../public/images/on_recrute.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSpinner } from '@fortawesome/free-solid-svg-icons';
const CoordinatorsOfferDetails = () => {
  const { id } = useParams();
  const { setUser } = useContext(UserContext);
  const [jobOffer, setJobOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

    // Clean-up function to prevent setting state on an unmounted component
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <><Back title="Détails de l'offre"/><div className="loading-container">
    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '80px', color:'#1eb2a6' , marginLeft:'800px'}} />
    <br/><br/>5
    <div style={{ fontSize: '20px', color:'grey',   marginLeft:'720px' }}> Veuillez patienter un instant</div><br/><br/>
  </div></>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!jobOffer) {
    return <div>Job offer not found.</div>;
  }
    

  return (
    <><Back title="Détails de l'offre" />
      <section className='aboutHome'>
        <div className='container flexSB'>
          <div className='left row'>
            <img src={on_recrute_image} alt='' />
          </div>
          <div className='right row'>
            <Heading subtitle='Consulter' title="Les détails de l'offre"/>
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
                    </div></div>

                    <Link to={`/updateoffre/${id}`}>
                        <button className='outline-btn'>Modifier l'offre</button>
                    </Link>
                    
                  
                    
                 
                  
                  

                
            </div>
          </div>
        </div>
      </section>
      {/*<Awrapper />*/}
    </>
  )
}

export default CoordinatorsOfferDetails
