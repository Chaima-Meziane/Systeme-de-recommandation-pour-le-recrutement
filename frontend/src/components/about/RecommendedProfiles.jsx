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
          <Heading title={`Profils Recommandés`} />
          <div className="content2 grid2">
            {recommendedProfiles.map(({ id, name, url, skills, similarity_score, location }) => (
              <div className="items2 shadow" key={id}>
                <div className="box flex">
                  <div className="name2">
                    <h2>{name}</h2>
                    <p>Localisation: {location}</p>
                    <p>Score: {similarity_score}</p>
                      <a  href={url}>
                        <button className="linkedin-button">Voir le profil LinkedIn</button>
                      </a>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Awrapper />
    </>
  );
};

export default RecommendedProfiles;
