import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const CustomEvent = ({ event }) => {
  const [candidatureData, setCandidatureData] = useState({});
  const [offreData, setOffreData] = useState({});
  const [candidatData, setCandidatData] = useState({});


  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/getCandidatureByID/${event.candidature}/`)
      .then((response) => {
        const data = response.data;
        setCandidatureData(data);
        if (data.offre) {
          axios.get(`http://127.0.0.1:8000/api/getOffreByID/${data.offre}`)
            .then((response) => {
              const offre = response.data;
              setOffreData(offre);
            })
            .catch((error) => {
              console.error("Error fetching offre data:", error);
            });
        }
        if (data.candidat) {
          axios.get(`http://127.0.0.1:8000/api/getUserByID/${data.candidat}`)
            .then((response) => {
              const candidat = response.data;
              setCandidatData(candidat);
            })
            .catch((error) => {
              console.error("Error fetching candidat data:", error);
            });
        }
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
      {/*<div>{`Candidature: ${event.candidature}`}</div>*/}
      <div>{`Offre: ${offreData.titreDuPoste}`}</div>
      <div>{`Candidat: ${candidatData.first_name} ${candidatData.last_name}`}</div>
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
