function Display($db) {
  var images = [];
  var active = false;
  
  var $changes = $db.changes();
  $changes.onChange(function (data) {
     
     var change = false;
     for(var i in data.results) {
       var change = data.results[i]
       if(change.deleted) {
         $('[data-id="'+change.id+'"]:hidden').remove();
         $('[data-id="'+change.id+'"]:visible').attr('data-active', false);
       } else {
         change = true;
       }
     }
     if(change) {
       loadImages();
     }
  });
  
  function loadImages() {
    $db.view("display/images", {
      success: function(data) {
        var $main = $("#main");
        //$main.not("img").html("");
        var images = data.rows;
        
        for(var i in images) {
          var image = images[i];
          createImage(image.key, image.value.published[0], image.value.published[1], image.value.published[2], image.id, image.value.duration);
        }
        
        if(!active) {
          change();
        }
      }
    });
  }
  
  function createImage(url, active, start, end, id, duration) {
    if($('[src="/api/'+url+'"]').length >= 1) {
      // update entry
      
      var img = $('[src="../../'+url+'"]');
      img.each(function(i) {
        $(this).attr("data-active", active);
        $(this).attr("data-start", start);
        $(this).attr("data-end", end);
        $(this).attr("data-id", id);
        $(this).attr("data-duration", duration*1000);
      })
    } else {
      // create entry
      
      var img = $("<img>");
      img.attr("src", "/api/" + url);
      img.attr("data-active", active);
      img.attr("data-start", start);
      img.attr("data-end", end);
      img.attr("data-id", id);
      img.attr("data-duration", duration*1000);
      
      $("#main").append(img);
    }
    
    
  }
  
  function change($old) {
    active = true;
    
    var $next = nextActive($old);
    if(!$old) {
      $old = $next.fadeIn("slow");
    }
    
    if($old && $next && $old.attr("src") == $next.attr("src")) {
      setTimeout(function() {
        return change($next);
      }, $next.attr("data-duration"));
    } else {
      $old.fadeOut("slow", function() {
        $next.fadeIn("slow", function() {
          setTimeout(function() {
            return change($next);
          }, $next.attr("data-duration"));
        })
      });
      /*$next.fadeIn("slow").delay($next.attr("data-duration")).fadeOut(function(){
        change($next);
      });*/
    }
    
  }
  
  function checkDate(active, startStr, endStr) {
    var start = moment(startStr);
    var end = moment(endStr);
    
    if(active == "false") {
      return false;
    }
    
    //console.log(end.diff(start), end.diff(start) >= 0, moment().diff(start), moment().diff(start) >= 0, end.diff(moment()), end.diff(moment()) >= 0);
    
    if(  end.diff(start) >= 0 // start is before end
      && moment().diff(start) >= 0
      && end.diff(moment()) >= 0
      ) {
      return true;
    } else {
      return false;
    }
    
  }
  
  function nextActive($current) {
    if(!$current) {
      var $next = $($("#main img:hidden")[0]);
    } else {
      var $next = $current.next();
    }
    
    if($next.length == 0) {
      $next = $($("#main img")[0]);
    }
    
    var active = $next.attr("data-active");
    var start = $next.attr("data-start");
    var end = $next.attr("data-end");
    
    
    if (checkDate(active, start, end)) {
      return $next;
    } else {
      $newNext = nextActive($next);
      return $newNext;
    }
    
  }
  
  
  loadImages();
}