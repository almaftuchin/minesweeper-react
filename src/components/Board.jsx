import React, { Component } from 'react';
import Cell from './Cell.jsx';
import Timer from './Timer.jsx';
import { Button, Row, Col } from 'react-bootstrap';
import {
  NotificationContainer,
  NotificationManager
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export class Board extends Component {
  constructor(props) {
    super(props);
    this.progress = 0;
    this.height = props.height;
    this.width = props.width;
    this.mines = props.mines;
    this.size = props.height * props.width;
    this.state = {
      board: this.initBoard(),
      status: 'Good luck!',
      started: 0,
      time: '00:00',
      minesLoc: [],
      godMode: 0,
      logged: localStorage.logged
    };
  }

  fillBoard(index) {
    let board = this.initBoard();
    board = this.addNeighbor(...this.addMines(board, index));
    return board;
  }

  newGame = () => {
    this.progress = 0;
    this.setState({
      board: this.initBoard(),
      status: 'Good luck!',
      started: 0,
      godMode: 0,
      time: '00:00'
    });
  };

  // Fill board with nada
  initBoard = () => {
    let board = [];
    for (let i = 0; i < this.size; i++) {
      board = [...board, { mine: 0, revealed: 0, flagged: 0, val: 0, boom: 0 }];
    }
    return board;
  };

  // Fill board with mines
  addMines = (board, cellIndex) => {
    let i = 0,
      j = [];
    const m = this.mines,
      w = this.width;
    while (i < m) {
      const index = this.randomNumber();
      const square = [-(w + 1), -w, -(w - 1), -1, 0, 1, w - 1, w, w + 1].map(
        val => index + val
      );
      // Because first click is always safe - make sure the square does not include first click's position
      if (!board[index].mine && !square.includes(cellIndex)) {
        board[index].mine = 1;
        j = [...j, index];
        i++;
      }
    }
    this.setState({ minesLoc: j });
    return [board, j];
  };

  // Fill board with moves
  // Original algorithm: traverse through board from first location to last location then add one for each bomb.
  // New algorithm: map through each bomb and add one to neighbors
  addNeighbor = (board, minesLocation) => {
    const size = this.size;
    const w = this.width;
    minesLocation.forEach(i => {
      // top neighbors
      if (i >= w) {
        // top left
        if (
          i - w - 1 >= 0 &&
          (i - w - 1) % w !== w - 1 &&
          !board[i - w - 1].mine
        )
          board[i - w - 1].val++;
        // top
        if (!board[i - w].mine) board[i - w].val++;
        // top right
        if ((i - w + 1) % w !== 0 && !board[i - w + 1].mine)
          board[i - w + 1].val++;
      }
      // bottom neighbors
      if (i < size - w) {
        // btm left
        if ((i + w - 1) % w !== w - 1 && !board[i + w - 1].mine)
          board[i + w - 1].val++;
        // btm
        if (!board[i + w].mine) board[i + w].val++;
        // btm right
        if ((i + w + 1) % w !== 0 && !board[i + w + 1].mine)
          board[i + w + 1].val++;
      }
      // left
      if (i - 1 >= 0 && (i - 1) % w !== w - 1 && !board[i - 1].mine)
        board[i - 1].val++;
      // right
      if (i + 1 < size && (i + 1) % w !== 0 && !board[i + 1].mine)
        board[i + 1].val++;
    });
    return board;
  };

  randomNumber = () => Math.floor(Math.random() * this.size);

  boom = index => {
    let copy = [...this.state.board];
    copy[index].boom = 1;
    copy.forEach(cell => {
      cell.revealed = 1;
    });
    this.setState({
      board: copy,
      status: '😢 You lost 😢',
      started: 0
    });
  };

  handleClick = (index, props) => {
    if (!this.state.started && !props.revealed) {
      this.setState(
        {
          started: 1,
          board: this.fillBoard(index)
        },
        () => {
          this.reveal(index, props);
        }
      );
    } else {
      this.reveal(index, props);
    }
  };

  reveal = (index, { mine, revealed, flagged, val }) => {
    if (revealed || flagged) return;
    if (mine) {
      // Kaboom T_T
      return this.boom(index);
    }
    if (val === 0) {
      this.floodFill(index);
    } else {
      let copy = [...this.state.board];
      copy[index].revealed = 1;
      // Check if win
      if (++this.progress === this.size - this.mines) {
        copy.forEach(cell => {
          cell.revealed = 1;
        });
        return this.setState(
          {
            board: copy,
            status: '🎉 YOU WON 🎉',
            started: 0
          },
          () => this.sendData()
        );
      }
      this.setState({
        board: copy
      });
    }
  };

  sendData = () => {
    // Cheating should not be added to top :D
    if (this.state.logged && !this.state.godMode) {
      fetch(
        `https://cryptic-harbor-11039.herokuapp.com/score?id=${
          localStorage.id
        }&name=${localStorage.name}&score=${this.state.time}&time=${new Date() *
          1}&access_token=${localStorage.accessToken}`
      );
    }
  };

  floodFill = i => {
    let board = [...this.state.board];
    if (board[i].mine || board[i].revealed) return;
    board[i].revealed = 1;
    this.progress++;
    this.setState({
      board: board
    });
    const w = this.width,
      size = this.size;
    if (i >= w) {
      // top left
      if (i - w - 1 >= 0 && (i - w - 1) % w !== w - 1)
        this.reveal(i - w - 1, board[i - w - 1]);
      // top
      this.reveal(i - w, board[i - w]);
      // top right
      if ((i - w + 1) % w !== 0) this.reveal(i - w + 1, board[i - w + 1]);
    }
    if (i < size - w) {
      // btm left
      if ((i + w - 1) % w !== w - 1) this.reveal(i + w - 1, board[i + w - 1]);
      // btm
      this.reveal(i + w, board[i + w]);
      // btm right
      if ((i + w + 1) % w !== 0) this.reveal(i + w + 1, board[i + w + 1]);
    }
    // left
    if (i - 1 >= 0 && (i - 1) % w !== w - 1) this.reveal(i - 1, board[i - 1]);
    // right
    if (i + 1 < size && (i + 1) % w !== 0) this.reveal(i + 1, board[i + 1]);
  };

  rightClick = (index, props, e) => {
    e.preventDefault();
    // If first click then reveal instead of flagging.
    if (!this.state.started) return this.handleClick(index, props, e);
    // Only flag-able if not revealed.
    if (this.state.board[index].revealed) return;
    let copy = [...this.state.board];
    copy[index].flagged = !copy[index].flagged;
    this.setState({
      board: copy
    });
  };

  clockIn = () => {
    let time = this.state.time.split(':');
    let m = Number(time[0]);
    let s = Number(time[1]) + 1;
    s %= 60;
    m += s === 0 ? 1 : 0;
    s = s < 10 ? '0' + s : s;
    m = m < 10 ? '0' + m : m;
    this.setState({
      time: m + ':' + s
    });
  };

  cheat = () => {
    if (!this.state.started)
      return NotificationManager.info('Start the game first!', 'Uh oh!', 3000);
    let copy = [...this.state.board];
    this.state.minesLoc.forEach(mine => {
      copy[mine].revealed = 1;
    });
    this.setState({
      board: copy,
      godMode: 1
    });
  };

  renderBoard = () => {
    return this.state.board.map((props, index) => {
      return (
        <Cell
          key={index}
          onClick={() => this.handleClick(index, props)}
          onContextMenu={e => this.rightClick(index, props, e)}
          cell={props}
        />
      );
    });
  };

  render() {
    const beautiful = { color: '#febd16' };
    return (
      <>
        <NotificationContainer />
        <Row className='text-center'>
          <Col md={12}>
            <h1 style={beautiful}>{this.state.status}</h1>
          </Col>
          <Col md={12}>
            <Button variant='primary' onClick={this.newGame}>
              New Game
            </Button>{' '}
            <Button
              variant='danger'
              onClick={this.cheat}
              disabled={this.state.godMode}
            >
              {'Defuse Mines 👀'}
            </Button>
          </Col>
          <Col md={12}>
            <Timer
              started={this.state.started}
              time={this.state.time}
              clockIn={this.clockIn}
            />
          </Col>
          <Col md={12} className='game'>
            {this.renderBoard()}
          </Col>
        </Row>
      </>
    );
  }
}

export default Board;
