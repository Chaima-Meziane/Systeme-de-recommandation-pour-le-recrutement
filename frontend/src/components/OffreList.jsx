import React, { useEffect, useState } from 'react';
import { addoffre, getoffre, editoffre, deleteoffre } from '../services/ApiService';
import AddOffre from './AddOffre';
import EditOffre from './EditOffre';
export default function OffreList() {

const [offres, setOffres] = useState([]);
const [showAddOffreForm, setShowAddOffreForm] =useState(false)
const [showEditOffreForm, setShowEditOffreForm] =useState(false)  
const [selectedEditData, setSelectedEditData] = useState()
useEffect(() => {
    let isMounted = true; // Add a flag to check if the component is still mounted

    getoffre()
      .then((res) => {
        if (isMounted) {
          console.log("resultat api", res)
          setOffres(res)
        }
      })

    // Clean-up function to prevent setting state on an unmounted component
    return () => {
      isMounted = false;
    }
  }, [])

  const handleAddSubmit=(e)=>{
    addoffre(e.target)
    .then(res=>{
        setOffres(res)
        window.location.reload()
    })
}
const handleEditBtn=(offre)=>{
    setSelectedEditData(offre)
    console.log("offre selected is", offre)
    setShowEditOffreForm(true)
    setShowAddOffreForm(false)


}
const handleEditSubmit= (e, url) => {
    const id = parseInt(url.split('/').filter(Boolean).pop());
    editoffre(id, e.target)
    .then(res=>{
        setOffres(res)
    })
}
const handleDeleteBtn=(url)=>{
    const id = parseInt(url.split('/').filter(Boolean).pop());
    console.log(id)
    deleteoffre(id)
    .then(res=>{
        setOffres(offres.filter(p=>p.id!==id))
        window.location.reload()
    })
}
  return (
    <>
      <h3> Liste des offres</h3>
      <table border={"1px"} cellPadding={"10px"}>
        <thead>
            <tr>
                <td>Titre du poste</td>
                <td>Description</td>
                <td>Compétences</td>
                <td>Nom de l'entreprise</td>
                <td>Localisation</td>
                <td>Statut</td>
                <td>Type d'emploi</td>
             </tr>
        </thead>
        <tbody>
            {offres.map(offre => {
               return <tr key={offre.id}>
               <td>{offre.titreDuPoste}</td>
               <td>{offre.description}</td>
               <td>{offre.competences}</td>
               <td>{offre.entreprise}</td>
               <td>{offre.localisation}</td>
               <td>{offre.statut}</td>
               <td>{offre.typeEmploi}</td>
               <td><button onClick={()=>handleEditBtn(offre)}>Edit</button></td> 
               <td> <button onClick={() => handleDeleteBtn(offre.url)}> Delete</button></td>
                </tr> 
            })}
            
        </tbody>
      </table>
      <button onClick={() => setShowAddOffreForm(true)}>
        Ajouter une nouvelle offre
      </button>
      {showAddOffreForm && <AddOffre handleAddSubmit={handleAddSubmit} />}
      {showEditOffreForm && <EditOffre handleEditSubmit={handleEditSubmit} selectedEditData={selectedEditData}/>}
    </>
  );
}
