import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Dashboard.css'

export function CandidatureHistogram({ offerId }) {
  const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/candidatures_by_day/${offerId}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [offerId]);

  const filterDataByMonthAndYear = (month) => {
    return data.filter(entry =>
      new Date(entry.date).getMonth() === month && new Date(entry.date).getFullYear() === currentYear
    );
  };

  const generateDateLabels = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  };

  const months = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  const filteredData = filterDataByMonthAndYear(currentMonth);

  const dailyCandidatures = new Array(31).fill(0);
  filteredData.forEach(entry => {
    const day = new Date(entry.date).getDate();
    dailyCandidatures[day - 1] = entry.candidature_count;
  });

  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => (prevMonth - 1 + 12) % 12);
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => (prevMonth + 1) % 12);
  };

  return (
    <div>
      <div className="titre-dash"><h2>Nombre De Candidatures Par Jour</h2></div>
      
      <div className="button-container-dash">
        <button onClick={goToPreviousMonth}>◀</button>
        <span className="month">{months[currentMonth]}</span>
        <button onClick={goToNextMonth}>▶</button>
      </div>
      <BarChart width={800} height={400} data={dailyCandidatures.map((count, index) => ({ jour: index + 1, "Nombre de candidatures": count }))}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="jour" tickLine={false} tick={{ fontSize: 12 }} label={{ value: 'Jour', position: 'insideTopRight', offset: 20 }} />
        <YAxis />
        <Tooltip />
        <Legend fill="#1eb2a6"/>
        <Bar dataKey="Nombre de candidatures" fill="#1eb2a6" barSize={20} name="Nombre de candidatures" />
      </BarChart>
      
    </div>
  );
}
