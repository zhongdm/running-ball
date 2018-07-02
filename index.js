
var canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')
var width = canvas.width = 600
var height = canvas.height = 500

var count = 0

function Shape(x, y, velX, velY, exists){
  this.x = x;
  this.y = y;
  this.velX = velX
  this.velY = velY
  this.exists = exists
}

function Ball(x, y, r, color, velX, velY, exists = true){
  Shape.call(this, x, y, velX, velY, exists)
  this.r = r;
  this.color = color;
}
Ball.prototype.draw = function(){
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
  ctx.fillStyle = this.color
  ctx.fill()
  ctx.closePath()
}

Ball.prototype.update = function() {
  if((this.x + this.r) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.r) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.r) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.r) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

Ball.prototype.collisionDetect = function(){
  // 两个以上的小球发生碰撞的化学反应处理
  for(let i = 0,len = balls.length; i < len; i++) {
    if(!(this === balls[i])) {
      var distX = balls[i].x - this.x,
          distY = balls[i].y - this.y,
          distance = Math.sqrt(distX * distX + distY * distY)
      if(distance < this.r + balls[i].r) {
        this.color = balls[i].color = "rgb("+random(0, 255)+", "+random(0, 255)+", "+random(0, 255)+")"
      }
    }
  }
  
}


function EvilCircle(x, y, r, color, velX, velY, exists = true) {
  // Math.abs(velX)--添加Math.abs,是为了处理velx有可能是负数的情况
  Shape.call(this, x, y, Math.abs(velX), Math.abs(velY), exists)
  this.r = r
  this.color = color
}

EvilCircle.prototype = Object.create(Shape.prototype);
// EvilCircle的原型从Shape变更为EvilCircle
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
  ctx.lineWidth = 3
  ctx.strokeStyle = this.color
  ctx.stroke()
  ctx.closePath()
}
EvilCircle.prototype.update = function() {
  if((this.x + this.r) >= width) {
    this.x = width - this.r
  }
  if((this.x - this.r) < 0) {
    this.x  = this.r
  }

  if((this.y + this.r) >= height) {
    this.y = height - this.r
  }

  if((this.y - this.r) < 0) {
    this.y = this.r
  }

};
EvilCircle.prototype.setControls= function(){
  var _this = this
  document.body.addEventListener('keydown', function(event){
    // A
  if(event.keyCode == 65) {
      _this.x -= Math.abs(_this.velX)
  }
  // D
  if(event.keyCode == 68) {
      _this.x += Math.abs(_this.velX)
  }
  // s
  if(event.keyCode == 83) {
      _this.y += Math.abs(_this.velY)
  }
  // w
  if(event.keyCode == 87) {
      _this.y -= Math.abs(_this.velY)
  }
})
}

EvilCircle.prototype.collisionDetect = function(){
  // 两个以上的小球发生碰撞的化学反应处理
  for(let i = 0,len = balls.length; i < len; i++) {
      if(balls[i].exists) {
        var distX = balls[i].x - evilCircle.x,
            distY = balls[i].y - evilCircle.y,
            distance = Math.sqrt(distX * distX + distY * distY)
        if(distance < evilCircle.r + balls[i].r) {
          balls[i].exists = false
          count--;
      }
    }
  }
  
}

function random(min, max){
  return Math.floor(Math.random() * (max - min)) + min 
}

var balls = []
var evilCircle = {}
function init(){
  for(var i = 0; i < 20; i++) {
    var radius = random(10,20)
    var ball = new Ball(random(0, width),
      random(0, height), 
      radius, 
      "rgb("+random(0, 255)+", "+random(0, 255)+", "+random(0, 255)+")",
      random(0, 4),
      random(0, 4)
    );
    balls.push(ball)
    count++
  }
  initEvilCircle();
  loop();
}

function loop(){
  // 重新填充--背景色设置
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  evilCircle.draw()

  for(let i = 0, len = balls.length; i < len; i++) {
    if((balls[i]).exists) {
    balls[i].draw()
    balls[i].update()
    balls[i].collisionDetect()
  }
  }

  evilCircle.update()
  evilCircle.collisionDetect()
  document.getElementById('num').innerHTML = count
  requestAnimationFrame(loop)
}

function initEvilCircle(){
  evilCircle = new EvilCircle(random(0, width),
      random(0, height),
      10,
      "rgb(255,255,255)",
       random(-4, 4),
      random(-4, 4)
    );
  evilCircle.setControls()
}

init();


