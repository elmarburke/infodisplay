(function($) {
  var app = $.sammy('#content',
  function() {
    this.use("Mustache", "ms");
    
    $db = $.couch.db('api');
    
    window.docs = {};
    
    this.before({except: {path: '#/user/login'}}, function(context) {
      if(typeof sessionStorage.username !== "string"
      || typeof sessionStorage.roles !== "string"
      || sessionStorage.username == ""
      || sessionStorage.roles == "") {
        context.redirect("#/user/login");
        return;
      }
      
    });
    
    this.get('#/user/login', function(context) {
      if(typeof sessionStorage.username === "string"
      && typeof sessionStorage.roles === "string"
      && sessionStorage.username != ""
      && sessionStorage.roles != "") {
        context.redirect('#/');
      } else {
        $.couch.session({
          success: function(data) {
            if(data.userCtx.name === null) {
              context.partial('templates/login.ms');
            } else if (typeof data.userCtx.name === "string" && data.userCtx.name.length > 0) {
              console.log("no redirect, user logged in", data.userCtx.name, data.userCtx.roles)
              sessionStorage.username = data.userCtx.name;
              sessionStorage.roles = data.userCtx.roles;
              context.redirect('#/');
            }
          }
        });
        
        
      }
      
    });
    
    this.post('#/user/login', function(context) {
      
      $("#login-name, #login-password").removeClass("error");
      
      if(this.params['name'] == "") {
        if(!$("#login-name").hasClass("error"))
          $("#login-name").addClass("error").append('<span class="help-inline">Bitte Name eingeben</span>');
      }
      if(this.params['password'] == "") {
        if(!$("#login-password").hasClass("error"))
          $("#login-password").addClass("error").append('<span class="help-inline">Bitte ein Passwort</span>');
      }
      
      new User(context, this.params['name'], this.params['password']);
      
    });
    
    this.get('#/user/logout', function(context) {
      $.couch.logout({
        success: function(data) {
          delete sessionStorage.username;
          delete sessionStorage.roles;
          context.redirect("#/user/login");
        }
      });
    });
    
    this.get('#/', function(context) {
      if(typeof sessionStorage.username !== "string"
      || typeof sessionStorage.roles !== "string"
      || sessionStorage.username == ""
      || sessionStorage.roles == "") {
        context.redirect("#/user/login");
        return false;
      }
      $db.view("app/allDocs", {
        success: function(data) {
          console.log("renderd #/")
          for(var i in data.rows) {
            var row = data.rows[i];
            docs[row.id] = row.value;
            row.active = row.value.published[0] ? "checked" : "";
          }
          context.partial('templates/index.ms', data);
        }
        
      });
    });
    
    this.get('#/delete/:id/:rev', function(context) {
      if(!confirm("Wollen Sie diesen Eintrag wirklich entfernen?")) {
        this.redirect("#/");
        return;
      }
      $db.removeDoc({_id: this.params['id'], _rev: this.params['rev']}, {
        success: function(data) {
          context.redirect("#/");
        }
      });
    });
    
    this.post(/#\/change\/(.*)/, function(context) {
      var _id = this.params['splat'];
      var doc = docs[_id];
      
      doc.duration = this.params.duration;
      doc.published[0] = this.params['active'] == "true" ? true : false;
      doc.published[1] = this.params['published.1'];
      doc.published[2] = this.params['published.2'];
      $db.saveDoc(doc, {
        success: function() {
          context.redirect("#/");
        }
      });
      
    });
    
    this.post(/#\/new(.*)/, function(context) {
      console.log(this.params);

      if(!$('input[type="file"]').val() || this.params.headline == "" || this.params.duration == "" || this.params["published.1"] == "" || this.params["published.2"] == "") {
        alert("Keine Datei ausgewählt oder Formular unvollständig");
        return;
      }
      
      $db.saveDoc({
        headline: this.params.headline,
        duration: this.params.duration,
        published: [
          this.params['active'] == "true" ? true : false,
          this.params["published.1"],
          this.params["published.2"]
        ]
      }, {
        success: function(data) {
          console.log(data);
          var form = $('form[action="#/new"]');
          form.ajaxSubmit({
            url: "../../" + data["id"],
            data: {
              "_rev": data["rev"],
              "_id": data["id"]
            },
            success: function(data) {
              context.redirect("#/");
            }
          })
        }
      })
      
    });
    
    this.get("#/tweets/delete", function(context) {
      if(confirm("Wirklich alle tweets aus der Datenbank entfernen?")) {
        
        $.getJSON('./_view/tweets').success(function(data) {
          for(var i in data.rows) {
            var doc = data.rows[i].value;
            $db.removeDoc(doc)
          }
          
        })
        
      }
      this.redirect("#/");
      
    })
    
    
  });
  

  
  $(function() {
      app.run('#/');
  })
})(jQuery)