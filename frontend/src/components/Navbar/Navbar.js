import React, { Component } from 'react';
import '../Navbar/Navbar_style.css';
import logo from '../assets/splitwise_logo.png';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
var redirectVar = null;
var username = localStorage.getItem('username');

class NavbarClass extends React.Component {
    constructor(props) {
        super(props);
    }
    handleLogout = () => {
        localStorage.removeItem('myjwttoken');
        localStorage.removeItem('useremail');
        localStorage.removeItem('username');
        localStorage.removeItem('signupcheck');
        // redirectVar = <Redirect to= "/login"/>
    };
    render() {
        // Displaying the logout button if the user is logged in
        if (localStorage.getItem('useremail')) {
            var userLoggedIn = (
                <ul className='nav navbar-nav navbar-right'>
                    <li>
                        <Link to='/login' onClick={this.handleLogout}>
                            <a className='btn btn-outline signup m-sm-0' href='/login'>
                                Logout
                            </a>
                        </Link>
                    </li>
                </ul>
            );
        } else {
            var userLoggedIn = (
                <ul className='nav navbar-nav navbar-right'>
                    <li>
                        <div className='d-flex flex-row-reverse'>
                            <div className='ml-5'></div>
                            <div className='ml-5'></div>
                            <div className='p-2'>
                                <a className='btn btn-outline signup m-sm-0' href='/signup'>
                                    Sign up
                                </a>
                            </div>
                            <div className='p-2'>
                                <a className='nav-link active login' href='/login'>
                                    Log in
                                    <span className='sr-only'></span>
                                </a>
                            </div>
                        </div>
                    </li>
                </ul>
            );
        }
        return (
            <div>
                {redirectVar}
                <nav className='navbar navbar-light bg-light justify-content-between'>
                    <a className='navbar-brand' href='/home'>
                        <img src={logo} width='130' height='30' class='d-inline-block align-top' alt='Splitwise'></img>
                    </a>
                    {userLoggedIn}
                </nav>
            </div>
        );
    }
}
export default NavbarClass;
