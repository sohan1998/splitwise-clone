import React, {Component} from "react";
import logo from "../assets/login_logo.png";
import axios from 'axios';
import {Redirect} from 'react-router';
import Nav from "react-bootstrap/Nav";
import "../Dashboard/dashboard.css";
import LeftNavBar from "../LeftNavBar/LeftNavBar";
import {Button, Form} from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";
import Select, {components} from 'react-select';
import backendServer from "../../webConfig";
import bg_image from "../assets/splitwise_home.png";
import bg_image1 from "../assets/splitwise_home_2.png";
import bg_image2 from "../assets/splitwise_home_3.png";

var redirectVar = null




class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            useremail: localStorage.getItem('useremail'),
            username: "",

            balance: 0,
            alluserstats: [],
            userlistoptions: [],
            nametosettleup: "",
            emailtosettle: "",
            error: "",
            alloverallstats: [],
            totalowe:[],
            totalowed:[],
            userobjectsettle: [],
            useramount: 0,
            amountowe:0,
            amountowed:0
            
           
        }
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleSettleUpEmail = this.handleSettleUpEmail.bind(this);
        this.submitSettleUp = this.submitSettleUp.bind(this);
    }
    handleModalOpen = (e) => {
        this.setState({show: true})
    }
    handleModalClose = (e) => {
        this.setState({show: false})
    }
    handleSettleUpEmail = (e) => {
        let user = JSON.parse(e.target.value)
        this.setState({emailtosettle: user.user, useramount: user.amount})


    }

    submitSettleUp = (e) => {
        e.preventDefault();
        // console.log("Getting name to settle up:",this.state.nametosettleup)
        var data = { // nametosettle:this.state.nametosettleup,
            useremail:this.state.useremail,
            settlemail: this.state.emailtosettle,
            useramount: Math.abs(this.state.useramount)

        }

        
        axios.post(`${backendServer}/transaction/settleup`, data).then((response) => {
            console.log("Status Code : ", response.status);
            console.log("Data Sent ", response.data);
            if (response.status === 200) {

                this.setState({show: false})
                window.location.reload()
            } else if (response.status === 202) {
                this.setState({error: response.data})

            }


        })
    }


      async componentDidMount() {

        
        

        var data = {
            useremail: this.state.useremail
        }
        console.log("Email at frontend:", this.state.useremail)
        await axios.post(`${backendServer}/users/getnamefordashboard`, data).then((response) => {
            console.log("Got response from backend", response)
            console.log("Got user name on Dashboard:", response.data.username[0].name)
            this.setState({username: response.data.username[0].name});
            console.log("Name found here:", response.data.username[0].name)
            localStorage.setItem("username", response.data.username[0].name)

        })



          await axios.post(`${backendServer}/transaction/allstats`, data).then((response) => {
             console.log("Got All stats on frontend", response.data.Alluserstats)
             let allstats=response.data.Alluserstats
             console.log("All stats",allstats)
             let owe=[]
             let owed=[]
             let owetotal=0
             let owedtotal=0
             let totalbalance=0
             for(let i=0;i<allstats.length;i++)
             {
                 var stat=allstats[i]
                 console.log("Yo",allstats[i])
                 if(stat.splitamount<0)
                 {
                    owe.push({"user":stat._id,"amount":stat.splitamount})
                    owetotal=owetotal+Math.abs(stat.splitamount)

                 }
                 else if(stat.splitamount>0)
                 {
                    owed.push({"user":stat._id,"amount":stat.splitamount})
                    owedtotal=owedtotal+Math.abs(stat.splitamount)
                 }
             }
             console.log("OWE:",owe)
             console.log("OWED",owed)
             this.setState({
                totalowe: owe,
                totalowed: owed,
                amountowe:owetotal,
                amountowed:owedtotal
                })
            totalbalance=this.state.amountowed-this.state.amountowe
            this.setState({balance:totalbalance})
            console.log("Printing state owe:",this.state.totalowe)
            console.log("Printing state owed",this.state.totalowed)
            console.log("Printing state balance",this.state.balance)

            

       
    })
}
        
        
    


    render() {
       
        return (
            <div>
            <div name="dashboarddisplay">
                <center>
                    <h3 data-testid="Dashboard">{
                        this.state.username
                    }'s Dashboard</h3>
                </center>
                <br></br>
               <center><Button onClick={this.handleModalOpen}>Settle up</Button></center>
               <Modal show={this.state.show}>
            <Modal.Header>Settle up</Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group>
            <Form.Label>Select Who You Want to Settle Up With :</Form.Label>
            <Form.Control
              as="select"
            onChange={this.handleSettleUpEmail}
            >
              <option selected disabled hidden>
                Select one person
              </option>
              {this.state.totalowe.map((user) => (
                <option value={JSON.stringify(user)}>
                  {user.user}: &nbsp; {Math.abs(user.amount)}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
             </Form>
            </Modal.Body>
        <Modal.Footer>
            <Button onClick={this.handleModalClose}>
                Close Bill
            </Button>
            <Button onClick={this.submitSettleUp}>
                Save Changes
            </Button>
        </Modal.Footer>
            
            </Modal>
            </div>
            <div className="row">
                <div className="col-md-3">
                <div ClassName="myNavBar">
                    <LeftNavBar/>
                    </div>

                </div>
                <div className="col-md-3">
                    <b>Total balance</b>
                    <div><b>$ </b>{this.state.balance}</div>
                </div>
                <div className="col-md-3">
                    <b>You owe</b>
                    <div><b>$ </b>{this.state.amountowe}
                    </div><br></br>
                    <div>
                    {this.state.totalowe.map((abc) => (
            <ul><li>You owe <b>{abc.user}</b> <b>$</b>{(Math.abs(abc.amount))}</li></ul>
            ))}
                    </div>
                </div>
                <div className="col-md-3">
                    <b>You are owed</b>
                    <div><b>$ </b>{this.state.amountowed}</div><br></br>
                    <div>
                    {this.state.totalowed.map((abc) => (
            <ul><li><b>{abc.user}</b> owes you <b>$</b>{abc.amount}</li></ul>
            ))}
                    </div>
                </div>

            </div>
            {redirectVar} </div>
        );
    }
}
export default Dashboard;