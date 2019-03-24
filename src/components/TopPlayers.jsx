import React, { Component } from 'react';
import moment from 'moment';
import { Table, Button, Modal } from 'react-bootstrap';

export class TopPlayers extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      gotTop: 0,
      show: false
    };
  }

  showRank = () => this.setState({ show: !this.state.show });

  componentDidMount() {
    let easy = fetch(
      'https://cryptic-harbor-11039.herokuapp.com/top5?level=Easy'
    ).then(e => e.json());
    let hard = fetch(
      'https://cryptic-harbor-11039.herokuapp.com/top5?level=Hard'
    ).then(e => e.json());
    let expert = fetch(
      'https://cryptic-harbor-11039.herokuapp.com/top5?level=Expert'
    ).then(e => e.json());
    Promise.all([easy, hard, expert]).then(data => {
      data = [...data[0], ...data[1], ...data[2]];
      this.setState({
        data: data,
        gotTop: 1
      });
    });
  }
  render() {
    let top5 = null;
    if (this.state.gotTop) {
      top5 = this.state.data.map((data, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{data.name}</td>
            <td>{data.score}</td>
            <td>{data.level}</td>
            <td>{moment(data.time).format('MMM Do YY, h:mm:ss a')}</td>
          </tr>
        );
      });
    }
    return (
      <>
        <Button
          variant='success'
          onClick={this.showRank}
          style={{ marginTop: '20px' }}
        >
          {'🏆 Leaderboard 🏆'}
        </Button>
        <Modal show={this.state.show} onHide={this.showRank}>
          <Modal.Header closeButton>
            <Modal.Title>Top Players</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered style={{ color: 'black' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Level</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>{top5}</tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.showRank}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default TopPlayers;
