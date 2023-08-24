import React, { useContext } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './UserContext';
import axios from 'axios';

export default function UpdateOptions() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleRescheduleClick = () => {
    navigate(`/reporterentretien/${id}`);
  };
  const handleUpdateResult = () => {
    navigate(`/updateresultatentretien/${id}`);
  };

  const buttonStyles = {
    fontSize: '1.5rem',
    padding: '10px 20px',
  };

  return (
    <>
      <Back title="Modifier l'entretien" />
      <section className='contacts padding'>
        <div className='container shadow'>
          <div className='left row'>
            <h1>Modifier l'entretien</h1>
            
            <button className='primary-btn' type='button' style={buttonStyles} onClick={handleRescheduleClick}>
              Reporter l'entretien
            </button>
            
            <button className='primary-btn' type='button' style={buttonStyles} onClick={handleUpdateResult}>
              Adjoindre le résultat de l'entretien
            </button>
            
          </div>
        </div>
      </section>
    </>
  );
}
