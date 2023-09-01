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
  const [lien_reunion, setlien_reunion] = useState('');

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
        setlien_reunion(entretienData.lien_reunion);

        
        
        
      })
      .catch((error) => {
        console.error("Error fetching candidature data:", error);
      });
  }, [id]);

  const handleAddSubmit = (event) => {
    event.preventDefault();

    const formData = {
        heure_debut:startHour,
        heure_fin:endHour,
        date,
        resultat,
        candidature,
        coordinateur,
        lien_reunion,
    };

    axios.put(`http://127.0.0.1:8000/api/updateEntretien/${id}/`, formData)
      .then((response) => {
        console.log("Entretien was successfully updated!");
        console.log(response.data);
        navigate('/calendar')
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
      <Back title="Reporter l'entretien" />
      <section className='contacts padding'>
        <div className='container shadow' style={{height:'680px'}}>
          <div className='left row'>
            <br/><br/><h1>Reporter l'entretien</h1>
            <form onSubmit={handleAddSubmit}>
            <div className='form-field'>
                <div className='input-container'>
                  <p>Heure du début de l'entretien</p>
                  <input
                    type='time'
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                  />
                </div>
              </div>
              <div className='form-field'>
                <div className='input-container'>
                  <p>Heure de fin de l'entretien</p>
                  <input
                    type='time'
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                  />
                </div>
              </div>
              <div className='form-field'>
                <div className='input-container'>
                  <p>Date de l'entretien</p>
                  <input
                    type='date'
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
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
