const mongoose = require("mongoose");
const initData = require ("./data.js")
const Listing = require("../models/listing.js");

main()
.then(()=>{
  console.log("connected")
})
.catch(err => console.log(err));

async function main() {
      await mongoose.connect('mongodb://127.0.0.1:27017/travelers');
}

const initDB = async ()=>{
    await Listing.deleteMany({})
   initData.data =  initData.data.map((obj)=> ({...obj , owner: "694fd9ae48d078f6f18f312f"}))
    await Listing.insertMany(initData.data)
    console.log("data was initialized")
}

initDB();

