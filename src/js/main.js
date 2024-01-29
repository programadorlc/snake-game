const socket = io('http://localhost:3000')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const audio = new Audio('../assets/brum.mp3')

// definido o tamanho da cobra
const size = 30

// definindo a posicao em array x e y da cobra no canvas
const snake = [
  { x: 270, y: 240 },
]

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size)
  return Math.round(number / 30) * 30
}

const randomColor = () => {
  const red = randomNumber(0, 255)
  const green = randomNumber(0, 255)
  const blue = randomNumber(0, 255)

  return `rgb(${red}, ${green}, ${blue})`
}

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor()
}

let direction, loopId

const drawFood = () => {
  const { x, y, color } = food

  ctx.shadowColor = color
  ctx.shadowBlur = 10
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
  ctx.shadowBlur = 0
}

const drawSnake = () => {
  // definindo a cor da cobra no canvas
  ctx.fillStyle = '#ddd'

  // percorrendo a minha array de posicao da cobra 
  // pegando a posicao e o index
  snake.forEach((position, index) => {
    // verificando a ultima posicao da minha array e mudano a cor
    if (index == snake.length - 1) {
      ctx.fillStyle = '#aaa'
    }
    // pegando a posicao da cobra e tamanho
    ctx.fillRect(position.x, position.y, size, size)
  })
}

const moveSnake = () => {
  // verificando se nao tiver uma direcao, nao executa 
  // a funcao de mover
  if (!direction) return

  const head = snake[snake.length - 1]

  if (direction == 'right') {
    snake.push({ x: head.x + size, y: head.y })
  }

  if (direction == 'left') {
    snake.push({ x: head.x - size, y: head.y })
  }

  if (direction == 'down') {
    snake.push({ x: head.x, y: head.y + size })
  }

  if (direction == 'up') {
    snake.push({ x: head.x, y: head.y - size })
  }

  snake.shift()
}

const drawGrid = () => {
  ctx.lineWidth = 1
  ctx.strokeStyle = '#191919'

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i, 600)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(600, i)
    ctx.stroke()
  }
}

const checkEat = () => {
  const head = snake[snake.length - 1]

  if (head.x == food.x && head.y == food.y) {
    snake.push(head)
    audio.play()

    let x = randomPosition()
    let y = randomPosition()

    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition()
      y = randomPosition()
    }

    food.x = x
    food.y = y
    food.color = randomColor()
  }
}

const checkCollision = () => {
  const head = snake[snake.length - 1]

  if (head.x < 0 || head.x > canvas.width - 1 || head.y < 0 || head.y > canvas.width - 1) {
    alert('voce perdeu')
  }
}

const gameLoop = () => {
  clearInterval(loopId)

  ctx.clearRect(0, 0, 600, 600)
  drawGrid()
  drawFood()
  moveSnake()
  drawSnake()
  checkEat()
  checkCollision()

  loopId = setTimeout(() => {
    gameLoop()
  }, 300)
}

gameLoop()

document.addEventListener('keydown', ({ key }) => {
  if (key == 'ArrowRight' || key == 'd' && direction !== 'left') {
    direction = 'right'
  }

  if (key == 'ArrowLeft' || key == 'a' && direction !== 'right') {
    direction = 'left'
  }

  if (key == 'ArrowDown' || key == 's' && direction !== 'up') {
    direction = 'down'
  }

  if (key == 'ArrowUp' || key == 'w' && direction !== 'down') {
    direction = 'up'
  }
})
