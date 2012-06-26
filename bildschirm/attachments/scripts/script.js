(function($) {
  var dbname = 'api';
  var $db = $.couch.db(dbname);

  var twitter = new Twitter($db);
  var main = new Display($db);
})(jQuery);