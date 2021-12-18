import React, { Component } from 'react'
import Nav from "react-bootstrap/Nav";
import axios from 'axios';
import {Route} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import history from 'history';
import backendServer from "../../webConfig";



class LeftNavBar extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            usergroups: [],
            myemail:localStorage.getItem('useremail')
        }
    }

     async componentDidMount() {

        var data={
            useremail:this.state.myemail
        }
        console.log("Found email here",this.state.myemail)
        
         await axios.post(`${backendServer}/groups/getallgroupsaccepted/`,data).then((response) => {
            console.log("Inside get all groups")
            //console.log("Got response",response.data.groups[0].groups_added)
            this.setState({usergroups: response.data.groups[0].groups_added});
            
        });
    }


    render() {
        
        return (
            <div>
                 <div className="sidenavbar">
               <Nav defaultActiveKey="/home" className="flex-column">
               <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link href="/addgroup">Add a new group</Nav.Link>
                <Nav.Link href="/profile">Your Profile</Nav.Link>
                <Nav.Link href={`/activity/${this.state.myemail}`} >Recent Activity</Nav.Link>
                <Nav.Link href={`/invitation/${this.state.myemail}`} >View Invitations</Nav.Link>
                {this.state.usergroups.map((user) => (
                <Nav.Link className="user" href={`/groups/${user}`}>
                {user}
                </Nav.Link>
                ))}
                
                </Nav>
                </div>
            </div>
        )
    }
}

export default withRouter(LeftNavBar);