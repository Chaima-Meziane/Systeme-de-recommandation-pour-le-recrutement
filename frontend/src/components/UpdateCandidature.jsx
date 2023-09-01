import React, { useContext, useState, useEffect } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './UserContext';
import axios from 'axios';

export default function UpdateCandidature() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [etat, setEtat] = useState('');
  const [candidat, setCandidat] = useState('');
  const [offre, setOffre] = useState('');
  const [lettre, setLettre] = useState('');

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/getCandidatureByID/${id}/`)
      .then((response) => {
        //console.log(response.data)
        const candidatureData = response.data;
        setLettre(candidatureData.lettre_de_motivation);
        setEtat(candidatureData.etat);
        setCandidat(candidatureData.candidat);
        setOffre(candidatureData.offre)
        
        
      })
      .catch((error) => {
        console.error("Error fetching candidature data:", error);
      });
  }, [id]);

  const handleAddSubmit = (event) => {
    event.preventDefault();

    const formData = {

        lettre,
        etat,
        candidat,
        offre
    };

    axios.put(`http://127.0.0.1:8000/api/updateCandidature/${id}/`, formData)
      .then((response) => {
        console.log("Candidature was successfully updated!");
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
      <Back title="Modifier l'état de la candidature" />
      <section className='contacts padding'>
        <div className='container shadow' style={{height:'500px'}}>
          <div className='left row'>
            <br/><br/><h1 style={{ fontSize:'28px'}}>Modifier l'état de la candidature</h1>
            <form onSubmit={handleAddSubmit}>
            <div className='form-field'>
                <p> Identifiant de l'offre: {offre} </p>
            </div>
            
            <div className='form-field'>
                <p> Identifiant du candidat: {candidat} </p>
            </div>

              <div className='form-field'>
                <p>État de la candidature</p>
                <select
                  name='etat'
                  value={etat}
                  onChange={(e) => setEtat(e.target.value)}
                  id='etat'
                >
                  <option value='En attente'>En attente</option>
                  <option value='Acceptée'>Acceptée</option>
                  <option value='Rejetée'>Rejetée</option>
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
