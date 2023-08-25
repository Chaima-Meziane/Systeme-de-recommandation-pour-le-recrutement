import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { UserContext } from './UserContext';
import { useNavigate } from "react-router-dom";
const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const userType = "candidat"; // Set the default value to "candidat" directly
  let navigate = useNavigate();
  const { user, setUser } = useContext(UserContext); // Make sure to set the user using context
  
  // Clear user data from local storage when redirected to login
  useEffect(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, [setUser]);

  const handleNameChange = (e) => {
    setUsername(e.target.value);
  };
  

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

  
    // Create an object to hold the user data
    const formData = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email,
      password: password,
      is_candidat: true, // Always set to true since the user is a "candidat"
    };
    
    // Make an API call to register the user
    axios.post("http://127.0.0.1:8000/api/register/", formData)
      .then((response) => {
        // Handle successful registration
        console.log("Registration successful!");
        // Set the user information in the context
        setUser(response.data); // Assuming the response contains user data
        console.log(response.data)
        // Redirect to the complete your profile page
        navigate('/completeprofile');
      })
      .catch((error) => {
        // Handle registration error
        console.error("Registration failed:", error);
        // You can also display an error message to the user.
      });
  };
  const formGroup1Style = {
    display: "flex",
    
  };

  return (
    <div className="main1">
      <section className="signup1">
        <div className="container1">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title1">Sign up</h2>
              <form onSubmit={handleFormSubmit} className="register-form1" id="register-form">
              <div className="form-group1" style={formGroup1Style}>
                <label htmlFor="firstName"><i className="zmdi zmdi-account material-icons-name"></i></label>
                <input type="text" name="firstName" id="firstName" onChange={handleFirstNameChange} placeholder="First Name" required/>
                <input type="text" name="lastName" id="lastName" onChange={handleLastNameChange} placeholder="Last Name" required/>
              </div>
              
                
                
                <div className="form-group1">
                  <label htmlFor="name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                  <input type="text" name="name" id="name" onChange={handleNameChange} placeholder="Your Name" required/>
                </div>
                <div className="form-group1">
                  <label htmlFor="email"><i className="zmdi zmdi-email"></i></label>
                  <input type="email" name="email" id="email" value={email} onChange={handleEmailChange} placeholder="Your Email" required/>
                </div>
                <div className="form-group1">
                  <label htmlFor="pass"><i className="zmdi zmdi-lock"></i></label>
                  <input type="password" name="pass" id="pass" value={password} onChange={handlePasswordChange} placeholder="Password" required/>
                </div>

                <div className="form-group1 form-button1">
                  <button type="submit" name="signup" id="signup" className="form-submit" value="Register">Register</button>
                </div>
              </form>
            </div>

            <div className="signup-image">
                <figure><img src='./images/about.webp' alt='sign up image' /> </figure>
                <a href="/login" className="signup-image-link"><u>I am already a member</u></a>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterForm;
