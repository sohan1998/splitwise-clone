import React, { Component } from 'react';
import '../Profile/Profile.css';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import { Button, Form, FormControl, ControlLabel } from 'react-bootstrap';
import backendServer from '../../webConfig';
import defaultpic from '../assets/default.jpg';

var useremail = localStorage.getItem('useremail');
var username = localStorage.getItem('username');

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            useremail: useremail,
            username: username,
            // selectedFile: '',
            selectedFile: defaultpic,
            amazonurl: 'https://splitwisebucket1.s3.us-east-2.amazonaws.com/depositphotos_52374307-stock-illustration-blue-profile-icon.jpg',
        };
        // this.onFileChange=this.onFileChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this);
        this.imageHandler = this.imageHandler.bind(this);
    }

    async componentDidMount() {
        var data = {
            useremail: this.state.useremail,
        };
        console.log('Email at frontend:', this.state.useremail);
        await axios.post(`${backendServer}/upload/getimageonload`, data).then((res) => {
            if (res.status === 200) {
                console.log('Got response', res.data.imagelink[0].profileImg);
                this.setState({ amazonurl: res.data.imagelink[0].profileImg });
            } else {
                console.log('There was some error!');
            }
        });
    }

    imageHandler = (e) => {
        console.log(e.target.files[0]);
        this.setState({ selectedFile: e.target.files[0] });
    };

    onSubmit = (e, file) => {
        const formData = new FormData();
        console.log('Inside submit data!');
        console.log('Got state of file:', file);
        formData.append('file', file);
        formData.append('useremail', useremail);
        axios.post(`${backendServer}/upload/imageupload`, formData).then((res) => {
            if (res.status === 200) {
                console.log('Image uploaded on S3!');
                var data = {
                    useremail,
                };
                console.log('Got email!', data.useremail);
                axios.post(`${backendServer}/upload/getimage`, data).then((res) => {
                    console.log('Inside frontend API!');
                    if (res.status === 200) {
                        console.log('Got response', res.data.imagelink[0].profileImg);
                        this.setState({ amazonurl: res.data.imagelink[0].profileImg });
                    } else {
                        console.log('There was some error!');
                    }
                });
            } else {
                console.log('There was some error!');
            }
        });
    };

    render() {
        return (
            <center>
                <div>
                    <h2>YOUR ACCOUNT</h2>
                </div>
                <br></br>
                <div>
                    <h5>Your name:</h5>
                </div>
                {this.state.username}
                <br></br>
                <br></br>
                <div>
                    <h5>Your email id:</h5>
                    {this.state.useremail}
                </div>
                <br></br>
                <div className='ImgUpload'>
                    <div className='myImage'>
                        <h5 className='heading'>Add your Image</h5>
                        <div className='form-group'>
                            <input type='file' id='file' accept='.png, .jpg, .jpeg' onChange={this.imageHandler} />
                        </div>
                        <div className='img-holder'>
                            {console.log(this.state.selectedFile)}
                            <img src={this.state.amazonurl} alt='' id='img' className='img' />
                        </div>
                        <div className='form-group'>
                            <button
                                className='btn btn-primary'
                                type='button'
                                onClick={(e) => {
                                    this.onSubmit(e, this.state.selectedFile);
                                }}
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </center>
        );
    }
}
