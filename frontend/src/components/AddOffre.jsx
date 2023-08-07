import React, { useEffect, useState } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import { addoffre, getoffre } from '../services/ApiService';
import { Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function AddOffre() {
  const [offres, setOffres] = useState([]);

  const [statut, setStatut] = useState('Ouvert');
  const [typeEmploi, setTypeEmploi] = useState('Permanent');

  const handleAddSubmit=(e)=>{
    e.preventDefault();
    addoffre(e.target)
    .then(res=>{
        setOffres(res)
        window.location.reload()
        console.log('Offer added successfully:', res); //ne s'affiche pas!!
      
    })
    .catch((error) => {
      console.error('Error adding offer:', error);

    })
}


  return (
    <>
      <Back title='Add offer here' />
      <section className='contacts padding'>
        <div className='container shadow'>
          <div className='left row'>
            <h1>Ajouter une offre</h1>

            <form onSubmit={handleAddSubmit}>
            
              <div className='form-field'>
                
                <div className='input-container'>
                <input type='text' placeholder='Titre Du Poste' name='titreDuPoste' id='titreDuPoste' />
                </div>
              </div>

              
              <div className='form-field'>
                
                <input type='text' placeholder='Competences' name='competences' id='competences' />
              </div>

              <div className='form-field'>
              
                <input type='text' placeholder='Entreprise' name='entreprise' id='entreprise' />
              </div>

              <div className='form-field'>
             
                <input type='text' placeholder='Localisation' name='localisation' id='localisation' />
              </div>

              <div className='form-field'>
           
                <select name='statut' value={statut} onChange={(e) => setStatut(e.target.value)} id='statut'>
                  <option value='Ouvert'>Ouvert</option>
                  <option value='Fermé'>Fermé</option>
                </select>
              </div>

              <div className='form-field'>
          
                <select name='typeEmploi' value={typeEmploi} onChange={(e) => setTypeEmploi(e.target.value)} id='typeEmploi'>
                  <option value='Temporaire'>Temporaire</option>
                  <option value='Permanent'>Permanent</option>
                </select>
              </div>
              <div className='form-field'>
                <textarea cols='30' rows='10' placeholder='Description' name='description' id='description'>
                
              </textarea>
              </div>
             
              <button className='primary-btn' type='submit'>Ajouter</button>
              
              <Link to="/offre">
              <button className='primary-btn' type='submit'>
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
