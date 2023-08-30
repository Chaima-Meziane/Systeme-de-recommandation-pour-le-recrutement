import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import {faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function DoughnutChart({ offerId }) {
  const [candidatureSummary, setCandidatureSummary] = useState([]);
  useEffect(() => {
    // Replace 'OFFER_ID' with the actual offer id you want to fetch data for
    axios
      .get(`http://127.0.0.1:8000/api/candidature-summary/${offerId}/`)
      .then((response) => {
        setCandidatureSummary(response.data.candidature_summary);
        console.log(response.data.candidature_summary)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [offerId]);

  const chartData = [
    ["Etat", "Count"],
    ...candidatureSummary.map((item) => [item.etat, item.count]),
  ];
  const options = {
    pieHole: 0.4,
    is3D: false,
  };
  
  return (<><div className="titre-dash"><h2>Répartition des Candidatures par État</h2></div><br/>
    <Chart
      chartType="PieChart"
      width="100%"
      height="400px"
      data={chartData}
      options={options}
      loader={<div className="loading-container">
      <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '80px', color: '#1eb2a6', marginLeft: '480px' }} />
      <br /><br />5
      <div style={{ fontSize: '20px', color: 'grey', marginLeft: '400px' }}> Veuillez patienter un instant</div><br /><br />
    </div>}
    /></>
  );
}