var upPressed = false;
var downPressed = false;
var leftPressed = false
var rightPressed = false;
var lastPressed = false;
var bombSpeed = 1000;
var player = document.getElementById('player');
const startBtn = document.querySelector(".start")
const bombsDiv = document.querySelector(".bombs")
const explosionDiv = document.querySelector(".explo-div")
const arrowDiv = document.querySelector(".arrow-div")
const health = document.querySelector(".health")
const gameOver = document.querySelector(".game-over")
const score = document.querySelector(".score")
let arrowPressed = false
let lastArrowPressed = false

let bombs = []
let arrows = []
let start = false
let healthLeft = 3
let healthLoss = false
let scoreCount = 0




function keyup(event) {
	var player = document.getElementById('player');
	if (event.keyCode == 37) {
		leftPressed = false;
		lastPressed = 'left';
	}
	if (event.keyCode == 39) {
		rightPressed = false;
		lastPressed = 'right';
	}
	if (event.keyCode == 38) {
		upPressed = false;
		lastPressed = 'up';
	}
	if (event.keyCode == 40) {
		downPressed = false;
		lastPressed = 'down';
	}
	if(event.keyCode == 32){
		player.className = "character stand down"
	}

	player.className = 'character stand ' + lastPressed;
}


function move() {
	var positionLeft = player.offsetLeft;
	var positionTop = player.offsetTop;
	if (downPressed) {
		var newTop = positionTop+1;

		var element = document.elementFromPoint(player.offsetLeft, newTop+32);
		if (element.classList.contains('sky') == false) {
			player.style.top = newTop + 'px';	
		}

		if (leftPressed == false) {
			if (rightPressed == false) {
				player.className = 'character walk down';
			}
		}
	}
	if (upPressed) {
		var newTop = positionTop-1;

		var element = document.elementFromPoint(player.offsetLeft, newTop);
		if (element.classList.contains('sky') == false) {
			player.style.top = newTop + 'px';	
		}
		
		if (leftPressed == false) {
			if (rightPressed == false) {
				player.className = 'character walk up';
			}
		}
	}
	if (leftPressed) {
		var newLeft = positionLeft-1;

		var element = document.elementFromPoint(newLeft, player.offsetTop);
		if (element.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';	
		}


		player.className = 'character walk left';
	}
	if (rightPressed) {
		var newLeft = positionLeft+1;
		
		var element = document.elementFromPoint(newLeft+32, player.offsetTop);
		if (element.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';		
		}

		player.className = 'character walk right';
	}

}


function keydown(event) {
	if (event.keyCode == 37) {
		leftPressed = true;
	}
	if (event.keyCode == 39) {
		rightPressed = true;
	}
	if (event.keyCode == 38) {
		upPressed = true;
	}
	if (event.keyCode == 40) {
		downPressed = true;
	}
	if(event.keyCode == 32){
		arrowPressed = true
		if(lastArrowPressed){
			arrowPressed = false
		}
		if(arrowPressed){
			lastArrowPressed = true
			player.className = "character stand up fire"
			//following function is invoked then space is clicked
			shootArrow()
		}
	}
}
//cod starts from here
// click event of start button
startBtn.addEventListener('click', () => {
    startBtn.className = "start hide"
	gameOver.className = "game-over"
	healthLeft = 3
	scoreCount = 0
	for(let i = 0; i < healthLeft; i++){
        const life = document.createElement("li")
		health.appendChild(life)
    }
	start = true 
	// following function is executed and code is just below this function
	startGame()
    
})

const startGame = () => {
    if(start){
		//bomb is created using javascript
		//bomb animation happens due to css
        const bomb = document.createElement("div")
        bomb.classList.add("bomb")
        bombsDiv.appendChild(bomb)
        bomb.style.left = Math.floor(Math.random() * window.innerWidth) + "px"
        bombs.push(bomb)
        setTimeout(startGame,  500)
    }
    else{
        bombs = []
        document.querySelectorAll(".bomb").forEach(bomb => {
            bomb.remove()
        })
        return
    }
    
}

//this function is to check if there is collison between player and any of the bombs and is invoked every 10 sec for precision
const collision = () => {
    if(start){
        let playerX = player.offsetLeft
        let playerY = player.offsetTop
        bombs.forEach(bomb => {
            let bombX = bomb.offsetLeft
            let bombY = bomb.offsetTop
            let xDiff = bombX - playerX
            let yDiff = bombY - playerY
			// calculating the distance
            let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
            if(distance < 39.69){
				//here health loss will be true which is important in updateHealth() function
				healthLoss = true 
				bomb.remove()
            }
			// this is to check collison between arrow and bomb just like above
			arrows.forEach(arrow => {
				let arrowX = arrow.offsetLeft 
				let arrowY = arrow.offsetTop
				let a = bombX - arrowX 
				let b = bombY - arrowY
				let distanceArrow = Math.sqrt(a*a + b*b)
				if(distanceArrow < 29.69){
					bomb.remove()
					arrow.remove()
					arrows = []
					console.log()
					scoreCount++
				} 
			})
        })

    }else{
        return
    }
}

//this function is to shoot arrow
const shootArrow = () => {
	//animation of arrow happens due to css code
	const arrow = document.createElement("div")
	arrow.style.left = player.offsetLeft + "px"
	arrow.style.top = player.offsetTop + "px"
	arrow.classList.add("arrow")
	arrowDiv.appendChild(arrow)
	arrows.push(arrow)
	arrowPressed = false
	setTimeout(makeItTrue, 500)
}

// this function is to show that explosion image at bottom of screen and is invoked every 10 miliseconds
const checkExplosion = () => {
    if(start){
        bombs.forEach(bomb => {
            if(bomb.offsetTop === window.innerHeight - bomb.clientHeight){
				let explosionX = bomb.offsetLeft
				let explosionY = bomb.offsetTop
				const explosion = document.createElement("div")
				explosion.classList.add("explosion")
				explosionDiv.appendChild(explosion)
				bomb.remove()
				explosion.style.left = explosionX - 25 + "px"
				explosion.style.top = explosionY - 20 + "px"
				let explosionSound = new Audio("./explosion.wav")
				// explosionSound.play()
            }
        })
    }else{
        return
    }
}

//this function is to remove the explosion image every 1 second
const removeMarks = () => {
    const marks = document.querySelectorAll('.explosion')
    marks.forEach(mark => {
        mark.remove()
    })
}

//this function validates the health of player every .5 seconds
const updateHealth = () => {
	// if health loss is true following code runs
    if(healthLoss){  
        healthLeft--
        if(healthLeft === 0 || healthLeft < 0){
			// if health becomes zero gameover screen is shown
			gameOver.className = "game-over show"
            health.innerHTML = ''
            start = false
			bombs = []
			arrows = []
            startBtn.className = "start show"
        } else {
			//if health is not zero, health decreases by one and only two health icon is shown on screen
            health.innerHTML = ''
            for(let i = 0; i < healthLeft; i++){
				const life = document.createElement("li")
				health.appendChild(life)
			}
        }
        healthLoss = false
    }
    
}

//this function removes arrow if it not on the screen and is executed every 10 miliseconds
const removeArrow = () => {
	document.querySelectorAll(".arrow").forEach(arrow => {
		if(arrow.offsetTop < 0){
			arrow.remove()
			arrows = []
		}
	})
}

//this function checks the score of player every 10 miliseconds
const checkScore = () => {
	score.textContent = scoreCount
}


//this code runs to make the lastarrowpressed variable false every .5s so that player can only shoot after .5 sec
const makeItTrue = () => {
	lastArrowPressed = false
}

// has many setInterval function to run above functions
function myLoadFunction() {
	const checkCollision = setInterval(collision, 10)
	const explosionInterval = setInterval(checkExplosion, 10)
	const removeExplosionMarks = setInterval(removeMarks, 1000)
	const healthCheck = setInterval(updateHealth, 500)
	const arrowRemoval = setInterval(removeArrow, 10)
	const seeScore = setInterval(checkScore, 10)
	timeout = setInterval(move, 10);
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
}

// once everything is loaded on the DOM, myLoadFunction is invoked
document.addEventListener('DOMContentLoaded', myLoadFunction);
