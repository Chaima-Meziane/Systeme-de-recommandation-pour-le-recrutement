import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Heading from './common/heading/Heading'; 
import '../components/home/testimonal/style.css';
import Back from "./common/back/Back";
import {faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const CandidaturesByOffers = () => {
  const { id } = useParams();
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/get_sorted_candidatures/${id}/`)
      .then(response => {
        setCandidatures(response.data.sorted_candidatures);
      })
      .catch(error => {
        console.error('Error fetching candidatures:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <>
  <Back title={`Candidatures`} />
  <div>
    {loading ? (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '80px', color: '#1eb2a6', marginLeft: '800px' }} />
        <br /><br />5
        <div style={{ fontSize: '20px', color: 'grey', marginLeft: '720px' }}> Veuillez patienter un instant</div><br /><br />
      </div>
    ) : (
      <section className='testimonal padding'>
        <div className='container'>
          <Heading subtitle='Candidatures' title='Liste des candidatures' />

          <div className='content grid2'>
            {candidatures.map(candidature => (
              <div className='items shadow' key={candidature.id}>
                <div className='box flex'>
                  <div className='name'>
                    <h2>Candidature n° {candidature.id}</h2>
                    <br />
                    <span>Score : {candidature.score}</span><br /><br />
                    <span>Etat : {candidature.etat}</span><br /><br />
                  </div>
                </div>
                {candidature.candidat && (
                  <div>
                    <h2 id='nom'>Nom du candidat: {candidature.candidat.first_name} {candidature.candidat.last_name}</h2>
                    <p>Téléphone: {candidature.candidat.phone_number}</p>
                    <p>Adresse: {candidature.candidat.address}</p>
                    <p>Email: {candidature.candidat.email}</p><br />
                    {candidature.candidat.resume && (
                      <div>
                        <a href={`http://localhost:8000${candidature.candidat.resume}`} target="_blank" rel="noopener noreferrer">
                          Voir le CV du candidat
                        </a>
                      </div>
                    )}
                  </div>
                )}
                <br />

                {candidature.lettre_de_motivation && (
                  <div>
                    <a href={`http://localhost:8000${candidature.lettre_de_motivation}`} target="_blank" rel="noopener noreferrer">
                      Voir la lettre de motivation
                    </a>
                  </div>
                )}
                <br /><br />
                <Link to={`/updateCandidature/${candidature.id}`}>
                  <button className='outline-btn'>Modifier l'état de la candidature</button>
                </Link>
                <br /><br />
                <Link to={`/addentretien/${candidature.id}`}>
                  <button className='outline-btn'>Fixer un entretien</button>
                </Link>

              </div>
            ))}
          </div>
        </div>
      </section>
    )}
  </div>
</>

  );};

export default CandidaturesByOffers;
