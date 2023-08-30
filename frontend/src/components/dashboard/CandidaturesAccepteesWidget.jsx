import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CandidaturesAccepteesWidget = ({ offerId }) => {
  const [candidatureCount, setCandidatureCount] = useState(0);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/candidatures_acceptees/${offerId}/`)
      .then(response => {
        const data = response.data.nombre_candidatures_acceptees;
        setCandidatureCount(data);
      })
      .catch(error => {
        console.error('Error fetching candidature count:', error);
      });
  }, [offerId]);

  return (
    <div>
      <h3 style={{ fontFamily: 'Arial', 
  fontSize: '20px',
  color: '#333',
  letterSpacing: '1px',
  padding: '10px',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  marginBottom: '-10px'}}>Nombre de candidatures acceptées</h3>
      <p style={{ fontSize: '22px', marginTop: '6px'}}>
        {candidatureCount} {candidatureCount === 1 ? 'candidature acceptée' : 'candidatures acceptées'}</p>
    </div>
  );
};

export default CandidaturesAccepteesWidget;
