import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import './blog/blog.css';
import * as pdfjs from 'pdfjs-dist';


const CandidaturesByOffers = () => {
  const { id } = useParams();
  const [candidatures, setCandidatures] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger le worker PDF.js
    pdfjs.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.min.js';

    axios.get(`http://localhost:8000/api/candidatures/offre/${id}/`)
      .then(response => {
        setCandidatures(response.data);
      })
      .catch(error => {
        console.error('Error fetching candidatures:', error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);


  // Fonction pour extraire le texte du PDF
  const extractTextFromPdf = async (pdfUrl) => {
    try {
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      let fullText = '';
      const numPages = pdf.numPages;

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        fullText += pageText + ' '; // Concatenate text from all pages
      }

      console.log('Text extracted from PDF:', fullText);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : candidatures.length === 0 ? (
        <div>Aucune candidature pour cette offre.</div>
      ) : (
        <div className="candidature-list">
          {candidatures.map(candidature => (
            <div key={candidature.id} className="candidature">
              <p>Etat: {candidature.etat}</p>
              {candidature.candidat && (
                <div>
                  <p>Nom du candidat : {candidature.candidat.first_name} {candidature.candidat.last_name}</p>
                  <p>Téléphone: {candidature.candidat.phone_number}</p>
                  <p>Adresse: {candidature.candidat.address}</p>
                  {candidature.candidat.resume && (
                    <div>
                      <a
                        href={`http://localhost:8000${candidature.candidat.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir le CV du candidat
                      </a>
                      <button onClick={() => extractTextFromPdf(`http://localhost:8000${candidature.candidat.resume}`)}>Extraire le texte du CV</button>
                    </div>
                  )}
                </div>
              )}
              
              {candidature.lettre_de_motivation && (
              
                <a
                  href={`http://localhost:8000${candidature.lettre_de_motivation}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir la lettre de motivation
                </a>
                
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidaturesByOffers;
