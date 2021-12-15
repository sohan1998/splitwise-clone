import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import NavbarClass from './Navbar/Navbar';
import Landing from './Landing/Landing';
import Signup from './Signup/Signup';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Addgroup from './Group/Addgroup';
import Grouppage from './Group/Grouppage';
import Profile from './Profile/Profile';
import Activity from './Activity/Activity';
import Invite from './Invite/Invite';
import { Redirect } from 'react-router';

class Main extends Component {
    render() {
        return (
            <div>
                {' '}
                {/*Render Different Component based on Route*/}
                <Route path='/' component={NavbarClass} />
                <Route path='/home' component={Landing} />
                <Route path='/login' component={Login} />
                <Route path='/signup' component={Signup} />
                <Route exact path='/dashboard' component={Dashboard} />
                <Route path='/addgroup' component={Addgroup} />
                <Route path='/groups' component={Grouppage} />
                <Route path='/profile' component={Profile} />
                <Route path='/activity' component={Activity} />
                <Route path='/invitation' component={Invite} />
            </div>
        );
    }
}
// Export The Main Component
export default Main;
