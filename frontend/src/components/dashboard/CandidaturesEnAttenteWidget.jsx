import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock as farClock } from '@fortawesome/free-regular-svg-icons';  // Use the "far" version of the clock icon
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
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FontAwesomeIcon icon={farClock} style={{ fontSize: '26px', marginRight: '20px', color: 'grey', marginLeft:'5px' }} />
      <div>
        <h3 style={{ fontFamily: 'Arial', fontSize: '20px', color: '#333', letterSpacing: '1px', padding: '10px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', marginBottom: '-10px' }}>Nombre de candidatures en attente</h3>
        <p style={{ fontSize: '22px', marginTop: '6px', marginLeft:'7px' }}>
          {candidatureCount} {candidatureCount === 1 ? 'candidature en attente' : 'candidatures en attente'}
        </p>
      </div>
    </div>
  );
};

export default CandidaturesEnAttenteWidget;
