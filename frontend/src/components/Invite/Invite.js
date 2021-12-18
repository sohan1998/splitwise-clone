import React, { Component } from 'react'
import axios from 'axios';
import backendServer from "../../webConfig";
import {
    Button,Grid,Row,
    Col,
    ListGroup,
    Form,
    Card,
    Modal,
  } from "react-bootstrap";



  var useremail = localStorage.getItem('user')


export default class Invite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allgroupsinvited:[],
            currentgroupname:"",
            useremail:localStorage.getItem('useremail')
        }
        this.handleGroupSelect = this.handleGroupSelect.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalSubmit=this.handleModalSubmit.bind(this);
        }
        
          handleModalClose = (e) => {
            this.setState({
                show : false
            })
          }

          handleGroupSelect= (e)=>
          {
            this.setState({
                currentgroupname : e.currentTarget.value,
                show:true
            })
            console.log("Printing current group",this.state.currentgroupname)
          }
          
        handleModalSubmit= (e)=>
          {
            
            var data = {
                useremail:this.state.useremail,
                groupname:this.state.currentgroupname
            }
            console.log("State:",this.state.currentgroupname)
            console.log("Selected group name:",data.selectedgroupname)
            console.log("Printing user email:",useremail)
             axios.post(`${backendServer}/groups/acceptinvite`,data)
            .then((response) => {
                console.log("Status Code : ",response.status);
                console.log("Data Sent ",response.data);
                if(response.status === 200){
                    
                    this.setState({
                        show : false,
                    })
                    window.location.reload()
                }else if(response.status === 202){
                    this.setState({
                        error : response.data
                    })
                    
                }
                
                
            })
            this.setState({
                show : false
            })
          }

        componentDidMount() {

            var data = {
                useremail:this.state.useremail
            }
            
            axios.post(`${backendServer}/groups/allgroupsinvited`, data).then((response) => {
                console.log("Got all groups in which user is a part of on frontend",response.data.groups[0].groups_invited)
                var grouparray=response.data.groups[0].groups_invited
                console.log("Group Array",grouparray)
                var grouplist=[]
                for(var i=0;i<grouparray.length;i++)
                {
                    grouplist.push(grouparray[i])
                }
                console.log(grouplist)
                this.setState({
                  allgroupsinvited : grouplist
                })
                console.log("Printing latest state:",this.state.allgroupsinvited)
    
            })
        }
    
    render() {
        console.log("Current group selected",this.state.currentgroupname)
        return (
            <div>
              <center><h2>Click on the following groups to accept invite</h2></center>
              <br></br>
              <br></br>
              <br></br>
              {this.state.allgroupsinvited.map((user) => (
                <center>
                <Button className="user" variant="warning" /*href={`/groups/${user}`}*/ value={user} onClick={this.handleGroupSelect}>
                {user}
                </Button>
                </center>
                ))}
                <Modal show={this.state.show} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>INVITATION</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Accept the invite to this group
                      {/* {localStorage.getItem("selectedGroupName")} */}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        // variant="primary"
                        // value={item}
                        // type="submit"
                         onClick={this.handleModalSubmit}>
                        ACCEPT
                      </Button>
                    </Modal.Footer>
                  </Modal>
            </div>
        )
    }

}