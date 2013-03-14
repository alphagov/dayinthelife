var width = 900;
var height = 600;

var svg = d3.select('#map');
var overlay = d3.select('#overlay');

var map = svg.append("g").attr("class", "map");
var projection = d3.geo.albers();
    projection.center([-3,54]);       // center long and lat of the world
    projection.translate([width/3, height/2]); // center pixel of the svg
    projection.rotate([0,0]);         // rotation of the graph
    projection.scale(2900);           // scale of the graph

var path = d3.geo.path().projection(projection);
d3.json('uk-outline.topo.json', function(json) {
  map.append('path')
  .datum(topojson.object(json, json.objects.subunits))
  .attr('d', path);
});
d3.json('real_users.json', function(json) {
  userMap.allUsers = json;
  userMap.init();
});

var userMap = {
  userCount: 0,
  allUsers: [],
  displayedUsers: [],

  showNextUser: function(){
    userMap.userCount = userMap.userCount + 1;
    if(userMap.userCount >= userMap.allUsers.length){ userMap.userCount = 0; }

    if(userMap.readyForPullout === true){
      userMap.addPulloutUser(userMap.allUsers[userMap.userCount]);
    }
    userMap.displayedUsers.push(userMap.allUsers[userMap.userCount]);

    if(userMap.displayedUsers.length > 150){
      userMap.displayedUsers.shift();
    }
    userMap.update()
  },
  update: function(){
    // Add data
    var circle = map.selectAll('circle')
      .data(userMap.displayedUsers, function(d){ return ''+ d[0] + d[1]; });

    // Add new elements
    circle.enter().insert('circle')
        .attr('cx', function(d){ return projection([ d[1], d[0] ])[0] })
        .attr('cy', function(d){ return projection([ d[1], d[0] ])[1] })
        .attr("r", 3)
        .attr('fill-opacity', '0.8');

    // Remove old elements
    circle.exit()
      .remove();
  },
  addPulloutUser: function(user){
    userMap.readyForPullout = false;
    var pullout = svg.append('g').attr('class', 'pullout');
    var userPixels = projection([ user[1], user[0] ]);

    var circle = pullout.append('circle')
        .attr('class', 'outer')
        .attr('cx', userPixels[0])
        .attr('cy', userPixels[1])
        .attr("r", 0)

    var innercircle = pullout.append('circle')
        .attr('cx', userPixels[0])
        .attr('cy', userPixels[1])
        .attr("r", 5)


    circle.transition()
      .duration(100)
      .ease('linear')
      .attr('r', 30)

    var time = new Date();
    time.setISO8601(user[3]);

    user[5] =  user[5].replace(' - GOV.UK', '');
    var bits = user[5].split(/\s+/);
    if(bits.length > 1){
      var last = bits.pop();
      bits.push(bits.pop() + "&nbsp;"+ last);
    }
    user[5] = bits.join(' ');

    var html = "<strong>" + user[5] + "</strong><span>"+time.getGovukDate();
    if(user[2] !== '') {
      html = html + ", "+user[2];
    }
    html = html + "</span>";

    var infoBox = overlay.append('p')
      .html(html);
    
    window.setTimeout(function(){
      pullout.remove();
      infoBox.remove();

      window.setTimeout(function(){
        userMap.readyForPullout = true;
      }, 1e3);

    }, 3e3);


  },
  init: function(){
    window.setInterval(userMap.showNextUser, 150);
    window.setTimeout(function(){
      userMap.readyForPullout = true;
    }, 2e3);
  }
};


svg.on("click", function() {
  p = projection.invert(d3.mouse(this));
  console.log(p);
});

Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
}
Date.prototype.getGovukDate = function () {
  var months = [ "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December" ];
  return this.getDate() + " " + months[this.getMonth()] + " " + this.getFullYear();
}
