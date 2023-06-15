document.addEventListener('DOMContentLoaded', () => {
      const grid = document.querySelector('.grid');
      const container = document.getElementById("grid");
      const scoreDisplay = document.querySelector('#score');
      const startBtn = document.querySelector('#start-button');
      const width = 10;
      let nextRandom = 0
      let timerID
      let score = 0
      const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
      ]
      for (var i = 0; i < 200; i++) {
        var div = document.createElement("div");
        container.appendChild(div);
      }
      for (var i = 0; i < 10; i++) {
        var div = document.createElement("div");
        div.classList.add("end");
        container.appendChild(div);
      }

      let boxes = Array.from(document.querySelectorAll('.grid div'));
      const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
      ]

      const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
      ]

      const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
      ]

      const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
      ]

      const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
      ]

      const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

      let currentPosition = 4
      let currentRotation = 0;

      let random = Math.floor(Math.random() * theTetrominoes.length)
      let current = theTetrominoes[random][currentRotation]

      function draw() {
        current.forEach(index => {
          boxes[currentPosition + index].classList.add('tetromino')
          boxes[currentPosition + index].style.backgroundColor = colors[random]
        })
      }

      //undraw the Tetromino
      function undraw() {
        current.forEach(index => {
          boxes[currentPosition + index].classList.remove('tetromino')
          boxes[currentPosition + index].style.backgroundColor = ''

        })
      }

      function control(e){
        if (e.keyCode === 37) {
          moveLeft()
        }else if (e.keyCode === 38){
          rotate()
        }
        else if (e.keyCode === 39){
          moveRight()
        }else if (e.keyCode === 40){
          moveDown()
        }
      }
      document.addEventListener('keyup',control);

      function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
      }


      function freeze() {
        if (current.some(index => boxes[currentPosition + index + width].classList.contains('end'))) {
          current.forEach(index => boxes[currentPosition + index].classList.add('end'));
          random = nextRandom
          nextRandom = Math.floor(Math.random() * theTetrominoes.length)
          current = theTetrominoes[random][currentRotation]
          currentPosition = 4
          draw();
          addScore();
          gameOver();
        }
      }

      function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) currentPosition -= 1

        if (current.some(index => boxes[currentPosition + index].classList.contains('end'))) {
          currentPosition += 1
        }
        draw()
      }

      function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1);

        if (!isAtRightEdge) currentPosition += 1

        if (current.some(index => boxes[currentPosition + index].classList.contains('end'))) {
          currentPosition -= 1
        }
        draw()
      }

      function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
          currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
      }


      startBtn.addEventListener("click", () =>{
        if (timerID){
          clearInterval(timerID);
          timerID = null;
        }else{
          timerID = setInterval(moveDown, 500);
          nextRandom = Math.floor(Math.random()*theTetrominoes.length);
        }
      });

      function addScore() {
        for (let i = 0; i < 199; i +=width) {
          const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
    
          if(row.every(index => boxes[index].classList.contains('end'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
              boxes[index].classList.remove('end')
              boxes[index].classList.remove('tetromino')
              boxes[index].style.backgroundColor = ''
            })
            const boxesRemoved = boxes.splice(i, width)
            boxes = boxesRemoved.concat(boxes)
            boxes.forEach(cell => grid.appendChild(cell))
          }
        }
      }
    
      //game over
      function gameOver() {
        if(current.some(index => boxes[currentPosition + index].classList.contains('end'))) {
          scoreDisplay.innerHTML = 'end'
          clearInterval(timerId)
        }
      }
    
    })