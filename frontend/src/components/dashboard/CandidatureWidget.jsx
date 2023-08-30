// components/CandidatureWidget.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CandidatureWidget = ({ offerId }) => {
  const [candidatureCount, setCandidatureCount] = useState(0);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/candidature_count/${offerId}/`)
      .then(response => {
        const count = response.data.count;
        console.log(count)
        setCandidatureCount(count);

      })
      .catch(error => {
        console.error('Error fetching candidature count:', error);
      });
  }, [offerId]);

  return (
    <div>
      <h3>Nombre de candidatures</h3>
      <p style={{ fontSize: '22px', marginTop: '6px'}}>
        {candidatureCount} {candidatureCount === 1 ? 'candidature' : 'candidatures'}</p>
    </div>
    
  );
};

export default CandidatureWidget;
