import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { getEntretiens, deleteEntretien, addEntretien,updateEntretien} from '../services/ServiceEntretien';
import "../App.css";
import { ButtonToolbar } from 'react-bootstrap';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import AddEntretienModel from './AddEntretienModel';
import UpdateEntretienModel from './UpdateEntretienModel';

const GestionEntretien = () => {
  const [entretiens, setEntretiens] = useState([]); 
  const [addModelShow, setAddModelShow] = useState(false);
  const [editModelShow, setEditModelShow] = useState(false);
  const [selectedEditData, setSelectedEditData] = useState();

  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (entretiens.length && !isUpdated) {
      return;
    }
    getEntretiens()
      .then(data => {
        console.log(data); // Vérifiez les données ici
        setEntretiens(data);
      })
      .catch(error => {
        console.error("Error getting entretiens:", error);
      });
    return () => {
      mounted = false;
      setIsUpdated(false);
    };
  }, [isUpdated, entretiens]);


  function handleCancelBtn() {
    e.preventDefault();
    setAddModelShow(true);
}

 
const handleDeleteBtn = (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this entretien?");
  if (!confirmed) {
    return; // If the user clicked "Cancel", do nothing
  }

  deleteEntretien(id)
    .then(result => {
      alert("Entretien deleted successfully.");
      setEntretiens(entretiens.filter(entretien => entretien.id !== id));
    })
    .catch(error => {
      alert("Failed to delete entretien.");
      console.error("Error deleting entretien:", error);
    });
};

  
  let AddModelClose = () => setAddModelShow(false);

  const handleAddSubmit = (e) => {
    addEntretien(e.target)
    .then(response => {
      setEntretiens(response)
    })
}
const handleEditBtn = (entretien) => {
  setSelectedEditData(entretien);
  setEditModelShow(true);
  setAddModelShow(false);
};

const handleEditSubmit =(e, id)=>{
  updateEntretien(id, e.target)
  .then(res =>{
    setEntretiens(res)
  })

}
  
  return (
    <div className="container-fluid side-container">
      <div className="row side-row" >
        <p id="manage"></p>
        <Table striped bordered hover className="react-bootstrap-table" id="dataTable">
          <thead>
            <tr>
              <th>heure</th>
              <th>date</th>
              <th>resultat</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {entretiens.map((entretien) => (
              <tr key={entretien.id}>
                <td>{entretien.heure}</td>
                <td>{entretien.date}</td>
                <td>{entretien.resultat}</td>
                <td>
                <Button className="mr-2" variant="danger" onClick={() => handleDeleteBtn(entretien.id)}>
                  <RiDeleteBin5Line />
                </Button>

                  <span>&nbsp;&nbsp;&nbsp;</span>
                  <Button className="mr-2" onClick={()=>handleEditBtn(entretien)}>Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <ButtonToolbar>
          <Button variant="primary" onClick={()=>setAddModelShow(true)}>
            Add Entretien
          </Button>
        </ButtonToolbar>
        {addModelShow && <AddEntretienModel handleAddSubmit={handleAddSubmit} handleCancelBtn = {handleCancelBtn}/>}    
        {editModelShow && <UpdateEntretienModel handleEditSubmit={handleEditSubmit} selectedEditData= {selectedEditData}/>}    

      </div>
    </div>
  );
};

export default GestionEntretien;
