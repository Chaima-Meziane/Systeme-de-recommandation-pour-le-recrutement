import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { getoffrebyid } from "../services/ApiService";
import './blog/blog.css';

const CandidaturesByOffers = ({ match }) => {
  const { id } = useParams();
  const [candidatures, setCandidatures] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/candidatures/offre/${id}/`)
      .then(response => {
        setCandidatures(response.data);
      })
      .catch(error => {
        console.error('Error fetching candidatures:', error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
   // Log the candidatures data
   console.log('Candidatures data:', candidatures);

  return (
    <div>
      
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : candidatures.length === 0 ? (
        <div>Aucune candidature pour cette offre.</div>
      ) : (
        <div className="candidature-list"> {/* Ajoutez une classe pour le conteneur */}
          {candidatures.map(candidature => (
  <div key={candidature.id} className="candidature">
    <p>Etat: {candidature.etat}</p>
    {candidature.candidat && (
      <div>
        <p>Nom du candidat : {candidature.candidat.first_name} {candidature.candidat.last_name}</p>
        <p>Téléphone: {candidature.candidat.phone_number}</p>
        <p>Adresse: {candidature.candidat.address}</p>
        {candidature.candidat.resume && (
          <a
            href={`http://localhost:8000${candidature.candidat.resume}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir le CV du candidat
          </a>
        )}
      </div>
    )}
    
    {candidature.lettre_de_motivation && (
      <a
        href={`http://localhost:8000${candidature.lettre_de_motivation}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Voir la lettre de motivation
      </a>
    )}
  </div>
))}
        </div>
      )}
    </div>
  );
};

export default CandidaturesByOffers;