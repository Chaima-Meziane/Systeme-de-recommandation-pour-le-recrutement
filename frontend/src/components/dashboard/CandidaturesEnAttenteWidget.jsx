import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CandidaturesEnAttenteWidget = ({ offerId }) => {
  const [candidatureCount, setCandidatureCount] = useState(0);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/candidatures_en_attente/${offerId}/`)
      .then(response => {
        const data = response.data.nombre_candidatures_en_attente;
        setCandidatureCount(data);
      })
      .catch(error => {
        console.error('Error fetching candidature count:', error);
      });
  }, [offerId]);

  return (
    <div>
      <h3>Nombre de candidatures en attente</h3>
      <p style={{ fontSize: '22px', marginTop: '6px'}}>
        {candidatureCount} {candidatureCount === 1 ? 'candidature en attente' : 'candidatures en attente'}</p>
    </div>
  );
};

export default CandidaturesEnAttenteWidget;
