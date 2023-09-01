import React, { useContext, useState, useEffect } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import { Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './UserContext';
import axios from 'axios';


export default function Profil() {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState(null); // Change setUser to setUserData
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    axios
      .get(`http://127.0.0.1:8000/api/getUserByID/${user.id}`)
      .then((res) => {
        if (isMounted) {
          setUserData(res.data); // Use setUserData to update state
          setLoading(false);
          console.log(res.data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user.id]);

  if (loading) {
    return <><Back title='Mon Profil' /><div className="loading-container">
    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '80px', color:'#1eb2a6' , marginLeft:'800px'}} />
    <br/><br/>5
    <div style={{ fontSize: '20px', color:'grey',   marginLeft:'720px' }}> Veuillez patienter un instant</div><br/><br/>
  </div></>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!userData) {
    return <div>User data not found.</div>;
  }

  return (
    <>
    <Back title='Mon Profil' />
    <section className='testimonal padding'>
      <div className='container' style={{marginTop:'-40px'}}>
        <div className='content'>
          <div className='items shadow' style={{ padding: '100px', margin: '0 200px', display: 'flex' }}>
            <div className='profile-icon' style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src='images/user.jpg' alt='Icône de profil' style={{ width: '600px', height: '250px', marginTop: '-150px' }} />
            </div>
            <div className='info-column' style={{ flex: '2', padding: '0 50px' }}>
              <div className='box flex'>
                <div className='name'>
                  <h2> Informations personnelles </h2>
                  <br />
                  <span>Identifiant : {user.id}</span>
                  <br />
                  <br />
                </div>
              </div>
  
              <div>
                <h2 id='nom'>{userData.first_name} {userData.last_name}</h2>
                <p>Téléphone : {userData.phone_number}</p><br/><hr/>
                <p>Adresse  : {userData.address}</p><br/><hr/>
                <p>Email : {userData.email}</p><br/><hr/>
                <br />
  
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <p style={{ margin: '0' }}>CV : </p>
                  <a
                    href={`http://localhost:8000${userData.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none'}}>
                    Cliquez ici pour voir mon CV
                  </a>
                </div>
              </div><br/><hr/>
  
              <br />
              <br />
              <br />
              <br />
              <br />
  
              <Link to={`/updateuser`}>
                <button className='outline-btn'>Mettre à jour mes informations personnelles</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
  
  );
}
