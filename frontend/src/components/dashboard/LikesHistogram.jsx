import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ReferenceLine } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css'

const LikesHistogram = ({ offerId }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  useEffect(() => {
    async function fetchLikesData() {
      setIsLoading(true);

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/likeshistogram/${offerId}/`);
        console.log(response.data);

        const filteredData = response.data.filter(entry => {
          const entryDate = new Date(entry.date);
          const entryMonth = entryDate.getMonth() + 1;
          const entryYear = entryDate.getFullYear();
          return entryMonth === selectedMonth && entryYear === selectedYear;
        });

        const groupedData = {};
        filteredData.forEach(entry => {
          const date = new Date(entry.date).getDate();
          if (!groupedData[date]) {
            groupedData[date] = 0;
          }
          groupedData[date] += entry.count;
        });

        const formattedData = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, day) => {
          const date = day + 1;
          return {
            date,
            count: groupedData[date] || 0,
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching likes data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLikesData();
  }, [offerId, selectedMonth, selectedYear]);

  const handleMonthChange = (month) => {
    let newMonth = month;
    let newYear = selectedYear;

    if (newMonth === 0) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth === 13) {
      newMonth = 1;
      newYear += 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const monthNames =[
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

  return (
    <div>
      {isLoading ? ( // Check if loading
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '80px', color: '#1eb2a6', marginLeft: '480px' }} />
          <br /><br />
          <div style={{ fontSize: '20px', color: 'grey', marginLeft: '400px' }}> Veuillez patienter un instant</div><br /><br />
        </div>
      ) : (
        <div>
          <div className="titre-dash"><h2>Fréquence Quotidienne Des "J'aime"</h2></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '80px', marginRight: '80px' }}>
  <div>
    <button className="button-like-dash" onClick={() => handleMonthChange(selectedMonth - 1)}>◀</button>
    <span> {monthNames[selectedMonth - 1]}</span>
    {selectedMonth !== currentDate.getMonth() + 1 && (
      <button className="button-like-dash" onClick={() => handleMonthChange(selectedMonth + 1)}>▶</button>
    )}
  </div>
  <div>
    <button className="button-like-dash" onClick={() => handleYearChange(currentDate.getFullYear() - 1)}> ◀</button>
    <span> {selectedYear}</span>
    {selectedYear !== currentDate.getFullYear() && (
      <button className="button-like-dash" onClick={() => handleYearChange(currentDate.getFullYear())}>Cette Année</button>
    )}
  </div>
</div>

<BarChart width={1150} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" label={{ value: 'Jour', position: 'insideTopRight', offset: 20 }} tick={{ fontSize: 12 }} tickLabel={{ fontSize: 10 }} /> {/* Adjust label and tick font sizes */}
          <YAxis tickCount={5} tickFormatter={tick => Number.isInteger(tick) ? tick.toFixed(0) : ''} /> {/* Format tick values */}
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#a7c0ff" name="Nombre de j'aime" />
          <ReferenceLine x={currentDate.getDate()} stroke="red" label="Aujourd'hui" />
        </BarChart>
        </div>
      )}
    </div>
  );
};

export default LikesHistogram;

