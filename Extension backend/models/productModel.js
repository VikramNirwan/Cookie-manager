const mongoose = require("mongoose");

const cookieSchema = mongoose.Schema(
    {
        panelID:{
            type:String,
            required:[true,"Please provide panel id"]
        },
        url:{
            type:String,
            required:[true,"Please provide url"]
        },
        referrer:{
            type:String,
            required:[true,"Please provide referrer"]
        } 
    },
    {
        timestamps:true
    }
)

const cookie = mongoose.model("cookie",cookieSchema);

module.exports = cookie;