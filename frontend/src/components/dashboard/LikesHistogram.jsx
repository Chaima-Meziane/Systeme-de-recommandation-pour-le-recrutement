import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ReferenceLine } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


const LikesHistogram = ({ offerId }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1); // Months are 0-indexed
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
    useEffect(() => {
      async function fetchLikesData() {
        setIsLoading(true); // Start loading
  
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/likeshistogram/${offerId}/`);
          console.log(response.data)
  
          // Filter data by the selected month and year
          const filteredData = response.data.filter(entry => {
            const entryDate = new Date(entry.date);
            const entryMonth = entryDate.getMonth() + 1; // Months are 0-indexed
            const entryYear = entryDate.getFullYear();
            return entryMonth === selectedMonth && entryYear === selectedYear;
          });
  
          // Group likes by date and sum up the counts
          const groupedData = {};
          filteredData.forEach(entry => {
            const date = new Date(entry.date).getDate();
            if (!groupedData[date]) {
              groupedData[date] = 0;
            }
            groupedData[date] += entry.count;
          });
  
          // Convert the grouped data into the format for BarChart
          const formattedData = Object.keys(groupedData).map(date => ({
            date: parseInt(date),
            count: groupedData[date],
          }));
  
          setData(formattedData);
        } catch (error) {
          console.error('Error fetching likes data:', error);
        } finally {
          setIsLoading(false); // End loading
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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];


  return (
    <div>
      {isLoading ? ( // Check if loading
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '80px', color: '#1eb2a6', marginLeft: '480px' }} />
          <br /><br />5
          <div style={{ fontSize: '20px', color: 'grey', marginLeft: '400px' }}> Veuillez patienter un instant</div><br /><br />
        </div>
      ) : (
        <div>
          <h2>Likes Histogram for Offer ID: {offerId}</h2>
          <div>
            <button onClick={() => handleMonthChange(selectedMonth - 1)}>Previous Month</button>
            {selectedMonth !== currentDate.getMonth() + 1 && (
              <button onClick={() => handleMonthChange(selectedMonth + 1)}>Next Month</button>
            )}
            <span>Selected Month: {monthNames[selectedMonth - 1]}</span>
          </div>
          <div>
            <button onClick={() => handleYearChange(currentDate.getFullYear())}>This Year</button>
            <button onClick={() => handleYearChange(currentDate.getFullYear() - 1)}>Previous Year</button>
            <span>Selected Year: {selectedYear}</span>
          </div>
          <BarChart width={800} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
            <Brush dataKey="date" height={30} stroke="#8884d8" />
            <ReferenceLine x={currentDate.getDate()} stroke="red" label="Today" />
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default LikesHistogram;

