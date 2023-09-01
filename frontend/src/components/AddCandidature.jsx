import React, { useContext, useEffect, useState } from 'react';
import './contact/contact.css';
import Back from './common/back/Back';
import { getoffrebyid} from '../services/ApiService';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './UserContext';
export default function AddCandidature() {
    
    
    const { id } = useParams();
    const [lettreDeMotivation, setLettreDeMotivation] = useState(null);
    const [etat, setEtat] = useState("En attente");
    const [jobOffer, setJobOffer] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let navigate = useNavigate();

    // Access the user context
    const { user } = useContext(UserContext);
    const idUser = user ? user.id : null
    
    

  
    
    
    useEffect(() => {
        let isMounted = true; // Add a flag to check if the component is still mounted
    
        getoffrebyid(id)
          .then((res) => {
            if (isMounted) {
            
              setJobOffer(res);
              setLoading(false);
            }
          })
          .catch((err) => {
            if (isMounted) {
              setError(err);
              setLoading(false);
              
            }
          });
    
        // Clean-up function to prevent setting state on an unmounted component
        return () => {
          isMounted = false;
        };
      }, [id]);
  
    const handleAddSubmit = (event) => {
      event.preventDefault();
      
     
      // Create an object to hold the user data
      const formData = {
        lettre_de_motivation: lettreDeMotivation,
        etat: etat,
        candidat:idUser,
        offre:id,
         
        
        
      };
      const config = {
          headers: {
            'Content-Type': 'multipart/form-data', // Specify the correct content type for form data
          },
        };
      // Update the user's profile using the user information from the context
      axios.post(`http://127.0.0.1:8000/api/candidature/add/`, formData, config)
      
        .then((response) => {
          // Handle successful profile update
          console.log("Candidature added successful!");
          console.log(response.data)
          navigate('/')
        })
        .catch((error) => {
          // Handle registration error
          console.error("Something went wrong!", error);
          // You can also display an error message to the user.
          if (error.response) {
              console.log("Error response data:", error.response.data); // Log the error response data
            }
        });
    };
    if (loading) {
      return <><Back title='Ajouter une candidature' /><div className="loading-container">
      <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '80px', color:'#1eb2a6' , marginLeft:'800px'}} />
      <br/><br/>5
      <div style={{ fontSize: '20px', color:'grey',   marginLeft:'720px' }}> Veuillez patienter un instant</div><br/><br/>
    </div></>
    }
    
      if (error) {
        return <div>Error: {error.message}</div>;
      }
    
      if (!jobOffer) {
        return <div>Job offer not found.</div>;
      }
  
    
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setLettreDeMotivation(file);
    };


  return (
    <>
      <Back title='Ajouter une candidature' />
      <section className='contacts padding'>
        <div className='container shadow' style={{height:'430px'}}>
          <div className='left row'>
            <br/><br/><h1>Ajouter votre candidature</h1>

            <form onSubmit={handleAddSubmit}>
            
              <div className='form-field'>
                
                <div className='input-container'>
                    <p>Ajouer votre lettre de motivation</p>
                <input type="file" id="lettreDeMotivation" name="lettreDeMotivation" accept=".pdf,.doc,.docx" onChange={handleFileChange} required/>
                </div>
              </div>



              

              {/*
              <div className='form-field'>
          
                <select name='etat' value={etat} onChange={(e) => setEtat(e.target.value)} id='etat'>
                  <option value='En attente'>En attente</option>
                  <option value='Acceptée'>Acceptée</option>
                  <option value='Rejetée'>Rejetée</option>
                </select>
  </div>*/}
              
             
              <button className='primary-btn' type='submit'>Valider</button>
              
              
              <button className='primary-btn' type='button' onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft} /> Retour
              </button>              
                
              
             
              
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
