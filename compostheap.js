Images = new Mongo.Collection('images');
UserAccounts = new Mongo.Collection('users');

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  
  Template.images.helpers({
  
  	"images": function() {
  		return Images.find();
  	}
  
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
