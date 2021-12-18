import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import { Button, Form, FormControl, ControlLabel } from "react-bootstrap";
import backendServer from "../../webConfig";
import { Accordion, Card } from "react-bootstrap";
import "../Group/Grouppage.css";

const customStyles = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'

    }
};

class Grouppage extends Component {
    constructor(props){
        super(props);
        this.state = {  
            groupname:this.props.history.location.pathname.substring(8),
            membernames:[],
            show:false,
            expensedescription:null,
            amount:0,
            billadded:false,
            error:"",
            allbillsinfo:[],
            useremail:localStorage.getItem("useremail"),
            memberemails:[],
            leavegroup:0,
            allbillids:[],
            comment:"",
            delete_comment:"",
            comment_deleted:0
            

        }
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleAmount = this.handleAmount.bind(this);
        this.handleBillSubmit = this.handleBillSubmit.bind(this);
        this.handleLeaveGroup = this.handleLeaveGroup.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        

    }
    handleModalOpen = (e) => {
        this.setState({
            show : true
        })
      }
    handleModalClose = (e) => {
        this.setState({
            show : false
        })
      }
    handleDescription = (e) => {
        this.setState({
            expensedescription : e.target.value
        })
      }
    
    handleAmount = (e) => {
        this.setState({
            amount : e.target.value
        })
      }
      handleCommentChange = (e) => {
          console.log("Printing comment",e.target.value)
        this.setState({comment: e.target.value})
    }

    handleSubmit = (e,data) =>
    {
        
    
        var data_for_comment={
            useremail:this.state.useremail,
            bill_id:data,
            comment:this.state.comment
        }
        console.log("Before API")
         axios.post(`${backendServer}/bills/addcomment`,data_for_comment)
            .then(response => {
                
                if(response.status === 200){
                    axios.post(`${backendServer}/bills/getallbills`,data)
                    .then(response => {
                        console.log("Got response for get all bills")
                        console.log(response.data.allbillsinfo)
                        this.setState({
                            allbillsinfo:response.data.allbillsinfo,
                            
                    }) 
                    });
                    console.log("Comment added successfully")
                }
               
                
            });

    }
    
    handleLeaveGroup = (e) => {
          alert("Are you sure you want to leave th group?")
          var data = {
            useremail:this.state.useremail,
            groupname:this.state.groupname
            }
            axios.post(`${backendServer}/groups/leavegroup`,data)
            .then(response => {
                console.log("Got response leave group")
                
                this.setState({
                    leavegroup : 1
        })
        
      })
      
    }

    handleCommentDelete = (e,cid,bid) => {
        console.log("Got commend iD",cid)
        console.log("Got Bill ID",bid)
        var dataforcomments=
        {
            bid:bid,
            cid:cid
        }
        var data = {
            
            groupname:this.state.groupname,
            
            }
        axios.post(`${backendServer}/bills/deletecomment`,dataforcomments)
            .then(response => {
                console.log("Inside Delete Comment frontend")
                
                if(response.status === 200){
                    
                    axios.post(`${backendServer}/bills/getallbills`,data)
                    .then(response => {
                        console.log("Got response for get all bills")
                        console.log(response.data.allbillsinfo)
                        this.setState({
                            allbillsinfo:response.data.allbillsinfo,
                            comment_delete : 1
                        })
                    });
        
        }
    })
}
      
    
    
    handleBillSubmit = (e) => {
        e.preventDefault();
        var numberofmembers=this.state.membernames.length


        console.log("Number of members:",numberofmembers)
        console.log("Group name:",this.state.groupname)
        console.log("Member names:",this.state.membernames)
        console.log("User email:",this.state.useremail)
        console.log("Member emails:",this.state.memberemails)
        console.log("Bill description:",this.state.expensedescription)
        console.log("Bill amount:",this.state.amount)
        

        var data = {
        billdescription: this.state.expensedescription,
        billamount: this.state.amount,
        groupname:this.state.groupname,
        numberofmembers:numberofmembers,
        membernames:this.state.membernames,
        useremail:this.state.useremail,
        memberemails:this.state.memberemails
        }

        console.log("Amount:",this.state.amount)
        axios.post(`${backendServer}/bills/addbill`,data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Data Sent ",response.data);
                if(response.status === 200){
                    this.setState({
                        billadded : true,
                    })
                    axios.post(`${backendServer}/bills/getallbills`,data)
                    .then(response => {
                        console.log("Got response for get all bills")
                        console.log(response.data.allbillsinfo)
                        this.setState({
                            allbillsinfo:response.data.allbillsinfo,
                            show : false
                    }) 
                    });
            console.log("Bills info is here",this.state.allbillsinfo)
                }else if(response.status === 202){
                    this.setState({
                        billadded : false,
                        error : response.data
                    })
                    
                }
            
            });
            console.log("Successfully bill added:",this.state.billadded)
            
            
            axios.post(`${backendServer}/bills/getallbills`,data)
            .then(response => {
                console.log("Got response for get all bills")
                console.log(response.data.allbillsinfo)
                this.setState({
                    allbillsinfo:response.data.allbillsinfo,
                    show : false
                }) 
            });
            console.log("Bills info is here",this.state.allbillsinfo)
            
  }
      
    
    
        async componentDidMount() {
            var data = {
                expensedescription: this.state.expensedescription,
                amount: this.state.amount,
                groupname:this.state.groupname,
                useremail:this.state.useremail
                }
            var dataforgroups={
                groupname:this.state.groupname
            }

        console.log("Got group name!",this.state.groupname)
         console.log(this.props.history.location.pathname.substring(8)) //Getting the exact apartment number
         await axios.post(`${backendServer}/groups/getgroupmembers`,dataforgroups)
                    .then((response) => {
                        console.log("Inside app.get of frontend")
                        console.log("Got group members:",response.data.groupmembers)
                        this.setState({membernames: response.data.groupmembers});
                        console.log("Checking whether users in groups are there or not", this.state.membernames)

                    })

                    await axios.post(`${backendServer}/bills/getallbills`,data)
                    .then(response => {
                        console.log("Got response for get all bills")
                        console.log(response.data.allbillsinfo)
                        this.setState({
                            allbillsinfo:response.data.allbillsinfo,
                            show : false
                    }) 
                    });
            console.log("Bills info is here",this.state.allbillsinfo)
                    

                    await axios.post(`${backendServer}/groups/fetchemails`,data)
                    .then((response) => {
                        console.log("Getting user emails at frontend")
                        console.log(response.data.groupmemberemails)
                        this.setState({memberemails: response.data.groupmemberemails});
                        console.log("Checking whether users in groups are there or not", this.state.memberemails)

                    })
                console.log("Got all bills info state",this.state.allbillsinfo)
                
                let allcomments=[]
                
                for(let i=0;i<this.state.allbillsinfo.length;i++)
                {
                    allcomments.push(this.state.allbillsinfo[i].billcomments)
                }
                console.log("Printing all comments",allcomments)

                this.setState({
                    allcomments : allcomments
                })
                console.log("Printing all comments2",this.state.allcomments)
               
                
                // await axios.post(`${backendServer}/bills/getcomments`,dataforbills)
                //     .then((response) => {
                //         console.log("Getting user emails at frontend")
                //         console.log("Got response for comments",response.data.allcomments)

                //     })
                    
                    
          
      }

    render() {
        
        
        return (
            <div>
                {/* <center><h3>{this.state.groupname}</h3></center>
                <center><Button onClick={this.handleModalOpen}>Add an expense</Button></center> */}
                <div className="d-flex my-2 justify-content-center">
                        <h2>{this.state.groupname}</h2>
                    </div>
                <div className="d-flex my-3 justify-content-center">
                        <Button onClick={this.handleModalOpen}>Add an Expense</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {/* <Button onClick={this.handleLeaveGroup}>Leave Group</Button> */}
                        <Link to="/dashboard" onClick={this.handleLeaveGroup} className="btn btn-primary">Leave Group</Link>
                </div>
                <div className="row">
                <div className="col-md-3 border-0">
                <center><b>Members of {this.state.groupname}</b></center>
                {this.state.membernames.map((user) => (
                <div className="d-flex my-1 border 1px"><ul><li>{user}</li></ul></div>
                
            ))}
            </div>
            <div className="col-md-6 border-0">
            <Modal show={this.state.show}>
                <Modal.Header>Add a bill</Modal.Header>
                <Modal.Body>
                <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    onChange={this.handleDescription}/>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter amount"
                    onChange={this.handleAmount}
                  />
                  </Form.Group>
                 </Form>
                </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.handleModalClose}>
                    Close Bill
                </Button>
                <Button onClick={this.handleBillSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
                
                </Modal>
                <br></br>
                

                <center><b>Bills</b></center>
                
                {this.state.allbillsinfo.map((user) => (
                <div class="thuscontainer">
                <div className="d-flex my-1 border 1px">
                    <ul><li><b>Description:</b>  {user.billdescription}<br></br><b>Amount:</b>  {user.billamount}</li></ul>
                    </div>
                <div className="d-flex flex-column-reverse border 1px">

                {user.billcomments.map((comment) => 
                (
                   
                    <div className="d-flex my-1 border 1px">
                        <b>{comment.comment_createdby}</b>: &nbsp; {comment.comment_message}
                
                        <div><button type="button" className="delButton btn-danger" onClick={(e) => { this.handleCommentDelete(e, comment.comment_id,user._id) }}>Delete Comment</button></div>
                    </div>
                ))}
                
                <form>
                    <input type="text" onChange={
                                        this.handleCommentChange
                                    }></input>
                    
                    <br></br>
                    <button type="submit" className="btn-success" onClick={(e) => { this.handleSubmit(e, user._id) }}>Add Comment</button>
                </form>
                {/* <ul><li><b>Commented By:</b>  {user.billcomments.comment_createdby}<br></br><b>Amount:</b>  {user.billamount}</li></ul> */}
                </div>
                </div>
                ))}


               
                
    
            </div>
            </div>
             </div>
           
            
        )
    }
}

export default withRouter(Grouppage);
