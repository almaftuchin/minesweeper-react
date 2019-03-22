import React, { Component } from 'react';
import Board from './components/Board';
import NavBar from './components/NavBar';
import TopPlayers from './components/TopPlayers';
import { Container, Col, Row } from 'react-bootstrap';
import './App.css';

class App extends Component {
  render() {
    return (
      <>
        <NavBar />
        <Container style={{ height: '100vh' }}>
          <Row className='h-100 align-items-center'>
            <Col md={12}>
              <Board height={8} width={8} mines={10} />
            </Col>
            <Col md={12}>
              <TopPlayers />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default App;
