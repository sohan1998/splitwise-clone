import React, { Component } from 'react';
import logo from '../assets/login_logo.png';
import axios from 'axios';
import { Redirect } from 'react-router';
import Nav from 'react-bootstrap/Nav';
import Select, { components } from 'react-select';
import backendServer from '../../webConfig';

export default class Addgroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            emailList: [],
            value: [],
            groupCreated: false,
            error: '',
            groupName: null,
            redirectVar: null,
            useremail: localStorage.getItem('useremail'),
        };
        this.handleGroupName = this.handleGroupName.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleGroupName = (e) => {
        this.setState({
            groupName: e.target.value,
        });
    };

    handleChange = (opt) => {
        console.log(opt);
        let memberlist = [];
        for (let i = 0; i < opt.length; i++) {
            memberlist.push(opt[i].value);
        }
        console.log(memberlist);
        this.setState({ value: memberlist });
    };

    handleCreateGroup = (e) => {
        // console.log("Checking the value of value array",this.state.value)
        e.preventDefault();
        const data = {
            groupmemberemails: this.state.value,
            groupname: this.state.groupName,
            useremail: this.state.useremail,
        };
        console.log(data.groupmemberemails);
        axios.post(`${backendServer}/groups/creategroup/`, data).then((response) => {
            console.log('Status Code : ', response.status);
            console.log('Data Sent ', response.data);
            if (response.status === 200) {
                this.setState({ groupCreated: true, redirectVar: <Redirect to='/dashboard' /> });
            } else if (response.status === 202) {
                this.setState({ groupCreated: false, error: response.data });
            }
        });
    };

    async getOptions() {
        var data = {
            useremail: this.state.useremail,
        };
        axios.post(`${backendServer}/users/allusersexceptself`, data).then((response) => {
            console.log('Got response from backend', response.data.allemails);
            let allmails = response.data.allemails;
            let options = allmails.map((d) => ({ value: d, label: d }));
            this.setState({ emailList: options });
        });
    }

    componentDidMount() {
        this.getOptions();
    }

    render() {
        return (
            <div>
                <div className='row'>
                    {this.state.redirectVar}
                    <div className='col-md-4'></div>

                    <div className='col-md-4'>
                        <div className='mytitle' style={{ fontSize: 30 }}>
                            <center>
                                <b data-testid='AddGP'>ADD A GROUP</b>
                            </center>
                        </div>
                        <form>
                            <div className='form-group inputLogin'>
                                <label for='groupName'>
                                    <b>Group Name</b>
                                </label>
                                <input
                                    type='text'
                                    class='form-control'
                                    id='groupName'
                                    name='groupName'
                                    aria-describedby='emailHelp'
                                    placeholder='Enter Group Name'
                                    onChange={this.handleGroupName}
                                />
                            </div>
                            <div>
                                <b>Email ID of Group Members</b>
                                <Select options={this.state.emailList} isMulti onChange={(opt) => this.handleChange(opt)} />
                            </div>

                            {/* <div className="form-group inputLogin">
                <label for="emailOfGroupMembers"><b>Email ID of group members</b></label>
                <input
                  type="email"
                  className="form-control"
                  id="emailOfGroupMembers"
                  aria-describedby="emailHelp"
                  placeholder="Enter email ID of members"
                  //onChange={this.handleEmailOfMembers}
                />
              </div> */}
                            <button type='submit' class='btn' onClick={this.handleCreateGroup}>
                                Create a group
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
