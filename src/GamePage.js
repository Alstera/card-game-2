import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import { connect } from 'react-redux';
import { AddCards } from './action';
import Player from './components/Player';
import Table from './components/Table';
import Card from './components/Card';
import './App.css';

const API_PATH = 'https://deckofcardsapi.com/api/deck/';
const SHUFFLE_DECK_PATH = 'new/shuffle/';
const NUMBER_OF_DRAWN_CARDS = 10;
const DRAW_CARDS_PATH = '/draw/?count=' + NUMBER_OF_DRAWN_CARDS;

class GamePage extends Component {
  constructor(props) {
    super (props);

    this.state = {
     deckId: null,
     player0: false,
     player1: null,
     player2: null,
     player3: null,
     tableCards: []
    }

    this.getDeckId();
 }

 getDeckId() {
    axios.get(API_PATH + SHUFFLE_DECK_PATH).then(res => {
      this.setState({
        deckId: res.data.deck_id
      });
    });
  }

  getPlayer = (playerNumber) => {
    return (
      <Player index={playerNumber} />
    );
  };

  createCardComponents = () => {
    return this.props.table.map((card)=> {
        return(
            <Card key={card.code} url={card.image} func={()=>{}}/>
        );
    });
  }

  updateTableCards = () => {
    const newTableCards = this.createCardComponents();

    this.setState({
      tableCards: newTableCards
    });
  }

  drawCards = (playerNumber) => {
    axios.get(API_PATH + this.state.deckId + DRAW_CARDS_PATH).then(res =>{
      let playersCards = res.data.cards;
      this.props.addCards(playersCards, playerNumber);
      // let player = 'player' + playerNumber;
      // let playerComponent = this.getPlayer(playerNumber);

      let tableCards = this.createCardComponents();

      this.setState({
        player0: true,
        tableCards: tableCards
      });
    });
  }

  drawAllCards = () => {

    for (let i = 0; i < this.props.nump; i++) {
      this.drawCards(i);
    }
  };

  render(){
     return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1> Izaberite kartu </h1>
          <h5 className="podnaslov">Najveca karta odnosi ostale</h5>
        </header>
        <div>
  				<div className="horiz border" ref="player1"> </div>
          <div className="aside border" ref="player2"></div>
          <div className="tabla border">
              <button onClick={this.drawAllCards}>Podeli karte</button>
              <Table table={this.state.tableCards}/>
          </div>
          <div className="aside border" ref="player3"></div>
          <div className="horiz border" ref="player0">{this.state.player0?<Player updateTableCards={()=> this.updateTableCards()} index={0} />:''} </div>
				</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cards: state.cards,
    points: state.points,
    nump: state.nump,
    table: state.table
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCards: ( (cards, index) => dispatch(AddCards(cards, index)) )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);
// export default GamePage;
