import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { UserProvider, UserContext } from './components/UserContext'; // Make sure to update the import
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import OffreList from './components/OffreList';
import Home from './components/home/Home';
import About from './components/about/About';
import GestionEntretien from './components/GestionEntretien.jsx';
import AddCandidature from './components/AddCandidature';
import CoordinatorsOfferDetails from './components/about/CoordinatorsOfferDetails';
import CourseHome from './components/allcourses/CourseHome';
import Team from './components/team/Team';
import Pricing from './components/pricing/Pricing';
import Blog from './components/blog/Blog';
import Contact from './components/contact/Contact';
import CompleteYourProfile from './components/CompleteYourProfile';
import AddOffre from './components/AddOffre';
import UpdateOffre from './components/UpdateOffre';
import OffersByCoordinator from './components/OffersByCoordinator';
import CandidaturesByOffers from './components/CandidaturesByOffer';

function shouldShowHeaderandFooter(location) {
  const { pathname } = location;
  return !['/login', '/register', '/offre', '/completeprofile'].includes(pathname);
}

function App() {
  const { user } = useContext(UserContext);
  const isAuthenticated = user !== null;
  const location = useLocation();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const showHeaderandFooter = shouldShowHeaderandFooter(location);

  useEffect(() => {
    if (!isAuthenticated && !['/login', '/register'].includes(location.pathname)) {
      navigate('/login'); // Redirect to the login page if not authenticated
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return (
    <>
      {showHeaderandFooter && isAuthenticated && <Header />}
      <Routes>
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        {isAuthenticated ? (
          <>
            <Route path='/details/:id' element={<About />} />
            <Route path='/owner/details/:id' element={<CoordinatorsOfferDetails />} />
            <Route path='/' element={<Home />} />
            <Route path='/:id/addCandidature' element={<AddCandidature />} />
            <Route path='/courses' element={<CourseHome />} />
            <Route path='/team' element={<Team />} />
            <Route path='/pricing' element={<Pricing />} />
            <Route path='/journal' element={<Blog />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/entretiens' element={<GestionEntretien />} />
            <Route path='/addoffre' element={<AddOffre />} />
            <Route path='/updateoffre/:id' element={<UpdateOffre />} />
            <Route path='/offre' element={<OffreList />} />
            <Route path='/completeprofile' element={<CompleteYourProfile />} />
            <Route path='/OffersByCoordinator' element={<OffersByCoordinator />} />
            <Route path="/candidaturesbyoffer/:id" element={<CandidaturesByOffers/>}/>

          </>
        ) : (
          // Redirect unauthorized routes to the login page
          <Route path='*' element={<LoginPage />} />
        )}
      </Routes>
      {showHeaderandFooter && isAuthenticated && <Footer />}
    </>
  );
}

function Root() {
  return (
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  );
}

export default Root;
