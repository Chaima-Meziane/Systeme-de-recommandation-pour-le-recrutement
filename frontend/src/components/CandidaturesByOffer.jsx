import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

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
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="candidature-list">
          {candidatures.map(candidature => (
            <div key={candidature.id} className="candidature">
              <p>Score: {candidature.score}</p>
              <p>Etat: {candidature.etat}</p>
              {candidature.candidat && (
                <div>
                  <p>Nom du candidat: {candidature.candidat.first_name} {candidature.candidat.last_name}</p>
                  <p>Téléphone: {candidature.candidat.phone_number}</p>
                  <p>Adresse: {candidature.candidat.address}</p>
                  <p>Email: {candidature.candidat.email}</p>
                  {candidature.candidat.resume && (
                    <div>
                      <a href={`http://localhost:8000${candidature.candidat.resume}`} target="_blank" rel="noopener noreferrer">
                        Voir le CV du candidat
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              {candidature.lettre_de_motivation && (
                <a href={`http://localhost:8000${candidature.lettre_de_motivation}`} target="_blank" rel="noopener noreferrer">
                  Voir la lettre de motivation
                </a>
              )}
              <Link to={`/updateCandidature/${candidature.id}`}><button className='outline-btn'>Modifier l'état de la candidature</button></Link>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidaturesByOffers;
