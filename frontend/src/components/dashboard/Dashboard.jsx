import React from "react";
import { DoughnutChart } from "./DoughnutChart";
import LikesHistogram from "./LikesHistogram"; // Import corrected
import { useParams } from 'react-router-dom';
import '../home/testimonal/style.css';
import { CandidatureHistogram } from "./CandidatureHistogram"
import Heading from "../common/heading/Heading";
import Back from "../common/back/Back";
import './Dashboard.css'
import CandidatureWidget from"./CandidatureWidget";
import LikesWidget from "./LikesWidget";
import EntretienWidget from "./EntretienWidget";
import CandidaturesAccepteesWidget from './CandidaturesAccepteesWidget';
import CandidaturesRejeteesWidget from './CandidaturesRejeteesWidget';
import CandidaturesEnAttenteWidget from './CandidaturesEnAttenteWidget';

export function Dashboard() {
  const { id } = useParams();

  return (
    <>
    <Back title={`Tableau De Bord`} />
      <section className='testimonial padding'>
        <div className='container'>
          <Heading subtitle='Dashboard' title="Tableau de bord des détails de l'offre" />
          <br/><br/><br/>
          <div className="grid-container">
          <div className='mini-box-rose' style={{ backgroundColor: 'rgba(255,107,159,255)' }}>
            <div className='content'><CandidatureWidget offerId={id} /></div>
          </div>
          <div className='mini-box-jaune' style={{ backgroundColor: 'rgba(251,175,1,255)' }}>
            <div className='content'><LikesWidget offerId={id} /></div>
          </div>
          <div className='mini-box-bleue' style={{ backgroundColor: 'rgba(95,210,215,255)' }}>

            <div className='content'><EntretienWidget offerId={id} /></div>
          </div>
        </div>

     
         
          
          <div className='content-box-dash small-box'>
            <div className='content'><CandidatureHistogram offerId={id} /></div>
          </div>
           
          <div className='flex-container-dash'>

        <div className='content-box-dash-doughnut'>
          <div className='content'><DoughnutChart offerId={id} /></div>
        </div>
        <div className='nbre-candidatures'>
        <div className='mini-box-rose-cand' style={{ backgroundColor: 'white' }}>
          <div className='content'><CandidaturesAccepteesWidget offerId={id} /></div>
        </div><br/>
        <div className='mini-box-jaune-cand' style={{ backgroundColor: 'white' }}>
          <div className='content'><CandidaturesEnAttenteWidget offerId={id} /></div>
        </div><br/>
        <div className='mini-box-bleue-cand' style={{ backgroundColor: 'white' }}>
          <div className='content'><CandidaturesRejeteesWidget offerId={id} /></div>
        </div>
        </div>
        </div>



        <div className='content-box-dash small-box'>
            <div className='content'><LikesHistogram offerId={id} /></div>
          </div>
          </div>
        
      </section>
     
    </>
  );
}