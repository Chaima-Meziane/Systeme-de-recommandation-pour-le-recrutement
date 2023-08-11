import axios from "axios";


export function getoffre(){
    return(axios.get('http://127.0.0.1:8000/api/getoffres/'))
    .then (res => {
        return res.data
    })
}
export function getoffrebyid(id){
    return(axios.get('http://127.0.0.1:8000/api/getOffreByID/'+id+'/'))
    .then (res => {
        return res.data
    })
}

export function addoffre(offre){
    return axios.post('http://127.0.0.1:8000/offre/offre/',
    {
        id:null,
        titreDuPoste: offre.titreDuPoste.value,
        description: offre.description.value,
        competences: offre.competences.value,
        entreprise: offre.entreprise.value,
        localisation: offre.localisation.value,
        statut: offre.statut.value,
        typeEmploi: offre.typeEmploi.value,

    })
    .then (res => {
        return res.data
    })
}
export function editoffre(id, offre){
    return axios.put('http://127.0.0.1:8000/offre/offre/'+id+'/',
    {
       
        titreDuPoste: offre.titreDuPoste.value,
        description: offre.description.value,
        competences: offre.competences.value,
        entreprise: offre.entreprise.value,
        localisation: offre.localisation.value,
        statut: offre.statut.value,
        typeEmploi: offre.typeEmploi.value,

    })
    .then (res => {
        return res.data
    })
}
export function deleteoffre(id){
    return(axios.delete('http://127.0.0.1:8000/offre/offre/'+id+'/'))
    .then (res => {
        return res.data
    })
}

export function addcandidature(candidature){
    return axios.post('http://127.0.0.1:8000/candidature/add/',
    {
        id:null,
        lettre_de_motivation: candidature.lettre_de_motivation.value,
        etat: candidature.etat.value,
        candidat: candidature.candidat.value,
        offre: candidature.offre.value,
        
    })
    .then (res => {
        return res.data
    })
}