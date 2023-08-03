import React from 'react'

export default function EditOffre({handleEditSubmit, selectedEditData}){
    return (
        <>
        <h3> Edit FORM: </h3>
        <form onSubmit={(e)=>handleEditSubmit(e,selectedEditData.url)}>
            Titre du poste<input type='text' name='titreDuPoste' defaultValue={selectedEditData.titreDuPoste}/>
            Description<input type='text' name='description' defaultValue={selectedEditData.description}/>
            Compétences<input type='text' name='competences' defaultValue={selectedEditData.competences}/>
            Entreprise<input type='text' name='entreprise' defaultValue={selectedEditData.entreprise}/>
            Localisation<input type='text' name='localisation' defaultValue={selectedEditData.localisation}/>
            Statut<input type='text' name='statut' defaultValue={selectedEditData.statut}/>
            Type d'emploi<input type='text' name='typeEmploi' defaultValue={selectedEditData.typeEmploi}/>
            <button type='submit'> Modifier  </button>
        </form>
        </>
    )
}