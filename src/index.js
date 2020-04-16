import './main.scss';

class NavalBattle {
  constructor({
    table = '.battle',
    player = true
  }) {
    this.table = document.querySelector(table)
    this.ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
    this.player = player
    this.waiting = false
    this.whoseAttack = document.querySelector('.whose-attack')
    this.init()
  }
  init() {
    this.matrix = this.createMatrix()
    this.coordShip = []
    this.attack = new Set()
    this.table.innerHTML = ''
    this.initialShips()
    this.createTable()

    this.table.addEventListener('click', (e) => {
      if (!e.target.closest('td') || e.target.classList.contains('boom') || e.target.classList.contains('finder')) return
      let x = e.target.dataset.x
      let y = e.target.dataset.y
      if (!this.player && this.waiting) {
        this.handlerClick(x, y)
      }
    })
  }
  handlerClick(x, y) {
    if (this.matrix[y][x] === 1) {
      this.attacked(x, y, true)
    } else {
      this.attacked(x, y)
      setTimeout(() => {
        randomShot()
      }, 2000);
    }
  }
  createTable() {
    const { table, matrix } = this
    for (let i = 0; i < matrix.length; i++) {
      let tr = document.createElement('tr')
      for (let j = 0; j < matrix[i].length; j++) {

        let td = document.createElement('td')
        if (this.player) {
          if (matrix[i][j] === 1) {
            td.classList.add('ships')
          }
        }

        td.setAttribute('data-x', j)
        td.setAttribute('data-y', i)
        tr.append(td)
      }
      table.append(tr)
    }
  }
  visibleShips() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] === 1) {
          this.table.rows[i].cells[j].classList.add('ships')
        }
      }
    }
  }
  attacked(x, y, handler = false) {
    computer.waiting = handler
    this.whoseAttack.innerText = computer.waiting ? 'Ваш ход' : 'Ход противника'
    if (!this.coordShip.length) {
      return this.finished()
    }
    const { matrix } = this
    if (matrix[y][x] === 1) {
      this.table.rows[y].cells[x].classList.add('finder')
      this.findDestroyedShip(y, x)
    } else {
      this.table.rows[y].cells[x].classList.add('boom')
    }
  }
  initialShips() {
    this.ships.map((el) => this.createShip(el))
  }
  createMatrix() {
    const matrix = []
    for (let i = 0; i < 10; i++) {
      const arr = new Array(10).fill(0)
      matrix.push(arr)
    }
    return matrix
  }

  randomCoord(size = 0) {
    const { matrix } = this
    const rnd = [Math.floor(Math.random(0) * 10), Math.floor(Math.random(0) * 10)]
    let [x] = rnd
    rnd.push(x + size <= matrix.length - 1)
    if (this.validateCoorMatrix(rnd, size)) {
      return this.randomCoord(size)
    }
    return rnd
  }

  validateCoorMatrix(arr, size) {
    let [x, y, handler] = arr
    const { matrix } = this
    if (x + size > matrix.length - 1 && y + size > matrix.length - 1) return true

    let x1 = x - 1 < 0 ? 0 : x - 1,
      x2 = x + 1 > matrix.length - 1 ? matrix.length - 1 : x + 1,
      y1 = y - 1 < 0 ? 0 : y - 1,
      y2 = y + 1 > matrix.length - 1 ? matrix.length - 1 : y + 1;

    const interval = x === 0 ? 1 : 2

    for (let i = 0; i < size + interval; i++) {
      if (handler) {
        x1 = x1 > matrix.length - 1 ? matrix.length - 1 : x1
        if (matrix[y1][x1] === 1 || matrix[y][x1] === 1 || matrix[y2][x1] === 1) return true
        x1++
      } else {
        y1 = y1 > matrix.length - 1 ? matrix.length - 1 : y1
        if (matrix[y1][x1] === 1 || matrix[y1][x] === 1 || matrix[y1][x2] === 1) return true

        y1++
      }
    }
    return false
  }
  createShip(size) {
    let [x, y, handler] = this.randomCoord(size)
    let t = {
      handler,
      size,
      coord: new Set()
    }
    for (let i = 0, xCoor = x, yCoor = y; i < size; i++) {
      this.matrix[yCoor][xCoor] = 1
      t.coord.add('' + yCoor + xCoor)
      handler ? xCoor++ : yCoor++
    }
    this.coordShip.push(t)
  }
  markShip(obj) {
    const { matrix, table } = this
    let [y, x] = [...obj.coord][0].split('').map(el => Number(el));

    let x1 = x - 1 < 0 ? 0 : x - 1,
      x2 = x + 1 > matrix.length - 1 ? matrix.length - 1 : x + 1,
      y1 = y - 1 < 0 ? 0 : y - 1,
      y2 = y + 1 > matrix.length - 1 ? matrix.length - 1 : y + 1;

    let interval = x === 0 ? 1 : 2
    if (!obj.handler && y === 0) {
      interval = 1
    }
    for (let i = 0; i < obj.size + interval; i++) {
      if (obj.handler) {
        x1 = x1 > matrix.length - 1 ? matrix.length - 1 : x1
        matrix[y1][x1] === 1 ? null : table.rows[y1].cells[x1].classList.add('boom')
        matrix[y][x1] === 1 ? null : table.rows[y].cells[x1].classList.add('boom')
        matrix[y2][x1] === 1 ? null : table.rows[y2].cells[x1].classList.add('boom')
        x1++
      } else {
        y1 = y1 > matrix.length - 1 ? matrix.length - 1 : y1
        matrix[y1][x1] === 1 ? null : table.rows[y1].cells[x1].classList.add('boom')
        matrix[y1][x] === 1 ? null : table.rows[y1].cells[x].classList.add('boom')
        matrix[y1][x2] === 1 ? null : table.rows[y1].cells[x2].classList.add('boom')
        y1++
      }
    }
  }
  deleteShips(i, obj) {
    this.markShip(obj)
    this.coordShip = [
      ...this.coordShip.slice(0, i),
      ...this.coordShip.slice(i + 1)
    ]
    if (!this.coordShip.length) {
      return this.finished()
    }
  }
  finished() {
    this.whoseAttack.innerText = !this.player ? 'Вы победили!' : 'Вы проиграли...'
    computer.visibleShips()
    computer.waiting = false
    return
  }
  findDestroyedShip(...args) {
    this.attack.add(args.join(''))
    for (let i = 0; i < this.coordShip.length; i++) {
      if ([...this.coordShip[i].coord].filter(el => this.attack.has(el)).length === this.coordShip[i].size) {
        this.deleteShips(i, this.coordShip[i])
      }
    }
  }
}

const player = new NavalBattle({
  table: '.battle'
})
const computer = new NavalBattle({
  table: '.battle1',
  player: false
})
const randomNumber = () => Math.floor(Math.random(0) * 10)
const finishingShip = (coor) => {
  [...coor].map(el => el.split('')).forEach((item, i) => {
    setTimeout(() => {
      const [y, x] = item
      player.attacked(x, y)
    }, 1000 * (i + 1))
  })
  setTimeout(() => {
    randomShot()
  }, coor.size * 1500);
}

function randomShot() {
  if (!player.coordShip.length) return player.finished()
  let x = randomNumber()
  let y = randomNumber()
  let handler = true
  if (player.table.rows[y].cells[x].classList.contains('boom') || player.table.rows[y].cells[x].classList.contains('finder')) {
    return randomShot()
  }
  if (player.matrix[y][x] === 1) {
    let cr = '' + y + x
    for (let i = 0; i < player.coordShip.length; i++) {
      if ([...player.coordShip[i].coord].filter(el => el === cr).length) {
        finishingShip(player.coordShip[i].coord)
      }
    }
  }
  handler = player.matrix[y][x] === 1 ? false : true
  return player.attacked(x, y, handler)
}

const startOver = document.querySelector('.playing .start-over')
const playing = document.querySelector('.playing button')
const refresh = document.querySelector('.refresh')
startOver.addEventListener('click', () => {
  computer.waiting = false
  visibleButton()
  player.init()
  computer.init()
  player.whoseAttack.innerText = 'Нажмите начать игру'
})
playing.addEventListener('click', () => {
  computer.waiting = true
  computer.whoseAttack.innerText = 'Ваш ход'
  visibleButton()
})
const visibleButton = () => {
  playing.hidden = !playing.hidden
  startOver.hidden = !playing.hidden
  refresh.hidden = !refresh.hidden
}
refresh.addEventListener('click', () => {
  player.init()
})