import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';

const CandidatureWidget = ({ offerId }) => {
  const [candidatureCount, setCandidatureCount] = useState(0);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/candidature_count/${offerId}/`)
      .then(response => {
        const count = response.data.count;
        setCandidatureCount(count);
      })
      .catch(error => {
        console.error('Error fetching candidature count:', error);
      });
  }, [offerId]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '8px', marginLeft:'2px' }}>
        <FontAwesomeIcon icon={faBriefcase} style={{ color: 'rgba(0, 0, 0, 0.4)', fontSize: '36px' }} />
      </div>
      <div>
        <h3 style={{ fontSize: '23px', marginLeft:'14px' }}>Nombre de candidatures</h3>
        <p style={{ fontSize: '21px', margin: '6px 14px'}}>
          {candidatureCount} {candidatureCount === 1 ? 'candidature' : 'candidatures'}
        </p>
      </div>
    </div>
  );
};

export default CandidatureWidget;
