import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LikesCandidaturesLineChart = ({ offerId }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const likesResponse = await axios.get(`http://127.0.0.1:8000/api/likeshistogram/${offerId}/`);
        const candidaturesResponse = await axios.get(`http://127.0.0.1:8000/api/candidatures_by_day/${offerId}/`);

        const likesData = likesResponse.data.map(entry => ({
          date: entry.date,
          likes: entry.count,
        }));

        const candidaturesDataArray = candidaturesResponse.data;

        console.log('Likes Data:', likesData);
        console.log('Candidatures Data Array:', candidaturesDataArray);

        const uniqueDatesSet = new Set([...likesData.map(entry => entry.date), ...candidaturesDataArray.map(entry => entry.date)]);
        const uniqueDatesArray = Array.from(uniqueDatesSet);

        const combinedData = uniqueDatesArray.map(date => {
          const matchingLikesEntry = likesData.find(entry => entry.date === date);
          const matchingCandidaturesEntry = candidaturesDataArray.find(entry => entry.date === date);

          return {
            date: date,
            likes: matchingLikesEntry ? matchingLikesEntry.likes : 0,
            candidatures: matchingCandidaturesEntry ? matchingCandidaturesEntry.candidature_count : 0,
          };
        });

        console.log('Combined Data:', combinedData);

        setChartData(combinedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [offerId]);

  return (
    <div><br/>
      <div style={{ fontSize: '17px' }} className="titre-dash"><h2>Répartition des Candidatures par État</h2></div><br/><br/><br/><br/>
      {loading ? ( // Check if loading
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '80px', color: '#1eb2a6', marginLeft: '550px' , marginTop:'150px'}} />
          <br /><br />
          <div style={{ fontSize: '20px', color: 'grey', marginLeft: '470px' }}> Veuillez patienter un instant</div><br /><br />
        </div>
      ) : (
        <LineChart style={{ marginLeft: '40px' }} width={1050} height={400} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={tick => Number.isInteger(tick) ? tick.toFixed(0) : ''} /> {/* Format tick values */}
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="likes" stroke="#ff4081" strokeWidth={5} name="Nombre de J'aime" /> {/* Increase strokeWidth */}
          <Line type="monotone" dataKey="candidatures" stroke="dodgerblue" strokeWidth={5} name="Nombre de candidatures" /> {/* Increase strokeWidth */}
        </LineChart>
      )}
    </div>
  );
};
export default LikesCandidaturesLineChart;
