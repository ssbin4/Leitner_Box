import React, { Component } from 'react';
import './cards.css';


class wordCards extends Component {
  // state 초기값 설정
  constructor(){
    super();
    this.state={
      cards:[],
      level:1,
      num:0,
      cardsCount:[]
    }
}

  updateValue(){
    if(this.state.cards.length&&this.state.num<this.state.cards.length){
      document.querySelector('.study .words').innerHTML=`학습할 단어 :${this.state.cards[this.state.num].words}`;
      document.querySelector('.study .check').style.display='flex';
      document.getElementById('answerButton').style.display='flex';
      document.getElementById('answerMeaning').innerHTML='';
    }
    else{
      document.querySelector('.study .words').innerHTML=`단어가 없습니다.`;
      document.querySelector('.study .check').style.display='none';
      document.getElementById('answerButton').style.display='none';
      document.getElementById('answerMeaning').innerHTML='';
    }
  }

  componentDidMount() {
      var url='http://localhost:8080/words/'+this.state.level;
      fetch(url)
      .then(res => res.json())
      .then(cards => this.setState({cards}));
      fetch('http://localhost:8080/words')
      .then(res=>res.json())
      .then(cardsCount=>this.setState({cardsCount}));
      this.setState({currentMeaning:'정답 확인하기'});
      this.updateValue();
  }

  componentDidUpdate(prevProps,prevState){
    if(this.state.level!==prevState.level){
      var url='http://localhost:8080/words/'+this.state.level;
      fetch(url)
      .then(res => res.json())
      .then(cards => this.setState({cards}));
      fetch('http://localhost:8080/words')
      .then(res=>res.json())
      .then(cardsCount=>this.setState({cardsCount}));
      this.setState({num:0});
    }
    this.updateValue();
  }


  handleSubmit=(e)=>{
   e.preventDefault();
   fetch('http://localhost:8080/words',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          words:e.target.words.value,
          meaning:e.target.meaning.value
        })
    })
    .then(res=>res.json())
    .then(window.location.href='http://localhost:3000/wordCards');
  }
  changeLevel=(i,e)=>{
    e.preventDefault();
    this.setState({level:i});
  }
  
  changeCard=(suc,e)=>{
    if(this.state.num===this.state.cards.length){
      return;
    }
    if(this.state.num<this.state.cards.length)
    {
      this.setState({num:this.state.num+1});
    }
    else{
      document.querySelector('.study .words').innerHTML='칸에 단어가 더 이상 없습니다. 다른 칸을 선택하세요.';
      document.querySelector('.study .answer').style.display='none';
    }
    fetch('http://localhost:8080/words/update',{
      method:'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        id:this.state.cards[this.state.num].id,
        level:this.state.cards[this.state.num].level,
        success:suc
      })
    });
    var newCount=this.state.cardsCount;
    var level=this.state.cards[this.state.num].level;
    newCount[level-1]-=1;
    if(suc==="success"){
      if(level!=5){
        newCount[level]+=1;
      }
    }
    else{
      newCount[0]+=1;
    }
    this.setState({cardsCount:newCount});
  }

  showAnswer=(e)=>{
    document.getElementById('answerButton').style.display='none';
    document.getElementById('answerMeaning').innerHTML=this.state.cards[this.state.num].meaning;
  }

  showForm=(e)=>{
    document.getElementById('showForm').style.display='none';
    document.querySelector('form').style.display='flex';
  }


  render() {
    return (
      <div className="wordCards">
        <a href="./imageCards"> Go to imageCards </a>
        <h1>Words</h1>
        <div className="study">
          <div className="level">
            <h3>학습할 칸을 선택하세요 </h3>
            <div className="levelButton">
              <button onClick={this.changeLevel.bind(this,1)}> 1 </button>
              <button onClick={this.changeLevel.bind(this,2)}> 2 </button>
              <button onClick={this.changeLevel.bind(this,3)}> 3 </button>
              <button onClick={this.changeLevel.bind(this,4)}> 4 </button>
              <button onClick={this.changeLevel.bind(this,5)}> 5 </button>
            </div>
            <h3> 현재 학습 칸 : {this.state.level} </h3>
          </div>
          <div className="count">
            [1] {this.state.cardsCount[0]} / 10 <br/> 
            [2] {this.state.cardsCount[1]} / 20 <br/> 
            [3] {this.state.cardsCount[2]} / 30 <br/> 
            [4] {this.state.cardsCount[3]} / 40 <br/> 
            [5] {this.state.cardsCount[4]} / 50 <br/> 
          </div>
          <div className="words" id="id_words">

          </div>
          <div className="answer">
            <button id="answerButton" onClick={this.showAnswer}> 정답 확인하기</button>
            <div id="answerMeaning"> 

            </div>
          </div>
          <div className="check">
            <button id="success" onClick={this.changeCard.bind(this,"success")}> 성공</button>
            <button id="fail" onClick={this.changeCard.bind(this,"fail")}> 실패</button>
          </div>
        </div>
        <div className="submitForm">
          <button id="showForm" onClick={this.showForm}> 새 단어 추가하기 </button>
          <form onSubmit={this.handleSubmit}>
            <input type="text" name="words" placeholder="Words" />
            <input type="text" name="meaning" placeholder="Meaning"/>
            <input type="submit" value="Submit"/>
          </form>
        </div>
      </div>
    );
  }
}
export default wordCards;

