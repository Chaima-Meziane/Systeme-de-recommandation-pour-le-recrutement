// components/CandidatureWidget.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
    <h3>Nombre d'entretiens</h3>
    <p style={{ fontSize: '22px', marginTop: '6px'}}>
        {entretienCount} {entretienCount === 1 ? 'entretien' : 'entretiens'}
    </p>
    </div>

    
  );
};

export default EntretienWidget;
