import React, { useContext,  useState } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import { Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './UserContext';
import axios from "axios";
import qs from 'qs';
export default function AddOffre() {

  const [offres, setOffres] = useState([]);
  const [profiles, setProfiles] = useState([]); // Ajoutez cette ligne pour déclarer l'état des profils
  const [addedOffreId, setAddedOffreId] = useState(null);

  const [statut, setStatut] = useState('Ouvert');
  const [typeEmploi, setTypeEmploi] = useState('Permanent');
  const { user } = useContext(UserContext);
  console.log("Current user:", user); // Vérifier si l'utilisateur est correctement récupéré du contexte

  const handleAddSubmit = (event) => {
    event.preventDefault();

    // Récupérer les valeurs des champs de saisie
    const titreDuPoste = event.target.titreDuPoste.value;
    const description = event.target.description.value;
    const competences = event.target.competences.value;
    const entreprise = event.target.entreprise.value;
    const localisation = event.target.localisation.value;

    // Créer un objet pour contenir les données de l'offre
    const formData = {
      titreDuPoste: titreDuPoste,
      description: description,
      competences: competences,
      entreprise: entreprise,
      localisation: localisation,
      statut: statut,
      typeEmploi: typeEmploi,
      coordinateur: user ? user.id : undefined, // Utiliser l'ID de l'utilisateur s'il est connecté, sinon laisser la valeur par défaut (undefined)
    };

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data', // Spécifier le bon type de contenu pour les données de formulaire
      },
    };

    // Envoyer les données de l'offre via Axios
    axios
      .post(`http://127.0.0.1:8000/api/addOffre/`, formData, config)
      .then((response) => {
        setOffres(response.data);
        setAddedOffreId(response.data.id); // Mettre à jour l'ID de l'offre ajoutée
       

        // Récupérer l'ID de l'offre ajoutée depuis la réponse de l'API
        const addedOffreId = response.data.id;

        // Gérer la réussite de l'ajout de l'offre
        console.log('Offre ajoutée avec succès !');
        console.log('ID de l\'offre ajoutée:', addedOffreId);
        console.log(response.data);
        // Effectuer la recherche LinkedIn en utilisant les données de formulaire
      const linkedInFormData = {
        profile_to_search: titreDuPoste,
        username: 'gharbimonia08@gmail.com',
        password: '21285728',
        offre: addedOffreId,
      };

      axios
        .post(
          `http://127.0.0.1:8000/api/login_to_linkedin/`,
          qs.stringify(linkedInFormData), // Utiliser qs.stringify pour convertir les données en format de formulaire
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then((response) => {
          setProfiles(response.data.profiles_data);
          console.log('API Response:', response.data);
        })
        .catch((error) => {
          console.error('Erreur lors de la recherche LinkedIn:', error);
        });
    

      })
      .catch((error) => {
        // Gérer les erreurs
        console.error('Quelque chose s\'est mal passé !', error);
        // Vous pouvez également afficher un message d'erreur à l'utilisateur.
        if (error.response) {
          console.log('Erreur de réponse:', error.response.data); // Journaliser les données de la réponse d'erreur
        }
      });
  };



  return (
    <>
      <Back title='Ajouter une offre' />
      <section className='contacts padding'>
        <div className='container shadow'>
          <div className='left row'>
            <h1>Ajouter une offre</h1>

            <form onSubmit={handleAddSubmit}>
            
              <div className='form-field'>

                <div className='input-container'>
                <input type='text' placeholder='Titre Du Poste' name='titreDuPoste' id='titreDuPoste' required/>
                </div>
              </div>

              
              <div className='form-field'>
                
                <input type='text' placeholder='Competences' name='competences' id='competences' required/>
              </div>

              <div className='form-field'>
              
                <input type='text' placeholder='Entreprise' name='entreprise' id='entreprise' required/>
              </div>

              <div className='form-field'>
             
                <input type='text' placeholder='Localisation' name='localisation' id='localisation' required/>
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
                <textarea cols='30' rows='10' placeholder='Description' name='description' id='description'required>
                
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
