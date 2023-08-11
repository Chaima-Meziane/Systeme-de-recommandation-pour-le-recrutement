import React, { useContext, useState, useEffect } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './UserContext';
import axios from 'axios';

export default function UpdateOffre() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  let navigate = useNavigate();

  const [titreDuPoste, setTitreDuPoste] = useState('');
  const [description, setDescription] = useState('');
  const [competences, setCompetences] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [statut, setStatut] = useState('');
  const [typeEmploi, setTypeEmploi] = useState('');

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/getOffreByID/${id}/`)
      .then((response) => {
        const offerData = response.data;
        setTitreDuPoste(offerData.titreDuPoste);
        setDescription(offerData.description);
        setCompetences(offerData.competences);
        setEntreprise(offerData.entreprise);
        setLocalisation(offerData.localisation);
        setStatut(offerData.statut); // Set the retrieved value
        setTypeEmploi(offerData.typeEmploi); // Set the retrieved value
      })
      .catch((error) => {
        console.error("Error fetching offer data:", error);
      });
  }, [id]);

  const handleAddSubmit = (event) => {
    event.preventDefault();

    const formData = {
      titreDuPoste,
      description,
      competences,
      entreprise,
      localisation,
      statut,
      typeEmploi,
      coordinateur: user ? user.id : undefined,
    };

    axios.put(`http://127.0.0.1:8000/api/updateOffre/${id}/`, formData)
      .then((response) => {
        console.log("Offer was successfully updated!");
        console.log(response.data);
        navigate(`/owner/details/${id}`);
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
      <Back title='Add offer here' />
      <section className='contacts padding'>
        <div className='container shadow'>
          <div className='left row'>
            <h1>Modifier une offre</h1>

            <form onSubmit={handleAddSubmit}>
              <div className='form-field'>
                <div className='input-container'>
                  <p> Titre du poste</p>
                  <input
                    type='text'
                    placeholder='Titre Du Poste'
                    name='titreDuPoste'
                    id='titreDuPoste'
                    value={titreDuPoste}
                    onChange={(e) => setTitreDuPoste(e.target.value)}
                  />
                </div>
              </div>
              <div className='form-field'>
                <p> Compétences requises</p>
                <input
                  type='text'
                  placeholder='Competences'
                  name='competences'
                  id='competences'
                  value={competences}
                  onChange={(e) => setCompetences(e.target.value)}
                />
              </div>
              <div className='form-field'>
                <p> Entreprise</p>
                <input
                  type='text'
                  placeholder='Entreprise'
                  name='entreprise'
                  id='entreprise'
                  value={entreprise}
                  onChange={(e) => setEntreprise(e.target.value)}
                />
              </div>
              <div className='form-field'>
                <p>Localisation</p>
                <input
                  type='text'
                  placeholder='Localisation'
                  name='localisation'
                  id='localisation'
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                />
              </div>
              <div className='form-field'>
                <p> Statut</p>
                <select
                  name='statut'
                  value={statut}
                  onChange={(e) => setStatut(e.target.value)}
                  id='statut'
                >
                  <option value='Ouvert'>Ouvert</option>
                  <option value='Fermé'>Fermé</option>
                </select>
              </div>
              <div className='form-field'>
                <p> Type d'emploi</p>
                <select
                  name='typeEmploi'
                  value={typeEmploi}
                  onChange={(e) => setTypeEmploi(e.target.value)}
                  id='typeEmploi'
                >
                  <option value='Temporaire'>Temporaire</option>
                  <option value='Permanent'>Permanent</option>
                </select>
              </div>
              <div className='form-field'>
                <p> Description</p>
                <textarea
                  cols='30'
                  rows='10'
                  placeholder='Description'
                  name='description'
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button className='primary-btn' type='submit'>
                Confirmer les modifications
              </button>
              <Link to='/offre'>
                <button className='primary-btn'>
                  <FontAwesomeIcon icon={faArrowLeft} /> Retour
                </button>
              </Link>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
