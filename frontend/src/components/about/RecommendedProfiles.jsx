import React, { useState, useEffect } from "react";
import Heading from "../common/heading/Heading";
import Back from "../common/back/Back";
import './RecommendedProfiles.css';
import Awrapper from "./Awrapper";
import { useParams } from "react-router-dom";
import axios from "axios";

const RecommendedProfiles = () => {
  const [offer, setOffer] = useState({});
  const [recommendedProfiles, setRecommendedProfiles] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // Fetch offer and recommended profiles from the API
    axios
      .get(`http://127.0.0.1:8000/api/profiles_recommendations/${id}/`)
      .then((response) => {
        setOffer(response.data.offer);
        console.log(response.data);
        setRecommendedProfiles(response.data.recommended_profiles);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  return (
    <>
      <Back title={`Profils Recommandés`} />
      <section className="testimonal padding">
        <div className="container">
        <Heading  title={`Profils Recommandés`} />
          <p style={{marginLeft:'150px', fontSize:'23px', fontWeight:'bold', color:'black'}}>
          Voici les profils LinkedIn les plus recommandés pour cette offre. Contactez-les si vous êtes intéressé(e).</p><br/><br/><br/><br/>

          <div className="content2 grid2">
            {recommendedProfiles.map(({ id, name, url, skills, similarity_score, location, job_title }) => (
              <div className="items2 shadow" key={id}>
                <div className="box flex">
                  <div className="name2">
                
                    <h2>{name}</h2>
                <br/>
                            
                <div style={{ marginBottom: '10px', position: 'relative' }}>
                <span  className="hover-l" >Poste:</span>
                <span style={{ color: '#333' }}>{job_title}</span>
              </div>
              <div style={{ marginBottom: '10px', position: 'relative' }}>
                <span  className="hover-l">Localisation:</span>
                <span style={{ color: '#333' }}>{location}</span>
              </div>
              <div style={{ marginBottom: '10px', position: 'relative' }}>
                <span  className="hover-l">Score:</span>
                <span style={{ color: '#333' }}>{similarity_score}</span>
              
              </div>
                    
                      <a  href={url}>
                        <button className="linkedin-button">Consulter le profil LinkedIn</button>
                      </a>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/*<Awrapper />*/}
    </>
  );
};

export default RecommendedProfiles;
