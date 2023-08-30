// components/CandidatureWidget.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LikesWidget = ({ offerId }) => {
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/like_count/${offerId}/`)
      .then(response => {
        const count = response.data.count;
        setLikeCount(count);

      })
      .catch(error => {
        console.error('Error fetching candidature count:', error);
      });
  }, [offerId]);

  return (
    <div>
      <h3>Nombre de " J'aime "</h3>
      <p style={{ fontSize: '22px', marginTop: '6px'}}>{likeCount}  J'aime</p>
    </div>
    
  );
};

export default LikesWidget;
