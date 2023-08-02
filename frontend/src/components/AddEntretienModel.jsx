import React from 'react'

export default function AddEntretienModel({handleAddSubmit, handleCancelBtn}) {
  return (
    <>
    <h3>ADD FORM:</h3>
    <form onSubmit={handleAddSubmit}>
        heure <input type='text' name='heure' />
        date <input type='text' name='date' />
        resultat<input type='text' name='resultat' />
        <button type='submit'>ADD</button>
        <button onClick={handleCancelBtn}>Cancel</button>

    </form>
    </>
  )
}