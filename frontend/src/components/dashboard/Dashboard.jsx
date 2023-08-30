import React from "react";
import { DoughnutChart } from "./DoughnutChart";
import LikesHistogram from "./LikesHistogram"; // Import corrected
import { useParams } from 'react-router-dom';
import '../home/testimonal/style.css';
import { CandidatureHistogram } from "./CandidatureHistogram"
import Heading from "../common/heading/Heading";
import Back from "../common/back/Back";
import './Dashboard.css'

export function Dashboard() {
  const { id } = useParams();

  return (
    <>
    <Back title={`Dashboard`} />
      <section className='testimonial padding'>
        <div className='container'>
          <Heading subtitle='Dashboard' title="Tableau de bord des détails de l'offre" />
          <div className='content-box-dash'>
            <div className='content'><DoughnutChart offerId={id} /></div>
          </div>
          <div className='content-box-dash small-box'>
            <div className='content'><LikesHistogram offerId={id} /></div>
          </div>
          <div className='content-box-dash small-box'>
            <div className='content'><CandidatureHistogram offerId={id} /></div>
          </div>
        </div>
      </section>
     
    </>
  );
}
