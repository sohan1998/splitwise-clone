const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/User");
const Group = require("../models/Group");
const kafka= require("../kafka/client")



router.post("/creategroup/",async (req, res) => {
    try{
    console.log("Inside Create Group Post Request");
    const groupExists = await Group.findOne({ groupname: req.body.groupname });
    if (groupExists) 
    res.status(401).json({message: "Group name already exists"});
    
    var useremail=req.body.useremail
    groupmemberemails = req.body.groupmemberemails
    groupmemberemails.push(useremail)
    
    
    console.log(useremail)
    var groupname = req.body.groupname
    
    console.log(groupname)
    console.log(groupmemberemails)
    var groupmembersbeforeinvite = []
    var groupmembersaccepted=[]
    
    for (var i = 0; i < groupmemberemails.length; i++) {
        console.log(groupmemberemails[i])
        if(groupmemberemails[i]!=useremail)
        {
        groupmembersbeforeinvite.push(groupmemberemails[i])
        }
        else
        {
            groupmembersaccepted.push(groupmemberemails[i])
        }
    }
    console.log(groupmembersbeforeinvite)
    console.log(groupmembersaccepted)
    const group= new Group();
    group.groupname=groupname
    group.groupmembers=groupmembersbeforeinvite
    group.groupmembersacceptinvite=groupmembersaccepted

    await User.updateOne({"email":useremail},{$push:{"groups_added":groupname}})
    
    for(let i=0;i<groupmembersbeforeinvite.length;i++)
    {
        await User.updateOne({"email":groupmembersbeforeinvite[i]},{$push:{"groups_invited":groupname}})
    }
    
    await group.save()
    res.status(200).json({message: "Group created successfully"});
}catch (error)
{
    res.writeHead(400, {'Content-Type': 'text/plain'})
}
});


router.post("/acceptinvite/", async (req, res) => {
    try{
        // email we will get from localstorage
        var useremail=req.body.useremail
        var groupname=req.body.groupname
        
        await User.updateOne({"email":useremail},{$pull:{"groups_invited":groupname}})
        await User.updateOne({"email":useremail},{$push:{"groups_added":groupname}})
        
        await Group.updateOne({"groupname":groupname},{$pull:{"groupmembers":useremail}})
        await Group.updateOne({"groupname":groupname},{$push:{"groupmembersacceptinvite":useremail}})
        
        
        res.status(200).json({message: "User invited successfully"});
}catch (error)
{
    res.writeHead(400, {'Content-Type': 'text/plain'})
}
});


router.post("/getallgroupsaccepted/", async (req, res) => {
    try{
        // email we will get from localstorage
        var useremail=req.body.useremail
        const allgroups= await User.find({email:useremail},{groups_added:1});

        res.status(200).json({groups: allgroups});
          
}catch (error)
{
    res.writeHead(400, {'Content-Type': 'text/plain'})
}
});

// router.post("/allgroupsinvited/", async (req, res) => {
//     try{
//        console.log("Inside All groups user has been invited to")
//         var useremail=req.body.useremail
//         const allgroups= await User.find({email:useremail},{groups_invited:1});

//         res.status(200).json({groups: allgroups});
          
// }catch (error)
// {
//     res.writeHead(400, {'Content-Type': 'text/plain'})
// }
// });


router.post("/allgroupsinvited/", async (req, res) => {
    kafka.make_request("getGroups", req.body, function (err, result) {
        console.log("in result");
        // console.log("results in my getgroups ", res
        // );
        if (err) {
          console.log("Inside err");
          res.json({
            status: "error",
            msg: "Could not fetch groups, Try Again.",
          });
        } else {
            // console.log(res)
            res.status(200).json({groups: result});
        }
      });
});




router.post("/getgroupmembers/", async (req, res) => {
    try{
       console.log("Inside All Get Group Member list")
        var groupname=req.body.groupname
        const allemails= await Group.find({"groupname":groupname},{groupmembersacceptinvite:1});
        console.log(allemails[0].groupmembersacceptinvite)
        var emails=allemails[0].groupmembersacceptinvite
        let names=[]
        for(let i=0;i<emails.length;i++)
        {
            const myname=await User.find({email:emails[i]},{name:1});
            console.log(myname[0].name)
            names.push(myname[0].name)
        }
        res.status(200).json({groupmembers: names});
          
}catch (error)
{
    res.writeHead(400, {'Content-Type': 'text/plain'})
}
});

router.post("/fetchemails/", async (req, res) => {
    try{
       console.log("Inside Fetch All Emails")
        var groupname=req.body.groupname
        const allemails= await Group.find({"groupname":groupname},{groupmembersacceptinvite:1});
        console.log(allemails[0].groupmembersacceptinvite)
        var emails=allemails[0].groupmembersacceptinvite
        res.status(200).json({groupmemberemails: emails});
          
}catch (error)
{
    res.writeHead(400, {'Content-Type': 'text/plain'})
}
});

router.post("/leavegroup/", async (req, res) => {
    try{
       console.log("Inside leave groups")
        var useremail=req.body.useremail
        var groupname=req.body.groupname
        await Group.updateOne({"groupname":groupname},{$pull:{"groupmembersacceptinvite":useremail}})
        await User.updateOne({"email":useremail},{$pull:{"groups_added":groupname}})
        
        res.status(200).json({message:"User removed successfully"});
          
}catch (error)
{
    res.writeHead(400, {'Content-Type': 'text/plain'})
}
});





  module.exports = router;