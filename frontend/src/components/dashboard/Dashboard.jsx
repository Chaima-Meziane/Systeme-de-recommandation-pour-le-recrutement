import React from "react";
import { DoughnutChart } from "./DoughnutChart";
import LikesHistogram from "./LikesHistogram"; // Import corrected
import { useParams } from 'react-router-dom';
import '../home/testimonal/style.css';
import Heading from '../common/heading/Heading';

export function Dashboard() {
  const { id } = useParams();

  return (
    <>
      <section className='testimonial padding'>
        <div className='container'>
          <Heading subtitle='Dashboard' title="Tableau de bord des détails de l'offre" />
          <div className='content'><DoughnutChart offerId={id} /></div>
          <div className='content'><LikesHistogram offerId={id} /></div>
        </div>
      </section>
    </>
  );
}
