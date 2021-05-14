
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

 let port = process.env.PORT;
 if(port == null || port ==""){
   port = 3000;
 }


app.listen(port, function() {
  console.log("Server started successfully");
});






