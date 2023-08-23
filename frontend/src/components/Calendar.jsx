import React, { useContext, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomEvent from './CustomEvent';
import { UserContext } from './UserContext';
import Heading from './common/heading/Heading'; 
import "./allcourses/courses.css"
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [entretiens, setEntretiens] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch entretiens data from your Django API endpoint
    const fetchEntretiens = async () => {
      try {
        let response;
        console.log(user);
        if (user.is_candidat) {
          response = await fetch(`http://127.0.0.1:8000/api/getEntretiensByCandidat/${user.id}/`);
        } else {
          response = await fetch(`http://127.0.0.1:8000/api/getEntretiensByCoordinateur/${user.id}/`);
        }
        const data = await response.json();
        setEntretiens(data);
      } catch (error) {
        console.error('Error fetching entretiens:', error);
      }
    };

    fetchEntretiens();
  }, [user]); // Run the effect whenever user.is_candidat changes

  const formatEvent = (event) => {
    const startDateTime = moment(event.date).add(moment.duration(event.heure_debut)).toDate();
    const endDateTime = moment(event.date).add(moment.duration(event.heure_fin)).toDate();

    return {
      ...event,
      start: startDateTime,
      end: endDateTime,
    };
  };

  return (
    <section className='homeAbout'>
    <div className='container'>
      <Heading subtitle='Votre agenda' title="Explorez votre agenda d'entretiens" />
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={entretiens.map(formatEvent)}
        startAccessor="start"
        endAccessor="end"
        components={{
          event: CustomEvent, // Use the custom Event component
        }}
      />
    </div>
    </div>
    </section>
  );
};

export default CalendarComponent;
