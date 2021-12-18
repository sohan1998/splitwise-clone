import React, { Component } from "react";
import logo from "../assets/login_logo.png";
import "../Login/Login.css";
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import backendServer from "../../webConfig";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {login} from "../../actions/actions.js";
var loginsuccess = ""


class Login extends Component {
  constructor(props) {
    super(props);
    // this.handleLogout = this.handleLogout.bind(this);
    this.state = {
      email: null,
      password: null,
      authFlag: false,
      //emailerror:"",
      //passsworderror:"", 
  }
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitOwnerLogin = this.submitOwnerLogin.bind(this);
    
  }

emailChangeHandler = (e) => {
  this.setState({
      email : e.target.value
  })
}
passwordChangeHandler = (e) => {
  this.setState({
      password : e.target.value
  })
}

submitOwnerLogin = (e) => {
  var headers = new Headers();
  console.log("Inside submitowner")
  e.preventDefault();
  const data = {
      email : this.state.email,
      password : this.state.password
  }
  this.props.login(data)
}


componentWillReceiveProps(nextProps) {
  console.log("JSON.stringify(nextProps)", JSON.stringify(nextProps))
  if (nextProps.ld.logindetails === true) {
    loginsuccess = "true"
    console.log("loginsuccess", loginsuccess)
    console.log("nextProps.logindetails", nextProps.ld.logindetails)
    //this.props.posts.unshift(nextProps.newPost);
  }
  else
    loginsuccess = "false"
}


  render() {
    var redirectVar = null;
    
    if(localStorage.getItem('myjwttoken') && localStorage.getItem('useremail') ){
          console.log("Local storage found")
          redirectVar = <Redirect to= "/dashboard"/>
        }
    return (
     <div className="container">
      {redirectVar}
        <div className="row">
          <img src={logo} class="col-md-3" height="240" alt="Splitwise"></img>
          <div className="col-md-4">
            <h4 data-testid="LoginTest" style={{ color: "gray", fontSize: 19, marginBottom: 22 }}>
              WELCOME TO SPLITWISE
            </h4>
            <form>
              <div class="form-group inputLogin">
                <label for="exampleInputEmail1">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                 onChange = {this.emailChangeHandler}
                 //errorText={this.state.emailerror}
                />
              </div>
              <div class="form-group inputLogin">
                <label for="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  onChange = {this.passwordChangeHandler}
                 // errorText={this.state.passsworderror}
                />
              </div>
              <button onClick={this.submitOwnerLogin} class="btn">
                Log in
              </button>
              <p style={{marginTop: 10}}>
                Forgot your password? <a href="#">Click here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  login : PropTypes.func.isRequired,
  ld : PropTypes.string
}

const mapStateToProps = state => ({
ld : state.login
})

export default connect(mapStateToProps, {login})(Login); 