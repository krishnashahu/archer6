const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var palyer, playerBase;
var computer, computerBase;

//Declare an array for arrows playerArrows = [ ]
var playerArrows = [];
var computerArrows = []
var arrow;
var playerArcherLife = 3;
var computerArcherLife = 3;
function preload(){
  backgroundImg = loadImage("assets/background.gif")
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  playerBase = new PlayerBase(300, random(450, height - 300), 180, 150);
  player = new Player(285, playerBase.body.position.y - 153, 50, 180);
  playerArcher = new PlayerArcher(
    340,
    playerBase.body.position.y - 180,
    120,
    120
  );

  computerBase = new ComputerBase(
    width - 300,
    random(450, height - 300),
    180,
    150
  );
  computer = new Computer(
    width - 280,
    computerBase.body.position.y - 153,
    50,
    180
  );
  computerArcher = new ComputerArcher(
    width - 340,
    computerBase.body.position.y - 180,
    120,
    120
  );
  //Function to manage computer Arrows
  handleComputerArcher(); 


}

function draw() {
  background(189);

  
  background(backgroundImg);
  
  Engine.update(engine);

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

 
  playerBase.display();
  player.life();

  player.display();
  

  computerBase.display();
  computer.display();
  computer.life();

  playerArcher.display();
  computerArcher.display()

 // Use for loop to display arrow using showArrow() function
 for (var i = 0; i < playerArrows.length; i++) {
  showArrows(i, playerArrows);
}

for (var i = 0; i < computerArrows.length; i++) {
  showArrows(i, computerArrows);
}

computerBase.display();
Computer.display();
Computer.life();
ComputerArcher.display();
handleComputerArrowCollision();

}

function keyPressed() {

  if(keyCode === 32){
   
    var posX = playerArcher.body.position.x;
    var posY = playerArcher.body.position.y;
    var angle = playerArcher.body.angle+PI/2;

    var arrow = new PlayerArrow(posX, posY, 100, 10);

    arrow.trajectory = [];
    Matter.Body.setAngle(arrow.body, angle);
    playerArrows.push(arrow);

  }
}

function keyReleased () {

  if(keyCode === 32){
    
    if (playerArrows.length) {
      var angle = playerArcher.body.angle+PI/2;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }

}
//Display arrow and Tranjectory
function showArrows(index, arrows) {
  arrows[index].display();
  
    
  
 

}

function handleComputerArcher() {
  if (!computerArcher.collapse && !playerArcher.collapse) {
    setTimeout(() => {
      var pos = computerArcher.body.position;
      var angle = computerArcher.body.angle;
      var moves = ["UP", "DOWN"];
      var move = random(moves);
      var angleValue;

      if (move === "UP") {
        angleValue = 0.1;
      } else {
        angleValue = -0.1;
      }
      angle += angleValue;

      var arrow = new ComputerArrow(pos.x, pos.y, 100, 10, angle);

      Matter.Body.setAngle(computerArcher.body, angle);
      Matter.Body.setAngle(computerArcher.body, angle);

      computerArrows.push(arrow);
      setTimeout(() => {
        computerArrows[computerArrows.length - 1].shoot(angle);
      }, 100);

      handleComputerArcher();
    }, 2000);
  }
}

function handlePlayerArrowCollision() {
  for (var i = 0; i < computerArrows.length; i++) {
    var baseCollision = Matter.SAT.collides(
      computerArrows[i].body,
      playerBase.body
    );

    var playerCollision = Matter.SAT.collides(
      computerArrows[i].body,
      player.body
    );

    var playerArcherCollision = Matter.SAT.collides(
      computerArrows[i].body,
      playerArcher.body
    );

    if (
      baseCollision.collided ||
      playerCollision.collided||
      playerArcherCollision.collided
    ) {
      playerArcherLife -= 1;
      player.reduceLife(playerArcherLife);
      if (playerArcherLife <= 0) {
        playerArcher.collapse = true;
        Matter.Body.setStatic(playerArcher.body, false);
        Matter.Body.setStatic(player.body, false);
        Matter.Body.setPosition(player.body, {
          x: 100,
          y: player.body.position.y
        });
      }
    }
  }
}





