import React, { useContext, useState, useEffect } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './UserContext';
import axios from 'axios';

export default function UpdateUser() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [resume, setResume] = useState('');
  const [email, setEmail] = useState('');
  const [candidat, setCandidat] = useState('');
  const [coordinateur, setCoordinateur] = useState('');
  

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/getUserByID/${user.id}`)
      .then((response) => {
        //console.log(response.data)
        const userData = response.data;
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setPhoneNumber(userData.phone_number);
        setAddress(userData.address);
        setResume(userData.resume);
        setEmail(userData.email);
        setCandidat(userData.is_candidat);
        setCoordinateur(userData.is_coordinateur);
        

        
        
        
      })
      .catch((error) => {
        console.error("Error fetching candidature data:", error);
      });
  }, [user.id]);

  const handleAddSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('address', address);
    formData.append('email', email);
    formData.append('candidat', candidat);
    formData.append('coordinateur', coordinateur);
  
    // Check if a new resume has been selected
    if (resume instanceof File) {
      formData.append('resume', resume);
    }
  
    const config = {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      };
    axios.put(`http://127.0.0.1:8000/api/user/${user.id}/update/`, formData, config)
      .then((response) => {
        console.log("User was successfully updated!");
        console.log(response.data);
        navigate('/monprofil')
      })
      .catch((error) => {
        console.error("Update failed", error);
        if (error.response) {
          console.log("Error response data:", error.response.data);
        }
      });
  };
  

  return (
    <>
      <Back title="Mise à jour de mes données" />
      <section className='contacts padding' >
        <div className='container shadow' style={{height:'1050px'}}>
          <div className='left row'><br/><br/>
            <h1>Mettre à jour mes informations personnelles</h1>
            <form onSubmit={handleAddSubmit}  encType="multipart/form-data">
            <div className='form-field'>
                <div className='input-container'>
                  <p>Prénom</p>
                  <input
                    type='text'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div className='form-field'>
                <div className='input-container'>
                  <p>Nom</p>
                  <input
                    type='text'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className='form-field'>
                <div className='input-container'>
                  <p>Numéro de téléphone</p>
                  <input
                    type='phonenumber'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className='form-field'>
                <div className='input-container'>
                  <p>Adresse</p>
                  <input
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className='form-field'>
                <div className='input-container'>
                  <p>Email</p>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              


              <div className='form-field'>
                <div className='input-container'>
                  <p> Importez une version plus récente de votre CV </p>
                  <input
                    type='file'
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}/>

                </div>
              </div>


              <button className='primary-btn' type='submit'>
                Confirmer les modifications
              </button>
              
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
