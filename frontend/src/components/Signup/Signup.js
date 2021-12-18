import React, { Component } from 'react';
import logo from '../assets/login_logo.png';
import '../Signup/Signup.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import backendServer from '../../webConfig';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signup } from '../../actions/actions.js';
var swal = require('sweetalert');

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            email: null,
            password: null,
            error: '',
            userCreated: false,
        };

        this.handleuserCreate = this.handleUserCreate.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
    }

    componentWillMount() {
        this.setState({ userCreated: false });
    }

    handleName = (e) => {
        this.setState({ name: e.target.value });
    };

    handleEmail = (e) => {
        this.setState({ email: e.target.value });
    };

    handlePassword = (e) => {
        this.setState({ password: e.target.value });
    };

    handleUserCreate = (e) => {
        var headers = new Headers();
        e.preventDefault();
        var data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
        };
        this.props.signup(data);
    };

    componentWillReceiveProps(nextProps) {
        console.log('nextProps.ss.signupstatus', JSON.stringify(nextProps.ss.signupstatus));
        if (nextProps.ss.signupstatus) {
            console.log('nextProps.ss.signupstatus', nextProps.ss.signupstatus);
            // this.props.posts.unshift(nextProps.newPost);
        } else if (nextProps.ss.signupstatus == true) {
            swal('You are successfully signed up!', 'Please Login now.', 'success');
            this.setState({ userCreated: true });
        } else if (nextProps.ss.signupstatus == false) {
            this.setState({ userCreated: false });
        }
    }

    render() {
        var redirectVar = null;

        if (localStorage.getItem('signupcheck')) {
            console.log('Local storage found');
            redirectVar = <Redirect to='/login' />;
        }
        return (
            <div className='container'>
                {redirectVar}
                <div className='row'>
                    <img src={logo} class='col-md-3' height='240' alt='Splitwise'></img>
                    <div className='col-md-4'>
                        <h4
                            data-testid='SignupTest'
                            style={{
                                color: 'gray',
                                fontSize: 19,
                                marginBottom: 22,
                            }}
                        >
                            INTRODUCE YOURSELF
                        </h4>
                        <form>
                            <div className='form-group inputLogin'>
                                <label for='exampleInputName' style={{ fontSize: 30 }}>
                                    Hi there! My name is
                                </label>
                                <input
                                    type='text'
                                    class='form-control'
                                    id='exampleInputName'
                                    aria-describedby='emailHelp'
                                    placeholder='Enter Full Name'
                                    onChange={this.handleName}
                                />
                            </div>
                            <div className='form-group inputLogin'>
                                <label for='exampleInputEmail1'>
                                    Here's my&nbsp;
                                    <b>email address:</b>
                                </label>
                                <input
                                    type='email'
                                    className='form-control'
                                    id='exampleInputEmail1'
                                    aria-describedby='emailHelp'
                                    placeholder='Enter email'
                                    onChange={this.handleEmail}
                                />
                            </div>
                            <div className='form-group inputLogin'>
                                <label for='exampleInputPassword1'>
                                    And here's my&nbsp;
                                    <b>password:</b>
                                </label>
                                <input
                                    type='password'
                                    className='form-control'
                                    id='exampleInputPassword1'
                                    placeholder='Password'
                                    onChange={this.handlePassword}
                                />
                            </div>
                            <button type='submit' class='btn' onClick={this.handleUserCreate}>
                                Sign me up!
                            </button>
                            <p
                                style={{
                                    marginTop: 10,
                                    fontSize: 12,
                                }}
                            >
                                <a href='#'>By signing up, you accept the Splitwise Terms of Service.</a>
                            </p>
                        </form>
                    </div>
                </div>
                {redirectVar}{' '}
            </div>
        );
    }
}

Signup.propTypes = {
    signup: PropTypes.func.isRequired,
    ss: PropTypes.string,
};

const mapStateToProps = (state) => ({
    ss: state.usersignup,
});

export default connect(mapStateToProps, { signup })(Signup);
