import React, { useContext, useState } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './UserContext';

export default function AddEntretien() {
  const { id } = useParams();
  const [heureDebut, setHeureDebut] = useState('12:00');
  const [heureFin, setHeureFin] = useState('12:30');
  const [date, setDate] = useState('');
  let navigate = useNavigate();

  // Access the user context
  const { user } = useContext(UserContext);
  const idUser = user ? user.id : null;

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    // Formatage de la date en "YYYY-MM-DD"
    const formattedDate = date.split('/').reverse().join('-');

    const formData = {
      heure_debut: heureDebut,
      heure_fin: heureFin,
      date: formattedDate,
      candidature: id, // Set the candidature ID
      coordinateur: idUser, // Set the coordinator ID
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/entretien/add/', formData);
      console.log('Entretien ajouté avec succès', response.data);
      navigate(-1);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'entretien', error);
    }
  };

  return (
    <>
      <Back title='Add offer here' />
      <section className='contacts padding'>
        <div className='container shadow'>
          <div className='left row'>
            <h1>Fixer un entretien</h1>
            <form onSubmit={handleAddSubmit}>
              <div className='form-field'>
                <div className='input-container'>
                  <p>Heure du début de l'entretien</p>
                  <input
                    type='time'
                    value={heureDebut}
                    onChange={(e) => setHeureDebut(e.target.value)}
                  />
                </div>
              </div>
              <div className='form-field'>
                <div className='input-container'>
                  <p>Heure de fin de l'entretien</p>
                  <input
                    type='time'
                    value={heureFin}
                    onChange={(e) => setHeureFin(e.target.value)}
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
              
              <button className='primary-btn' type='submit'>Ajouter</button>
              <button className='primary-btn' type='button' onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Retour
      </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
