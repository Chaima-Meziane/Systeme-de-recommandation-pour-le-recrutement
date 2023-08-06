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
        <div className="container1">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title1">Complete Your Profile</h2>
              <form onSubmit={handleFormSubmit} className="register-form" id="register-form" encType="multipart/form-data">
                <div className="form-group1">
                  <label htmlFor="phone_number"><i className="material-icons" style={iconStyle}>phone</i></label>
                  <input type="text" name="phone_number" id="phone_number" onChange={handlePhoneNumberChange} placeholder="Your Phone Number"/>
                </div>
                <div className="form-group1">
                  <label htmlFor="address"><i className="material-icons" style={iconStyle}>gps_fixed</i></label>
                  <input type="text" name="address" id="address" value={address} onChange={handleAddressChange} placeholder="Your Address"/>
                </div>
                <div className="form-group1">
                    <label htmlFor="resume"> Add Your Resume</label>
                    <br/><br/><br/>
                    <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange}/>
                </div>
                
                <div className="form-group1 form-button1">
                  <button type="submit" name="signup" id="signup" className="form-submit" value="Register">Register</button>
                </div>
              </form>
            </div>

            <div className="signup-image">
                {/* Replace the source path with the correct path to your image */}
                <figure><img src="./images/about.webp" alt='sign up image' /> </figure>
                <a href="#" className="signup-image-link">I am already a member</a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default CompleteYourProfile;
