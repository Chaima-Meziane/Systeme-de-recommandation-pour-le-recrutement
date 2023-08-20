import React, { useState, useEffect } from "react";
import Heading from "../common/heading/Heading";
import "./about.css";
import Back from "../common/back/Back";
import Awrapper from "./Awrapper";
import { useParams } from "react-router-dom";
import on_recrute_image from "../../../public/images/on_recrute.png";
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
      <Back title="About Us" />
      <section className="aboutHome">
        <div className="container flexSB">
          <div className="left row">
            <img src={on_recrute_image} alt="" />
          </div>
          <div className="right row">
            <Heading subtitle="Available Job Offer"/>
            <div className="items">
              <h2>Recommended Profiles for Offer {id}</h2>
              {recommendedProfiles.map(({ id, name, url, similarity_score }) => (
                <div className="item flexSB" key={id}>
                  <div className="text">
                    <h2>{name}</h2>
                    <p>Profile ID: {id}</p>
                    
                    <p>LinkedIn URL: <a href={url}>{url}</a></p>
                    <p>Similarity Score: {similarity_score}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Awrapper />
    </>
  );
};

export default RecommendedProfiles;
