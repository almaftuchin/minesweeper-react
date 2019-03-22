import React, { Component } from 'react';
import moment from 'moment';
import { Table } from 'react-bootstrap';

export class TopPlayers extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      gotTop: 0
    };
  }

  componentDidMount() {
    fetch('https://cryptic-harbor-11039.herokuapp.com/top5')
      .then(e => e.json())
      .then(e => {
        this.setState({
          data: e,
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
            <td>{moment(data.time).format('MMM Do YY, h:mm:ss a')}</td>
          </tr>
        );
      });
    }
    return (
      <div>
        <Table striped bordered style={{ color: 'white' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>{top5}</tbody>
        </Table>
      </div>
    );
  }
}

export default TopPlayers;
