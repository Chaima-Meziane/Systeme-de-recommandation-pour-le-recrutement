import React, { useContext, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomEvent from './CustomEvent';
import { UserContext } from './UserContext';
import Heading from './common/heading/Heading'; 
import "./allcourses/courses.css"
import { useNavigate } from 'react-router-dom';
import Back from "./common/back/Back"

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [entretiens, setEntretiens] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [user]); 

  const formatEvent = (event) => {
    const startDateTime = moment(event.date).add(moment.duration(event.heure_debut)).toDate();
    const endDateTime = moment(event.date).add(moment.duration(event.heure_fin)).toDate();

    return {
      ...event,
      start: startDateTime,
      end: endDateTime,
    };
  };
 

  const handleEventClick = (event) => {
    navigate(`/updateoptions/${event.id}`);
  };

  return (
    <>
      <Back title='Mes Entretiens' />
    <section className='homeAbout'>
    <div className='container'>
      <Heading subtitle='Mes Entretiens' title="Explorez votre agenda d'entretiens" />
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={entretiens.map(formatEvent)}
        startAccessor="start"
        endAccessor="end"
        components={{
          event: CustomEvent, // Use the custom Event component
        }}
        onSelectEvent={handleEventClick}
        
      />
      
    </div>
    </div>
    </section>
    </>
  );
};

export default CalendarComponent;
