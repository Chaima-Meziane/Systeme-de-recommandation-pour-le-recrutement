import React from 'react'

export default function UpdateEntretienModel({handleEditSubmit, selectedEditData}) {
  return (
    <>
    <h3>EDIT FORM:</h3>
    <form onSubmit={(e)=>handleEditSubmit(e, selectedEditData.id)}>
        heure <input type='text' name='heure' defaultValue={selectedEditData.heure}/>
        date <input type='text' name='date' defaultValue={selectedEditData.date} />
        resultat<input type='text' name='resultat' defaultValue={selectedEditData.resultat} />

        <button type='submit'>EDIT</button>

    </form>
    </>
  )
}