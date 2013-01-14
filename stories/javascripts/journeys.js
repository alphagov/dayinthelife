$(document).ready(function(){

  var visit;
  $.getJSON('data/data.json', function(data){
    requests = data;
    var stories = [];

    $.each(requests, function(i, request) {
      if (request[1] !== undefined) {
        story = findStoryFromPath(request[1]);
        if (story !== null) {
          stories.push(story);
        }
      }
    });

    $.each(shuffleStories(stories), function(i, story) {
      setTimeout( function() {
        var item = $('<li>' + story +'</li>');
        item.appendTo('ol.trail');

        item.css('opacity', '0');
        item.css('top', distinctPercentage()*(window.innerHeight - 150) + 'px');
        item.css('left', 700 + 'px');
        animateRow(item, i);

      }, i*2500 + 1000);
    });
  });

  function animateRow(item, order) {
    $(item).find('.answer').lettering().animateLetters({opacity:0},{opacity:1},{randomOrder:false,time:1800,reset:true});

    $(item).animate({
      left: '-=600',
      opacity: 1
    }, 3800, 'linear', function() {
      $(item).animate({
        left: '-=150',
        opacity: 0
      }, 1000, 'linear', function() {
        $(item).html('').remove();
      });
    });
  };

  function findStoryFromPath(path) {
    if (m = path.match(/plan\-maternity\-leave\/y\/([0-9]+)\-([0-9]+)\-([0-9]+)/)) {
      date = new Date(m[1], (m[2]-1), m[3]);
      return "My baby is due on <span class='answer'>" + date.toDateString() +"</span>, when can I start my maternity leave?";
    }
    if (m = path.match(/report\-a\-lost\-or\-stolen\-passport\/y\/stolen\/adult\/in_the_uk/)) {
      return "My passport's been stolen <span class='answer'>in the UK</span>. What should I do?";
    }
    if (m = path.match(/report\-a\-lost\-or\-stolen\-passport\/y\/stolen\/adult\/abroad\/([A-Za-z0-9-_]+)/)) {
      return "My passport's been stolen in <span class='answer'>" + formatCountry(m[1]) +"</span>. What should I do?";
    }
    if (m = path.match(/report\-a\-lost\-or\-stolen\-passport\/y\/lost\/adult\/in_the_uk/)) {
      return "I've lost my passport <span class='answer'>in the UK</span>. What should I do?";
    }
    if (m = path.match(/report\-a\-lost\-or\-stolen\-passport\/y\/lost\/adult\/abroad\/([A-Za-z0-9-_]+)/)) {
      return "I've lost my passport in <span class='answer'>" + formatCountry(m[1]) +"</span>. What should I do?";
    }
    if (m = path.match(/student\-finance\-calculator\/y\/([0-9-]+)\/full\-time/)) {
      return "I want to go to university in <span class='answer'>" + m[1] +"</span>, what finance can I get?";
    }
    if (m = path.match(/calculate\-your\-holiday\-entitlement\/y\/days\-worked\-per\-week\/full\-year\/([0-9-]+)/)) {
      return "I work <span class='answer'>" + m[1] +" days a week</span>, how much annual leave should I have?";
    }
    if (m = path.match(/calculate\-your\-holiday\-entitlement\/y\/hours\-worked\-per\-week\/full\-year\/([0-9-]+)/)) {
      return "I work <span class='answer'>" + m[1] +" hours a week</span>, how much annual leave should I have?";
    }
    if (m = path.match(/register\-a\-death\/y\/england_wales\/at_home_hospital/)) {
      return "How do I register a death for someone who's died <span class='answer'>in England or Wales</span>?";
    }
    if (m = path.match(/register\-a\-death\/y\/scotland_northern_ireland_abroad/)) {
      return "How do I register a death for someone who's diead <span class='answer'>abroad?</span>";
    }

    return null;
  }

  function formatCountry(path) {
    country_name = path.replace(/\-/,' ');
    return country_name.charAt(0).toUpperCase() + country_name.slice(1);
  }

  function shuffleStories(stories) {
    shuffled_stories = []
    for ( var i = 0; i < stories.length-1; i++ ) {
      shuffled_stories.push(stories.splice(Math.floor(Math.random()*stories.length),1)[0]);
    }
    return shuffled_stories;
  }

  var _previousPercentage;
  function distinctPercentage() {
    var outcome;
    if (_previousPercentage == null) {
      outcome = Math.floor(Math.random(0,1) * 10)/10;
    } else {
      outcome = Math.floor(Math.random(0,1) * 10)/10;
      while ((outcome == _previousPercentage) || (_previousPercentage > outcome && _previousPercentage-0.2 <= outcome) || (_previousPercentage < outcome && _previousPercentage+0.2 >= outcome)) {
        outcome = Math.floor(Math.random(0,1) * 10)/10;
      }
    }
    _previousPercentage = outcome;
    return outcome;
  }


});
