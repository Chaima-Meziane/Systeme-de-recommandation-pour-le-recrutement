// components/CandidatureWidget.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const EntretienWidget = ({ offerId }) => {
  const [entretienCount, setEntretienCount] = useState(0);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/entretien_count/${offerId}/`)
      .then(response => {
        const count = response.data.count;
        setEntretienCount(count);

      })
      .catch(error => {
        console.error('Error fetching candidature count:', error);
      });
  }, [offerId]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '8px', marginLeft: '2px' }}>
        <FontAwesomeIcon icon={faUserTie} style={{ color: 'rgba(0, 0, 0, 0.4)', fontSize: '39px' }} />
      </div>
      <div>
        <h3 style={{ fontSize: '23px', marginLeft: '14px' }}>Nombre d'entretiens</h3>
        <p style={{ fontSize: '21px', margin: '6px 14px' }}>
        {entretienCount} {entretienCount === 1 ? 'entretien' : 'entretiens'}
        </p>
      </div>
    </div>
    
    
  );
};

export default EntretienWidget;
