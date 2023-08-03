import React from 'react'

export default function AddOffre({handleAddSubmit}){
    return (
        <>
        <h3> ADD FORM: </h3>
        <form onSubmit={handleAddSubmit}>
            Titre du poste<input type='text' name='titreDuPoste'/>
            Description<input type='text' name='description'/>
            Compétences<input type='text' name='competences'/>
            Entreprise<input type='text' name='entreprise'/>
            Localisation<input type='text' name='localisation'/>
            Statut<input type='text' name='statut'/>
            Type d'emploi<input type='text' name='typeEmploi'/>
            <button type='submit'> Ajouter </button>
        </form>
        </>
    )
}
