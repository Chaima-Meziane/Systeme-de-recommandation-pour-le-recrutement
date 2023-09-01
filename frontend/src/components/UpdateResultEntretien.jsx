import React, { useContext, useState, useEffect } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './UserContext';
import axios from 'axios';

export default function UpdateEntretien() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [date, setDate] = useState('');
  const [resultat, setResultat] = useState('');
  const [candidature, setCandidaure] = useState('');
  const [coordinateur, setCoordinateur] = useState('');

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/getEntretienByID/${id}/`)
      .then((response) => {
        //console.log(response.data)
        const entretienData = response.data;
        setStartHour(entretienData.heure_debut);
        setEndHour(entretienData.heure_fin);
        setDate(entretienData.date);
        setResultat(entretienData.resultat);
        setCandidaure(entretienData.candidature);
        setCoordinateur(entretienData.coordinateur);
        
        
        
      })
      .catch((error) => {
        console.error("Error fetching candidature data:", error);
      });
  }, [id]);

  const handleAddSubmit = (event) => {
    event.preventDefault();

    const formData = {
        startHour,
        endHour,
        date,
        resultat:resultat,
        candidature,
        coordinateur,
    };

    axios.put(`http://127.0.0.1:8000/api/updateEntretien/${id}/`, formData)
      .then((response) => {
        console.log("Entretien was successfully updated!");
        console.log(response.data);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Update failed", error);
        if (error.response) {
          console.log("Error response data:", error.response.data);
        }
      });
  };
  

  return (
    <>
      <Back title="Ajouter le résultat de l'entretien" />
      <section className='contacts padding'>
        <div className='container shadow' style={{height:'500px'}}>
          <div className='left row'><br/><br/><br/><br/>
            <h1>Adjoindre le résultat de l'entretien</h1>
            <form onSubmit={handleAddSubmit}>
            <div className='form-field'>
              <p> Veuillez entrer le résultat de l'entretien</p>
              <select
                name='resultat'
                value={resultat}
                onChange={(e) => setResultat(e.target.value)}
                id='resultat'
              >
                <option value='accepte'>Accepté</option>
                <option value='en_attente'>En attente</option>
                <option value='refuse'>Refusé</option>
              </select>
            </div>
              <button className='primary-btn' type='submit'>
                Confirmer les modifications
              </button>
              
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
