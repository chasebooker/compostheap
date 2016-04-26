UserAccounts = new Mongo.Collection('userDB');

// var moment = require('moment');
// moment().format();

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  
  Template.images.helpers({
    
  	imageFinder: function() {
  		return ImageCollection.find({}, {sort: {created: 1}});
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
  	  
  	  var currentDate = new Date();
  	  var creationDate = this.created;
  	  
  	  difference = Math.round((currentDate - creationDate) / one_day);
  	  console.log(difference);
  	  
  	  quality = 100 - difference;
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
  			
  			// ASAD: THIS IS WHAT YOU NEED IN THE DB
  			
  			image.position = {
  				top: parseInt(Math.random() * 1000),
  				left: parseInt(Math.random() * 1000)
  			};
  		  image.created = new Date();
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
