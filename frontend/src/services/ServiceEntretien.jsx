import axios from 'axios';

export function getEntretiens() {
  return axios.get('http://127.0.0.1:8000/api/')
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching entretiens:", error);
      throw error;
    });
}
export function addEntretien(entretien) {
  return axios.post('http://127.0.0.1:8000/api/add/', {
    heure: entretien.heure.value,
    date: entretien.date.value,
    resultat: entretien.resultat.value,
  })
    .then(response => response.data)
    .catch(error => {
      console.error("Error adding entretien:", error);
      throw error;
    });
}

export function updateEntretien(id, entretien) {
  return axios.put(`http://127.0.0.1:8000/api/update/${id}`, {
    heure: entretien.heure.value,
    date: entretien.date.value,
    resultat: entretien.resultat.value,
  })
    .then(response => response.data)
    .catch(error => {
      console.error("Error editing entretien:", error);
      throw error;
    });
}
export function deleteEntretien(id) {
  return axios.delete(`http://127.0.0.1:8000/api/delete/${id}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.data)
  .catch(error => {
    console.error("Error deleting entretien:", error);
    throw error;
  });
}

