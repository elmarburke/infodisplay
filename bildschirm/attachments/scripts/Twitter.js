function Twitter($db) {
  //var query = "Kleve OR Kamp-Lintfort OR #hsrw -from:kleverwetter -from:wxKleve -from:Kleve_Anzeigen -from:tierep -from:Fengshui_Bad -from:Kleve_ -from:tiepferd";
  var query = ''; // '@HochschuleRW OR "Hochschule Rhein-Waal" OR #hsrw OR hsrw -from:autodrool -from:blessyouNiall';
  $db.openDoc("twitterSearchString", {
    success: function(twitterString) {
      query = twitterString.searchstring;
    }, 
    async: false
  });
  var $changes = $db.changes();
  $changes.onChange(function (data) {
     for(var i in data.results) {
       console.log("data.results", data.results[i]);
       $db.openDoc(data.results[i].id, {
         success: function(doc) {
           console.log(doc);
           if(doc.id && doc.from_user) {
             $.get('templates/tweet.ms').success(function(template) {
               $(Mustache.render(template, doc)).hide().prependTo('#twitter').slideDown();
             })
           } else if(doc._id == "twitterSearchString") {
               $db.openDoc("twitterSearchString", {
                   success: function(twitterString) {
                     query = twitterString.searchstring;
                     console.log("Change query", query);
                   }
               });
           }
         }
       })
     }
     console.log(data);
  });
  
  function loadData() {
    console.log("rerender");
    $.when($.getJSON('./_view/tweets'), $.get('templates/tweet.ms'))
      .then(function(resTweets, resTemplate) {
        var tweets = resTweets[0].rows;
        var template = resTemplate[0];
        var output = "";
        for(var i in tweets) {
          var tweet = tweets[i];
          var data = {
            id: tweet.id,
            profile_image_url: tweet.value.profile_image_url,
            from_user: tweet.value.from_user,
            from_user_name: tweet.value.from_user_name,
            text: tweet.value.text
          };
          
          var content = Mustache.render(template, data);
          output = content + output;
        }
        $("#twitter").hide().html(output).fadeIn();
      })
  }
  
  function writeData() {
    $.when($.getJSON('http://search.twitter.com/search.json?callback=?', 
    {q: query}), 
    $.getJSON('./_view/tweets'))
    // if all response are ready
    .then(function(response1, response2) {
      
      var tweetid = [];
      for(var i in response2[0].rows) {
        tweetid.push(response2[0].rows[i].key);
      }
      
      var tweets = response1[0].results;
      for(var i in tweets) {
        var tweet = tweets[i];
        if(tweetid.indexOf(tweet.id) != -1) {
          // Tweet is in CouchDB  
        } else {
          console.log("saveTweet");
          $db.saveDoc(tweet);
        }
      }
      
    });
    
  }
  
  setInterval(function(){return writeData()}, 5000);
  loadData();
}