import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext"; // Import the UserContext
import Head from "./Head";
import "./header.css";
import axios from "axios";

const Header = () => {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext); // Retrieve the setUser function from UserContext

  const handleLogout = () => {
    axios
      .post("http://127.0.0.1:8000/api/logout/")
      .then((response) => {
        // Set the user to null upon successful logout
        localStorage.removeItem('user');
        setUser(null);

        // Redirect the user to the login page after successful logout
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const isAuthenticated = user !== null;
  const isCandidat = isAuthenticated && user.is_candidat;
  const isCoordinateur = isAuthenticated && user.is_coordinateur;

  return (
    <>
      <Head />
      <header>
        <nav className='flexSB'>
          <ul className={click ? "mobile-nav" : "flexSB "} onClick={() => setClick(false)}>
            <li>
              <Link to='/'>Home</Link>
            </li>
            {isCandidat && (
              <>
                <li>
                  <Link to='/MesCandidatures'>Mes Candidatures</Link>
                </li>
                <li>
                  <Link to='/calendar'>Mes entretiens</Link>
                </li>
                <li>
                  <Link to='/recommendedoffers'>Pour Vous</Link>
                </li>
                <li>
                  <Link to={`/recommendedoffersbylikes/${user.id}`}>Pour Vous</Link>
                </li>
              </>
            )}
            {isCoordinateur && (
              <>
                <li>
                  <Link to='/OffersByCoordinator'>Mes Offres</Link>
                </li>
                <li>
                  <Link to='/addoffre'>Ajouter Mon Offre</Link>
                </li>
                <li>
                  <Link to='/calendar'>Mes Entretiens</Link>
                </li>
              </>
            )}
            {/*<li>
              <Link to='/courses'>All Courses</Link>
            </li>
            <li>
              <Link to='/about'>About</Link>
            </li>
            <li>
              <Link to='/team'>Team</Link>
            </li>
            <li>
              <Link to='/pricing'>Pricing</Link>
            </li>
            <li>
              <Link to='/journal'>Journal</Link>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>*/}
          </ul>
          <div className='start'>
            <div className='button'>
              <a href="#" style={{ color: 'white' }} onClick={handleLogout}>Logout</a>
            </div>
          </div>
          <button className='toggle' onClick={() => setClick(!click)}>
            {click ? <i className='fa fa-times'> </i> : <i className='fa fa-bars'></i>}
          </button>
        </nav>
      </header>
    </>
  )
}

export default Header;
