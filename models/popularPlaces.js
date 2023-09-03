const mongoose = require('mongoose');

const popularPlacesSchema = new mongoose.Schema({
   name: {
    type: String,
    
    
  },
  subTitle: {
    type: String,
    
    },
    image: {
        type: String,
        
    }
});

module.exports = mongoose.model('PopularPlaces', popularPlacesSchema);