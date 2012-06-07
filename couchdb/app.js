 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/app'
  , rewrites : 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/systementwicklung", to:'../systementwicklung/'}
    , {from:"/systementwicklung/*", to:'../systementwicklung/*'}
    , {from:"/*", to:'*'}
    ]
  }
  ;

ddoc.views = {
  "allDocs": {
      "map": "function (doc) {\n      var attachments = doc._attachments;\n\n      if(doc.headline){\n        for(var i in attachments) {\n          if(attachments[i].content_type.match(/^image/))\n          emit(doc.headline , doc);\n        }\n      }\n    }"
  },
  "tweets": {
    "map": function(doc) {
      if(doc.id && doc.from_user)
        emit(doc.id, {_id: doc._id, _rev: doc._rev});
    }
  }
};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;