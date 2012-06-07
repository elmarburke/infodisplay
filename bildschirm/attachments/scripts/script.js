(function($) {
  var $db = $.couch.db("api");

  var twitter = new Twitter($db);
  var main = new Display($db);
})(jQuery);