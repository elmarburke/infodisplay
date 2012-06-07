 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/display'
  , rewrites : 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/systementwicklung", to:'../../'}
    , {from:"/systementwicklung/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  }
  ;

ddoc.views = {
  "allDocs": {
    map: function (doc) {
      var attachments = doc._attachments;
      if(doc.headline){ // make sure this is the correct entry
        for(var i in attachments) {
          if(attachments[i].content_type.match(/^image/))
          emit(doc.headline , doc);
        }
      }
    }
  },
  "images": {
    map: function (doc) {
      var attachments = doc._attachments;
      var length = 0;
      for(var i in attachments) {
        if(attachments[i].content_type.match(/^image/))
        length++;
      }
      var duration = doc.duration / length;
      for(var i in attachments) {
        var attachment = attachments[i];
        if(attachment.content_type.match(/^image/)) {
          emit(doc._id + "/" + i, {duration: duration, meta: attachment, published: doc.published});
        }
      }
    }
  },
  "tweets": {
    "map": function(doc) {
      if(doc.id && doc.from_user)
        emit(doc.id, {"from_user": doc.from_user, "text": doc.text, "from_user_name": doc.from_user_name, "profile_image_url": doc.profile_image_url});
    }
  }
  
};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  } 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;