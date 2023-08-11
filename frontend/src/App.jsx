import './App.css';
import GestionEntretien from './components/GestionEntretien.jsx';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import OffreList from './components/OffreList';
import Home from './components/home/Home';
import About from './components/about/About';
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer';
import CourseHome from './components/allcourses/CourseHome';
import Team from './components/team/Team';
import Pricing from './components/pricing/Pricing';
import Blog from './components/blog/Blog';
import Contact from './components/contact/Contact';
import CompleteYourProfile from './components/CompleteYourProfile';
import { UserProvider } from './components/UserContext';
import AddOffre from './components/AddOffre';
import UpdateOffre from './components/UpdateOffre';

import AddCandidature from './components/AddCandidature';
import OffersByCoordinator from './components/OffersByCoordinator';
import CoordinatorsOfferDetails from './components/about/CoordinatorsOfferDetails';
const shouldShowHeaderandFooter = (location) => {
  const { pathname } = location;
  return !['/login', '/register', '/offre', '/completeprofile'].includes(pathname);
};

function App() {
  const location = useLocation();
  const showHeaderandFooter = shouldShowHeaderandFooter(location);

  return (
    <>
      {showHeaderandFooter && <Header />}
      <Routes>
        <Route path='/details/:id' element={<About/>} />
        <Route path='/owner/details/:id' element={<CoordinatorsOfferDetails/>} />
        <Route path='/' element={<Home />} />
        <Route path='/:id/addCandidature' element={<AddCandidature/>} />
        <Route path='/courses' element={<CourseHome />} />
        <Route path='/team' element={<Team />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/journal' element={<Blog />} />
        <Route path='/contact' element={<Contact />} />
        <Route path="/entretiens" element={<GestionEntretien />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/addoffre" element={<AddOffre/>} />
        <Route path='/updateoffre/:id' element={<UpdateOffre/>} />
        <Route path="/offre" element={<OffreList/>} />
        <Route path="/completeprofile" element={<CompleteYourProfile/>} />
        <Route path='/OffersByCoordinator' element={<OffersByCoordinator/>} />

      </Routes>
      {showHeaderandFooter && <Footer />}
    </>
  );
}

function Root() {
  return (
    <BrowserRouter>
    <UserProvider><App /></UserProvider>
      
    </BrowserRouter>
  );
}

export default Root;
