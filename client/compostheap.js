UserAccounts = new Mongo.Collection('userDB');

// var moment = require('moment');
// moment().format();

if (Meteor.isClient) {
  
  Template.images.helpers({
    
    imageFinder: function() {
      return ImageCollection.find({}, {sort: {created: -1}});
      console.log("ok");
    },
    
    // ASAD: YOU NEED THIS TOO
    
    draggable: function(id) {
      Meteor.defer(function() {
        console.log('draggable', id);
        var img = $('img[data-id=' + id + ']');
        img.draggable({
          stop: function(e, ui) {
            console.log('Dropped', id, img, img.position());
            ImageCollection.update({_id: id}, {$set: {position: img.position()}})
          }
        });
      });
    }, 
    
    compression: function() {
      
      var one_day = 1000*60*60*24; // day in ms
      
      var currentDate = moment().format();
      var creationDate = this.created;
      
      difference = (moment(currentDate).diff(creationDate))/one_day;
      
      quality = Math.round(100 - difference);

      if (quality > 1) {
        return quality;
      } else {
        return 1;
      }
    }
    
  });
  
  Template.uploader.events({
    "change input.uploader": function(e) {
      var files = e.currentTarget.files;
  
      Cloudinary.upload(files, {}, function(err, image) {
        console.log("Upload Error:");
        console.log(err);
        console.log("Upload Result:");
        console.log(image);
        image.user = Meteor.user();
        image.zindexcount = 1;
        console.log(image.zindexcount);
        
        // ASAD: THIS IS WHAT YOU NEED IN THE DB
        
        image.position = {
          top: parseInt(Math.random() * 500),
          left: parseInt(Math.random() * 500)
        };

        image.created = moment().format();
        console.log(image.created);
        
        ImageCollection.insert(image);
      });
    }
  });
  
  Template.uploader.helpers({
    
    username: function() {
      return Meteor.user().emails[0].address;
    }
    
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
