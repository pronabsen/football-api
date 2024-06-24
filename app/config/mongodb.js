const mongoose = require('mongoose');
const catchAsync = require("../utils/catchAsync");
const logger = require("./logger");

const mongoAtlasUri = "mongodb+srv://opisengupta:0U7ujOeh2FO7fWYo@cricktimecluster.mjkinq5.mongodb.net/CrickTime?retryWrites=true&w=majority";
const config = {
    connectTimeoutMS: 5000000,
    socketTimeoutMS: 50000,
    useUnifiedTopology: true,
    useNewUrlParser: true
}
mongoose.set('strictQuery', true);
catchAsync(
    mongoose.connect( mongoAtlasUri, config, function(err) {
        if (err){
            console.error(err);
         //   logger.info(err)
        } else {
            console.log("----------->Mongoose is connected<------------")
          //  logger.info("----------->Mongoose is connected<------------")
        }

    })
)

mongoose.connection.on("error", (e) => {
    console.log("----------->Mongoose Connect Error<------------")
   // logger.info("----------->Mongoose Connect Error------------")
});

mongoose.connection.on("connected", () => {
    console.log("----------->Mongoose Connected<------------")
   // logger.info("----------->Mongoose Connected------------")
});
