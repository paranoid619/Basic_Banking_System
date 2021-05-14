
 const express = require("express");
 const mongoose = require("mongoose");
 const app = express();
 app.set('view engine', 'ejs');
 app.use(express.urlencoded({extended: true}));
 app.use(express.static("public"));

 mongoose.connect("mongodb+srv://admin-sourav:souravkumar@basic-banking-system.n8p1m.mongodb.net/CustomerDB", {useNewUrlParser: true, useUnifiedTopology: true});

 const CustomerSchema = new mongoose.Schema ({
     accountnumber : Number,
     name : String,
     email : String,
     contact : Number,
    bankBalance : Number,
    transactions: []
});

const Customer = mongoose.model("Customer",CustomerSchema);

const Customerarray =[

 {accountnumber : 588378619  , name :  "Piyush"  ,       email : "piyush2k19@yahoo.com"  , contact : 9899396219    , bankBalance :  117000 ,transations:[]},
    {accountnumber : 588378620  , name :  "Arpit"   ,       email :  "arpitad@gmail.com"     , contact :  7838561789       , bankBalance : 321900 ,transations:[]}, 
    {accountnumber : 588378621   , name :   "Bunty"    ,    email : "sk@gmail.com"       ,contact :  8875676712      , bankBalance :   765631 ,transations:[]},
    {accountnumber:  588378622    , name :  "Mayank"     ,   email : "mayank224@gmail.com"     , contact :   9988776655     , bankBalance : 565656 ,transations:[]},   
    {accountnumber:  588378623     , name :  "Nishant"   ,   email : "nkg@gmail.com"      , contact :    9080706034    , bankBalance : 453671 ,transations:[]},
    {accountnumber:  588378624     , name :  "Bhagwat"   ,   email : "miglani@gmail.com"      , contact :  8505963421      , bankBalance : 1129090 ,transations:[]},
  {accountnumber:  588378625    , name :  "Kunal"     ,   email : "lanuk@gmail.com"      , contact :   7867342144     , bankBalance :  898989 ,transations:[]},
   { accountnumber:   588378626     , name :  "Megha"     ,   email : "meghakatheriya@gmail.com"    , contact :     9988003215   , bankBalance :456371 ,transations:[]}, 
  {  accountnumber:  588378627    , name :  "Harpreet"    ,   email : "kaurharpreet@gmail.com"      , contact :    7657689765 , bankBalance :690000 ,transations:[] },
 {   accountnumber:  588378628      , name :  "Gautam"    ,   email : "gautam2217@gmail.com"      , contact :    9922312456    , bankBalance :   232323    ,transations:[]}

];



// Customer.insertMany(Customerarray,function(err){
//   if(!err){  
//        console.log("Items added Successfully to database");
//     }
// });

app.get("/",function(req,res){
    res.render("home");
});

app.get("/transferhistoryinfo",(req,res) => {
  res.render("transferhistoryinfo");
});

 app.post("/customers",function(req,res) {

    Customer.find({},function(err,foundcustomer){
        if(!err){
        res.render("customers",{customers : foundcustomer});

        }
    });
});


app.post("/transferinfo",(req,res) => {
  res.render("transferinfo");
});

app.post("/transfermoney",(req,res) => {
  const transferfrom = req.body.transferfrom;
  const transferto = req.body.transferto;
  const amount = req.body.amount;

  if(transferfrom === transferto){
    res.render("sameaccountfailure");
  }else{
   
    Customer.find({accountnumber: transferfrom},(err,sendercustomer) => {

      console.log(sendercustomer);
      if(!err){
        if(sendercustomer.length!==0 && sendercustomer[0].bankBalance >= amount){
          console.log("sendercustomer bank balance :" + sendercustomer[0].bankBalance)
          const newbalance = Number(sendercustomer[0].bankBalance) - Number(amount);
          console.log("newbalance:" + newbalance); 

     
          Customer.updateOne({accountnumber: transferfrom},{$set:{bankBalance: newbalance}},(err) => {
            if(!err){
               //sendercustomer.transactions.push("sent:" + amount);
              // sendercustomer.save();
              console.log(sendercustomer.transactions);
              console.log("Successfully updated sender's account.");
            }
          });

   
          Customer.find({accountnumber: transferto},(err,receivercustomer) => {
            if(!err){
                const newbalanceto = Number(receivercustomer[0].bankBalance) + Number(amount);
    
                Customer.updateOne({accountnumber: transferto},{bankBalance: newbalanceto},(err) => {
                  if(!err){
                    sendercustomer[0].transactions.push("sent: " + amount + " to " + receivercustomer[0].name);
                    sendercustomer[0].save();
                    receivercustomer[0].transactions.push("received: " + amount + " from " + sendercustomer[0].name);
                    receivercustomer[0].save();
                    console.log(receivercustomer[0].transactions);
                    console.log("Successfully updated receiver's account.");
                  }
                });
                res.render("paymentsuccessful");
            }
          });
        }else{
          res.render("paymentfailure");
        }
      }
    });
  }
});




// app.get("/",function(req,res){
//    res.render("customers",)
// })
app.post("/transferhistoryinfo",(req,res) => {
  const an = req.body.accountnumber;
  Customer.find({accountnumber: an},(err,customer) => {
    if(!err){
      console.log(customer[0].transactions);
      res.render("showtransactionhistory",{alltransactions: customer[0].transactions});
    }
  });
});




app.listen(3000, function() {
  console.log("Server started successfully");
});






// //import express from "express";
// //import ejs from "ejs";
// //import mongoose from "mongoose";

// //const app = express();

// app.set("view engine", "ejs");
// app.use(express.urlencoded({extended: true}));
// app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/customersDB",{useNewUrlParser: true, useUnifiedTopology: true});


// const customerSchema =  new mongoose.Schema({
//   accountno: Number,
//   name: String,
//   email: String,
//   contact: Number,
//   bankBalance: Number,
//   transactions: []
// });

// const Customer = mongoose.model("Customer",customerSchema);

// const customersarray = [
//   {accountno: 9213921301 ,name: "Batista"  ,email: "souravbot123@gmail.com"   ,contact: 9999999901    ,bankBalance:100000,transations:[] },
//   {accountno: 9213921302 ,name: "Rao"   ,email: "rmayank99@gmail.com"  ,contact:  9999999902   ,bankBalance:10000,transations:[]  },
//   {accountno: 9213921303 ,name: "Ritik"   ,email: "ritiksherawat@gmail.com"  ,contact:  9999999903   ,bankBalance:200000,transations:[]  },
//   {accountno: 9213921304 ,name: "Khulli"   ,email:  "rokorakshit@gmail.com"  ,contact:  9999999904   ,bankBalance:30000,transations:[]  },
//   {accountno: 9213921305 ,name: "Piyush"   ,email: "piyushrocks21@gmail.com"  ,contact:  9999999905    ,bankBalance:40000,transations:[]   },
//   {accountno: 9213921306 ,name: "jonty"   ,email:  "jontyrocks24@gmail.com"  ,contact:  9999999906    ,bankBalance:500000,transations:[]   },
//   {accountno: 9213921307 ,name: "Ishu"   ,email: "mansukhrathore@gmail.com"   ,contact:  9999999907    ,bankBalance:450000,transations:[]  },
//   {accountno: 9213921308 ,name: "Sumit"   ,email: "sumitsharma@gmail.com"   ,contact: 9999999908     ,bankBalance:50000,transations:[]  },
//   {accountno: 9213921309 ,name: "Vikas"  ,email:  "vikasjangra@gmail.com"  ,contact: 9999999909     ,bankBalance:60000,transations:[]  },
//   {accountno: 9213921310 ,name: "Bhaskar"  ,email: "bhaskar@gmail.com"   ,contact: 9999999910     ,bankBalance:70000,transations:[]  }
// ];

//   // Customer.insertMany(customersarray,(err,result) => {
//   //   if(!err){
//   //     console.log("Array of customers added successfully");
//   //   }
//   // });

// ///////////////////////    Get Requests     ////////////////////////
// app.get("/",(req,res) => {
//   res.render("home");
// });
// app.get("/transferhistoryinfo",(req,res) => {
//   res.render("transferhistoryinfo");
// });

// ///////////////////////    Post requests    //////////////////////
// //////////////// show all customers  ///////////////
// app.post("/customers",(req,res) => {
//   Customer.find({},(err,foundCustomers) => {
//     if(!err){
//       res.render("customers",{customers: foundCustomers});
//     }
//   })
// });

// app.post("/transferinfo",(req,res) => {
//   res.render("transferinfo");
// });

// //////////////// Transfer money from one account to another  ///////////////
// app.post("/transfermoney",(req,res) => {
//   const transferfrom = req.body.transferfrom;
//   const transferto = req.body.transferto;
//   const amount = req.body.amount;

//   if(transferfrom === transferto){
//     res.render("sameaccountfailure");
//   }else{
//     //////////////////////   find receiver   /////////////////////////
//     Customer.find({accountno: transferfrom},(err,sendercustomer) => {
//       if(!err){
//         if(sendercustomer.bankBalance >= amount){
//           console.log("sendercustomer bank balance :" + sendercustomer.bankBalance)
//           const newbalance = Number(sendercustomer.bankBalance) - Number(amount);
//           console.log("newbalance:" + newbalance);
//      //////////////////////// Update sender bank balance ////////////
//           Customer.updateOne({accountno: transferfrom},{$set:{bankBalance: newbalance}},(err) => {
//             if(!err){
//               // sendercustomer.transactions.push("sent:" + amount);
//               // sendercustomer.save();
//               console.log(sendercustomer.transactions);
//               console.log("Successfully updated sender's account.");
//             }
//           });

//     //////////////////////   find receiver   /////////////////////////
//           Customer.findOne({accountno: transferto},(err,receivercustomer) => {
//             if(!err){
//                 const newbalanceto = Number(receivercustomer.bankBalance) + Number(amount);
//     //////////////////////// Update receiver bank balance ////////////
//                 Customer.updateOne({accountno: transferto},{bankBalance: newbalanceto},(err) => {
//                   if(!err){
//                     sendercustomer.transactions.push("sent: " + amount + " to " + receivercustomer.name);
//                     sendercustomer.save();
//                     receivercustomer.transactions.push("received: " + amount + " from " + sendercustomer.name);
//                     receivercustomer.save();
//                     console.log(receivercustomer.transactions);
//                     console.log("Successfully updated receiver's account.");
//                   }
//                 });
//                 res.render("paymentsuccessful");
//             }
//           });
//         }else{
//           res.render("paymentfailure");
//         }
//       }
//     });
//   }
// });

// //////////////// show all previous transactions  ///////////////
// app.post("/transferhistoryinfo",(req,res) => {
//   const an = req.body.accountnumber;
//   Customer.find({accountno: an},(err,customer) => {
//     if(!err){
//       console.log(customer[0].transactions);
//       res.render("showtransactionhistory",{alltransactions: customer[0].transactions});
//     }
//   });
// });

// app.listen(3000,() => {
//   console.log("This server is working just fine.")
// });