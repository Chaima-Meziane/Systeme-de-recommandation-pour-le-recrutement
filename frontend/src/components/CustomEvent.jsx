import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const CustomEvent = ({ event }) => {
  const [candidatureData, setCandidatureData] = useState({});

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/getCandidatureByID/${event.candidature}/`)
      .then((response) => {
        const data = response.data;
        setCandidatureData(data);
      })
      .catch((error) => {
        console.error("Error fetching candidature data:", error);
      });
  }, [event.candidature]);

  // Format time to hh:mm
  const formattedStartTime = moment(event.heure_debut, "HH:mm:ss").format("HH:mm");
  const formattedEndTime = moment(event.heure_fin, "HH:mm:ss").format("HH:mm");

  return (
    <div>
      <div>{`Candidature: ${event.candidature}`}</div>
      <div>{`Offre: ${candidatureData.offre}`}</div>
      <div>{`Candidat: ${candidatureData.candidat}`}</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span role="img" aria-label="Clock">⏰</span> {/* Simple clock emoji */}
        <span style={{ marginLeft: '8px', fontSize: '14px' }}>
          {`${formattedStartTime} - ${formattedEndTime}`}
        </span>
        
      </div>
    </div>
  );
};

export default CustomEvent;
