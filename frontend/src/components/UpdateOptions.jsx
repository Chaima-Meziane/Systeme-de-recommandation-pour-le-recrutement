import React, { useEffect, useState, useContext } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './UserContext';
import axios from 'axios';


export default function UpdateOptions() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [entretien, setEntretien]=useState('');
  const [candidature, setCandidature]=useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidatDetails, setCandidatDetails] = useState({});
  const [offreDetails, setOffreDetails] = useState({});


  useEffect(() => {
    let isMounted = true;

    axios.get(`http://127.0.0.1:8000/api/getEntretienByID/${id}`)
      .then((res) => {
        if (isMounted) {
          setEntretien(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    if (entretien?.candidature) {
      axios.get(`http://127.0.0.1:8000/api/getCandidatureByID/${entretien.candidature}`)
        .then((response) => {
          const data = response.data;
          setCandidature(data);
        })
        .catch((error) => {
          console.error("Error fetching candidature data:", error);
        });
    }

    if (candidature?.candidat) {
      axios.get(`http://127.0.0.1:8000/api/getUserByID/${candidature.candidat}`)
        .then((response) => {
          const candidatData = response.data;
          setCandidatDetails(candidatData);
        })
        .catch((error) => {
          console.error("Error fetching candidat data:", error);
        });
    }
    if (candidature?.offre) {
      axios.get(`http://127.0.0.1:8000/api/getOffreByID/${candidature.offre}`)
        .then((response) => {
          const offreData = response.data;
          setOffreDetails(offreData);
        })
        .catch((error) => {
          console.error("Error fetching offre data:", error);
        });
    }


    return () => {
      isMounted = false; 
    };
  }, [id, entretien, candidature]);



  if (loading) {
    return <><Back title="Détails de l'entretien" /><div className="loading-container">
    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '80px', color:'#1eb2a6' , marginLeft:'800px'}} />
    <br/><br/>5
    <div style={{ fontSize: '20px', color:'grey',   marginLeft:'720px' }}> Veuillez patienter un instant</div><br/><br/>
  </div></>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!entretien) {
    return <div>Job offer not found.</div>;
  }
    

  const handleRescheduleClick = () => {
    navigate(`/reporterentretien/${id}`);
  };
  const handleUpdateResult = () => {
    navigate(`/updateresultatentretien/${id}`);
  };

  const buttonStyles = {
    fontSize: '17px',
    padding: '10px 10px', 
    width: '350px',
    height:'60px',
    marginLeft:'50px'
   
  };

  return (
    <>
      <Back title="Détails de l'entretien" />
      <section className='contacts padding'>
        <div className='container shadow' style={{height:'920px'}}>
          <div className='left row'>
          <br/><br/>
          <h1>Détails de l'entretien</h1>
            
            {/*<div style={{ display: 'inline-block' }}>
            <p style={{ display: 'inline', fontSize: '20px' , color:'black'}}>Identifiant : </p>
            <p style={{ display: 'inline' }}>
              {entretien.id}
            </p>
            </div><br/><br/>
            
            <div style={{ display: 'inline-block' }}>
            <p style={{ display: 'inline', fontSize: '20px' , color:'black'}}>Identifiant de la candidature : </p>
            <p style={{ display: 'inline' }}>
              {candidature.id}
            </p>
            </div><br/><br/>
  */}
            <div style={{ display: 'inline-block' }}>
            <p style={{ display: 'inline', fontSize: '20px' , color:'black'}}>Candidat: </p>
            <p style={{ display: 'inline' }}>
              {candidatDetails.first_name} {candidatDetails.last_name}
                 </p>
            </div><br/><br/>

            <div style={{ display: 'inline-block' }}>
            <p style={{ display: 'inline', fontSize: '20px' , color:'black'}}>Offre: </p>
            <p style={{ display: 'inline' }}>
            {offreDetails.titreDuPoste}
                 </p>
            </div><br/><br/>
{/*
            <div style={{ display: 'inline-block' }}>
            <p style={{ display: 'inline', fontSize: '20px' , color:'black'}}>Identifiant du coordinateur pédagogique : </p>
            <p style={{ display: 'inline' }}>
              {entretien.coordinateur}
            </p>
            </div><br/><br/>
*/}
            <div style={{ display: 'inline-block' }}>
              <p style={{ display: 'inline', fontSize: '20px', color: 'black' }}>Date et heure : </p>
              <p style={{ display: 'inline' }}>
                {new Date(entretien.date).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' })}{' '}
                de {entretien.heure_debut.slice(0, -3)} à {entretien.heure_fin.slice(0, -3)}
              </p>
            </div>
            <br /><br/>


            <div style={{ display: 'inline-block' }}>
              <p style={{ display: 'inline', fontSize: '20px', color: 'black' }}>Lien de réunion : </p>
              <p style={{ display: 'inline' }}>
                <a href={entretien.lien_reunion} style={{ textDecoration: 'underline' }}>
                Cliquez ici pour rejoindre la réunion sur Google Meet
                </a>
              </p>
            </div>

            
            <br /><br/>

            <div style={{ display: 'inline-block' }}>
            <p style={{ display: 'inline', fontSize: '20px' , color:'black'}}>Résultat de l'entretien :</p>
            <p style={{ display: 'inline' }}>
              {entretien.resultat === 'refuse' ? ' Refusé' : 
              entretien.resultat === 'accepte' ? ' Accepté' :
              entretien.resultat === 'en_attente' ? ' En attente' :
              entretien.resultat}
            </p>
          </div>

          <br /><br/>
            <div style={{ display: 'inline-block' }}>
            
            <p style={{ display: 'inline' }} >
              <a href={`/candidaturesbyoffer/${candidature.offre}`} style={{ textDecoration: 'underline' }}>Cliquez ici pour voir la candidature</a>
            </p>
          </div>

          <br/><br/>
          <br/><br/>

          
          {!user.is_candidat && (
            <>
              <h1>Modifier l'entretien</h1>

              <button className='primary-btn' type='button' style={buttonStyles} onClick={handleRescheduleClick}>
                Reporter l'entretien          
              </button>
              <br/>
              <button className='primary-btn' type='button' style={buttonStyles} onClick={handleUpdateResult}>
                Adjoindre le résultat de l'entretien
              </button>
            </>
          )}

          </div>
        </div>
      </section>
    </>
  );
}