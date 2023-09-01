import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const CompleteYourProfile = () => {
const { user } = useContext(UserContext); 
  const [phonenumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  let navigate = useNavigate();
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Create an object to hold the user data
    const formData = {
      first_name: user.first_name,
      last_name: user.last_name,
        username: user.username,
        email:user.email,
        is_candidat:user.is_candidat,
      phone_number: phonenumber,
      address: address,
      resume:resume,
      
      
    };
    const config = {
        headers: {
          'Content-Type': 'multipart/form-data', // Specify the correct content type for form data
        },
      };
    // Update the user's profile using the user information from the context
    axios.put(`http://127.0.0.1:8000/api/user/${user.id}/update/`, formData, config)
    
      .then((response) => {
        // Handle successful profile update
        console.log("Profile update successful!");
        console.log(response.data)
        navigate('/')
      })
      .catch((error) => {
        // Handle registration error
        console.error("Registration failed:", error);
        // You can also display an error message to the user.
        if (error.response) {
            console.log("Error response data:", error.response.data); // Log the error response data
          }
      });
  };

  const iconStyle = {
    fontSize: '16px', // Adjust the font-size as needed for a smaller icon
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  return (
    <div className="main1">
      <section className="signup">
        <div className="container1" style={{marginTop:'45px'}}>
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title1" style={{fontSize:'25px'}}>Complétez votre profil</h2>
              <form onSubmit={handleFormSubmit} className="register-form" id="register-form" encType="multipart/form-data">
                <div className="form-group1">
                  <label htmlFor="phone_number"><i className="material-icons" style={iconStyle}>phone</i></label>
                  <input type="text" name="phone_number" id="phone_number" onChange={handlePhoneNumberChange} placeholder="Numéro de téléphone" required/>
                </div>
                <div className="form-group1">
                  <label htmlFor="address"><i className="material-icons" style={iconStyle}>gps_fixed</i></label>
                  <input type="text" name="address" id="address" value={address} onChange={handleAddressChange} placeholder="Adresse" required/>
                </div>
                <div className="form-group1">
                    <label htmlFor="resume" style={{fontSize: '14px', color:'grey'}}> 
                    <i className="material-icons" style={{fontSize: '16px', marginRight:'10px', color:'black'}} >description</i>
                    Importez votre CV 
                    </label><br/>
                    <br/><br/><br/>
                    <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} required/>
                </div>
                
                <div className="form-group1 form-button1">
                  <button type="submit" name="signup" id="signup" className="form-submit" value="Register">Valider</button>
                </div>
              </form>
            </div>

            <div className="signup-image">
                <figure><img src="./images/completeprofile.png" alt='sign up image'  width='600' height='300'/> </figure>
                {/*<Link to="/login" className="signup-image-link"><u>I am already a member</u></Link>*/}

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default CompleteYourProfile;
