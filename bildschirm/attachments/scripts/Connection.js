function Connection(line, dest, time){
  that = this;
  this.line = line;
  this.dest = dest;
  this.time = time;
  
  this.toString = function(){
    this.el = "<tr><td>" + that.line + "</td><td>" + that.dest + "</td><td>" + this.getTime() +"</td></tr>";
    return this.el;
  }
  
  this.getTime = function() {
    var n = [moment().hours(), moment().minutes()];
    var t = this.time.split(":");
    
    n[0] *= 60;
    t[0] *= 60;
    
    n = n[0] + parseInt(n[1]);
    t = t[0] + parseInt(t[1]);
    
    if(n < t) { // Normalfall (abfahrt heute)
      t -= n;
    } else if(n == t) { // Abfahrt jetzt
      t = "jetzt"
    } else if(n > t) { // Abweichung, wenn abfahrt nach 0 Uhr
      t = t-n+(24*60);
    } 
    
    if(t > 16) { // Dann Uhrzeit anzeigen
      t = that.time;
    } else if (typeof t == "number"){
      t += " min"
    }
    
    return t;
  }
  
  this.putTimeToConsole = function (that) {
    console.log(that.time, that.dest);
    setTimeout(function(){that.putTimeToConsole(that)}, 1000);
  }
  
  //this.putTimeToConsole(this);
  
  setInterval("console.log(this)", 1000, this);
}