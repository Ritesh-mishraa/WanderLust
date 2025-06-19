const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then(() =>{
        console.log("connceted to Db");
    })
    .catch((err) => console.log(err));
    

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () =>{
    await Listing.deleteMany({});
    data.data = data.data.map((obj) => ({...obj, owner: "681271587517af2c97bd1031"}))
    await Listing.insertMany(data.data);
    console.log(data);
    console.log("data was initialized");
};

initDB();