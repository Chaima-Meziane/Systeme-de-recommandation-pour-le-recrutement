import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LikesWidget = ({ offerId }) => {
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/like_count/${offerId}/`)
      .then(response => {
        const count = response.data.count;
        setLikeCount(count);
      })
      .catch(error => {
        console.error('Error fetching like count:', error);
      });
  }, [offerId]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '8px', marginLeft: '2px' }}>
        <FontAwesomeIcon icon={faThumbsUp} style={{ color: 'rgba(0, 0, 0, 0.4)', fontSize: '39px' }} />
      </div>
      <div>
        <h3 style={{ fontSize: '23px', marginLeft: '14px' }}>Nombre de "J'aime"</h3>
        <p style={{ fontSize: '21px', margin: '6px 14px' }}>
          {likeCount} J'aime
        </p>
      </div>
    </div>
  );
};

export default LikesWidget;
