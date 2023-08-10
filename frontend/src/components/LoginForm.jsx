import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from './UserContext';
import jwtDecode from "jwt-decode";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Create an object to hold the login credentials
    const credentials = {
      username: username,
      password: password,
    };

    // Make an API call to authenticate the user
    axios
      .post("http://127.0.0.1:8000/api/login/", credentials)
      .then((response) => {
        // Handle successful login
        console.log("Login successful!");
        setUser(response.data.user);
        console.log(response.data.user)
        
        
        
        
        // You can store the authentication token or user information in local storage or session storage
        // Redirect the user to the home page or any other authenticated page
        navigate('/')
      })
      .catch((error) => {
        // Handle login error
        console.error("Login failed:", error);
        // You can display an error message to the user
      });
      


      
  };
  const handleLinkedInLogin = () => {
    // Make an API call to your Django backend to get the LinkedIn authorization URL
    axios
      .get("http://localhost:8000/api/linkedin-auth/")
      .then((response) => {
        // Redirect the user to the LinkedIn authorization URL
        window.location.replace(response.data.auth_url);
      })
      .catch((error) => {
        // Handle errors if any
        console.error("Error getting LinkedIn auth URL:", error);
        // You can display an error message to the user if necessary
      });
  };

  
 

  return (
    <div className="main1">
    <section className="sign-in">
      <div className="container1">
        <div className="signin-content">
          <div className="signin-image">
           
            <a href="#" className="signup-image-link">
              Create an account
            </a>
          </div>

          <div className="signin-form">
            <h2 className="form-title1">Login</h2>
            <form onSubmit={handleFormSubmit} className="register-form" id="login-form">
              <div className="form-group1">
                <label htmlFor="your_name">
                  <i className="zmdi zmdi-account material-icons-name"></i>
                </label>
                <input
                  type="text"
                  name="your_name"
                  id="your_name"
                  placeholder="Your Name"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
              <div className="form-group1">
                <label htmlFor="your_pass">
                  <i className="zmdi zmdi-lock"></i>
                </label>
                <input
                  type="password"
                  name="your_pass"
                  id="your_pass"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-group1">
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  className="agree-term"
                />
                <label htmlFor="remember-me" className="label-agree-term">
                  <span><span></span></span>Remember me
                </label>
              </div>
              <div className="form-group1 form-button1">
                <input
                  type="submit"
                  name="signin"
                  id="signin"
                  className="form-submit"
                  value="Log in"
                />
              </div>
            </form>
            <div className="social-login">
              
              <button onClick={handleLinkedInLogin}>Login with LinkedIn</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default LoginForm;
