import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch entretiens data from your Django API endpoint
    const fetchEntretiens = async () => {
      try {
        const response = await fetch('/api/entretiens/');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching entretiens:', error);
      }
    };

    fetchEntretiens();
  }, []);

  const formatEvent = (event) => {
    const startDateTime = moment(event.date)
      .add(moment.duration(event.heure_debut))
      .toDate();
    const endDateTime = moment(event.date)
      .add(moment.duration(event.heure_fin))
      .toDate();

    return {
      ...event,
      start: startDateTime,
      end: endDateTime,
    };
  };

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events.map(formatEvent)}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
};

export default CalendarComponent;
