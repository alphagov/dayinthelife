function Plane(el, tail){
  this.width = 16;
  this.height = 16;

  this.maxX = window.innerWidth - this.width;
  this.maxY = window.innerHeight - this.height;

  if(Math.random() > 0.5){
    this.xDirection = Math.random() > 0.5;
    this.x = this.xDirection ? 0 : this.maxX;
    this.y = Math.random() * this.maxY;

    this.velocityX = this.xDirection ? this.randomVelocity() : this.randomVelocity() * -1;
    this.velocityY = this.randomVelocity();

    this.rotation = Math.atan(this.velocityY / this.velocityX) + (Math.PI / 2);
    if(!this.xDirection){
      this.rotation = this.rotation + Math.PI;
    }
  } else {
    this.yDirection = Math.random() > 0.5;
    this.x = Math.random() * this.maxX;
    this.y = this.yDirection ? 0 : this.maxY;

    this.velocityX = this.randomVelocity();
    this.velocityY = this.yDirection ? this.randomVelocity() : this.randomVelocity() * -1;

    this.rotation = Math.atan(this.velocityY / this.velocityX) + (Math.PI / 2);
  }

  this.el = el;
  this.tail = tail;

  this.update();
}
Plane.prototype = {
  randomVelocity: function(){
    return Math.random() % 0.5 + 0.5;
  },
  update: function(e){
    this.x = this.x + this.velocityX;
    this.y = this.y + this.velocityY;

    if(this.x < -50 || this.y < -50 || this.x > this.maxX+50 || this.y > this.maxY+50){
      this.remove();
    } else {
      window.requestAnimFrame(this.update.bind(this));
      this.el.setAttribute('style', 'top:'+ Math.round(this.y) +'px;left:'+ Math.round(this.x) +'px; opacity: 1; -webkit-transform: rotate('+ this.rotation +'rad);');
    }
  },
  remove: function(){
    this.el.setAttribute('style', 'top:'+ Math.round(this.y) +'px;left:'+ Math.round(this.x) +'px; opacity: 0; -webkit-transform: rotate('+ this.rotation +'rad);');
  }
};

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

var s = new Plane(document.getElementById('plane'));
window.setInterval(function(){
  s = new Plane(document.getElementById('plane'));
}, 180e3);

