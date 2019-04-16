import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function Clock({ className = "", hours = 0, minutes = 20, seconds = 0, miliseconds = 0 }) {
  hours = 0 > hours || hours > 59 ? 0 : hours;
  minutes = 0 > minutes || minutes > 59 ? 0 : minutes;
  seconds = 0 > seconds || seconds > 59 ? 0 : seconds;
  miliseconds = 0 > miliseconds || miliseconds > 999 ? 0 : miliseconds;

  return (
    <h2 className={"Clock" + className}>
      Pozostało {hours < 10 ? "0" + hours : hours}:
      {minutes < 10 ? "0" + minutes : minutes}:
      {seconds < 10 ? "0" + seconds : seconds}:
      {miliseconds < 10
        ? "00" + miliseconds
        : miliseconds < 100
        ? "0" + miliseconds
        : miliseconds}
    </h2>
  );
}

function ProgressBar({ className = "", percent = 7, trackRemaining = false }) {
  var styles = {
    width: `${percent}%`
  };

  var progressBarBackwards = {
    display: "flex",
    justifyContent: "flex-end"
  };

  var stylesBackwards = {
    width: `${100 - percent}%`
  };

  // var trackRemaining
  if (trackRemaining) {
    return (
      <div className={"ProgressBar " + className}  style={progressBarBackwards}>
        <div style={stylesBackwards} />
      </div>
    );
  } else {
    return (
      <div className={"ProgressBar " + className} >
        <div style={styles} />
      </div>
    );
  }
}

class Timebox extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isRunning: false,
      isPaused: false,
      pausesCount: 0,
      elapsedTimeInSeconds: 0
    };

    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.togglePause = this.togglePause.bind(this);


  }

  handleStart(event) {
    this.setState({
      isRunning: true,
      //elapsedTimeInSeconds: 15* 60 + 20
    });

    this.startTimer();
  }

  startTimer(){
    this.intervalId = window.setInterval(
      
      // this is arrow function equivalent to  // function(){  }.bind(this)
      () => {
          this.setState(
            (prevState) => ( { elapsedTimeInSeconds: prevState.elapsedTimeInSeconds + 1 }) 
          )
      },
      1000
    )
  }

  stopTimer(){
    window.clearInterval(this.intervalId);
  }

  handleStop(event) {
    this.setState({
      isRunning: false,
      isPaused: false,
      pausesCount: 0,
      elapsedTimeInSeconds : 0
    });

    this.stopTimer();
  }

  togglePause() {
    this.setState(
      function(prevState){ 
        var isPaused = !prevState.isPaused;
        
        if(isPaused){
          this.stopTimer();
        }else{
          this.startTimer();
        }
        
        return { 
          isPaused : !prevState.isPaused,
          pausesCount: isPaused ? prevState.pausesCount + 1 : prevState.pausesCount
        }
    });
  }

  render() {
    const { isPaused, isRunning, pausesCount, elapsedTimeInSeconds} = this.state;
    const totalTimeInSeconds =  60
    const timeLeftInSeconds = totalTimeInSeconds - elapsedTimeInSeconds;
    const minutesLeft = Math.floor(timeLeftInSeconds / 60);
    const secondsLeft = Math.floor(timeLeftInSeconds % 60);

    const progressInPercent = (elapsedTimeInSeconds / totalTimeInSeconds ) * 100;

    return (
      <div className="Timebox">
        <h1>Uczę się skrótów klawiszowych</h1>
        <Clock className={isPaused ? "inactive" : "" } hours="-33" minutes= {minutesLeft} seconds= {secondsLeft} miliseconds="111" />
        <ProgressBar className={isPaused ? "inactive" : "" } percent= {progressInPercent} trackRemaining="true" />
        <button onClick={this.handleStart} disabled={isRunning}>
          Start
        </button>
        <button onClick={this.handleStop} disabled={!isRunning}>
          Stop
        </button>
        <button onClick={this.togglePause}>Pauzuj</button>
        Liczba przerw: {pausesCount}
      </div>
    );
  }
}

function TimeboxEditor() {
  return (
    <div className="TimeboxEditor">
      <label>
        Co robisz?
        <input value="Uczę się skrótów klawiszowych" type="text" />
      </label>
      <br />
      <label>
        Ile minut? <input value="25" type="number" />
      </label>
      <br />
      <button>Zacznij</button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <TimeboxEditor />
      <Timebox />
    </div>
  );
}

const rootElement = document.getElementById("root");

ReactDOM.render(
  <div>
    <App />
  </div>,
  rootElement
);
