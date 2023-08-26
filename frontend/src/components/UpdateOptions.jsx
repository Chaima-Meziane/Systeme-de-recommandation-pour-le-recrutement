import React, { useEffect, useState, useContext } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
  useEffect(() => {
    let isMounted = true; // Add a flag to check if the component is still mounted
  
    axios.get(`http://127.0.0.1:8000/api/getEntretienByID/${id}`)
      .then((res) => {
        if (isMounted) {
          setEntretien(res.data);
          setLoading(false);
          console.log(res.data);
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
  
    return () => {
      isMounted = false; 
    };
  }, [id, entretien?.candidature]); 
  



  if (loading) {
    return <div>Loading...</div>;
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
    fontSize: '19px',
    padding: '10px 10px', // Adjusting padding to 0 on the horizontal axis
    width: '350px',
    height:'60px',
    marginLeft:'150px'
   
  };

  return (
    <>
      <Back title="Détails de l'entretien" />
      <section className='contacts padding'>
        <div className='container shadow'>
          <div className='left row'>
          <br/><br/>
          <h1>Détails de l'entretien</h1>
            
            <div style={{ display: 'inline-block' }}>
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
            
            <div style={{ display: 'inline-block' }}>
            <p style={{ display: 'inline', fontSize: '20px' , color:'black'}}>Identifiant du candidat : </p>
            <p style={{ display: 'inline' }}>
              {candidature.candidat}
            </p>
            </div><br/><br/>

            <div style={{ display: 'inline-block' }}>
            <p style={{ display: 'inline', fontSize: '20px' , color:'black'}}>Identifiant du coordinateur pédagogique : </p>
            <p style={{ display: 'inline' }}>
              {entretien.coordinateur}
            </p>
            </div><br/><br/>

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
          <br/><br/><br/><br/>

          
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
