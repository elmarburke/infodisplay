function dfi(stop) {
  this.stop = stop;
  var date = moment();
  this.connections = [];
  
  this.render = function() {
    $(this.connections).each(function(i,el) {
      $("table").append(new Connection(el.line, el.dest, el.time).toString());
    })
  };
  
  this.loadData = function() {
    that = this;
    var d = date.format("DD.MM.YYYY");
    var t = date.format("HH:mm");
    
    var url = "http://mobile.bahn.de/bin/mobil/bhftafel.exe/dox?ld=96236&rt=1&use_realtime_filter=1&";
    
    var params = {
      input: this.stop,
      date: d,
      time: t,
      productsFilter: "1111111111000000",
      REQTrain_name: '',
      maxJourneys: 20,
      start: "Suchen",
      boardType: "Abfahrt",
      ao: "yes"
    };
    
    $.ajax({
      url: url,
      data: params,
      crossDomain: true,
      success: function(data) {
        var busses = /<a href=".*">[\s*|\S*|\.*]<span class="bold">(.*)<\/span>[\s*|\S*|\.*]{0,10}&gt;&gt;\s(.*)[\s*|\S*|\.*]{0,10}<span class="bold">(\d{2}:\d{2})<\/span>/mg;
        var res = [];
        while(i = busses.exec(data)) { // Für jedes Ergebnis wird die Schleife durchlaufen
          // Abfahrszeit i[3]
          // Linie i[1]
          // Fahrtrichtung i[2]
          res.push({
            time: i[3],
            line: i[1],
            dest: i[2]
          });
        }
        that.connections = res;
        that.render();
      }
    })
  }
  
  this.loadData();
}