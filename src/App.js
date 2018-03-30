import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  fcfs,
  primitive_sjf,
  non_primitive_sjf,
  primitive_prority,
  non_primitive_prority,
  roundrobin,
  resetQuantum
} from './logic.js';


class App extends Component {
  constructor() {
    super();
    this.state = {
      lastKey : 2,
      lastKeyNull : -1,
      method: 'FCFS',
      state: 'reset',
      waitingTime: 0,
      turnAroundTime: 0,
      step: 1,
      counter: 0,
      quantum: 1,
      pause: false,
      lastProcess: undefined,
      output: [],
      processes: [
        {
          key: 0,
          arrival: 0,
          'priority':1,
          'cpu':0,
          'departure':0,
          'falg': false,
          'remainder':0,
          'disabled':false
        },
        {
          key: 1,
          arrival: 0,
          'priority':1,
          'cpu':0,
          'departure':0,
          'falg': false,
          'remainder':0,
          'disabled':false
        },
        {
          key: 2,
          arrival: 0,
          'priority':1,
          'cpu':0,
          'departure':0,
          'falg': false,
          'remainder':0,
          'disabled':false
        }
      ],
      firstCapture: []
    }
  }
  addProcess = ()=>{
    this.setState((prev)=>{
      var processes = prev.processes;
      var lastKey = prev.lastKey + 1;
      processes.push({
        key: lastKey,
        arrival: 0,
        'priority':1,
        'cpu':0,
        'departure':0,
        'falg': false,
        'remainder':0,
        'disabled':false
      });
      return {
        processes,
        lastKey
      }
    })
  }
  downgradeProcess(id, amount, processes) {
    for (var i = 0; i < processes.length; i++) {
      if(processes[i].key == id)processes[i].remainder -= amount;
      if(processes[i].remainder == 0 && !processes[i].flag){
        processes[i].flag = true;
        processes[i].departure = this.state.counter + 1;
      }
    };
  }
  removeProcess(id) {
    var processes = [];
    var x = 0;
    for (var i = 0; i < this.state.processes.length; i++) {
      if(this.state.processes[i].key != id){
        this.state.processes[i].key = x;
        processes.push(this.state.processes[i]);
        x++;
      }
    };
    this.setState((prev)=>{
      return {
        processes,
        lastKey: x - 1
      }
    })
  }
  handleInputChange(id, arrival, remainder, priority) {
    for (var i = 0; i < this.state.processes.length; i++) {
      if(this.state.processes[i].key == id){
        this.setState((prev)=>{
          var processes = prev.processes;
          processes[i].arrival = +arrival;
          processes[i].remainder = +remainder;
          processes[i].cpu = +remainder;
          processes[i].priority = +priority;
          return {
            processes
          }
        })
        break;
      }
    };
  }
  startClicked() {
    if(this.state.state == 'reset'){
      this.setState((prev)=>{
        return {
          state: 'running',
          firstCapture: prev.processes.map(cur=>Object.assign({},cur)) 
        }
      })
    }
    this.setState((prev)=>{
      var processes = prev.processes;
      processes.forEach((cur)=>{
        cur.disabled = true;
      });
      return {
        processes,
        pause: true
      }
    })  
  }
  methodChanged(event) {
    let temp = event.target.value;
    this.setState(()=>{
      return {
        method: temp
      }
    })
  }
  updateProcesses(results, processes) {
    results.output.forEach((cur)=>{
      this.downgradeProcess(cur.key, cur.runTime, processes)
    });
    this.setState(()=>{
      return {
        lastProcess: results.lastProcess,
        processes
      }
    })
  }
  resetClock() {
    resetQuantum();
    clearInterval(this.state.clock);
    this.setState(()=>{
      return {
        counter: 0,
        state: 'reset',
        clock: undefined,
        output: [],
        pause: false,
        processes: this.state.firstCapture,
        lastKey: this.state.firstCapture.length != 0 ? this.state.firstCapture[this.state.firstCapture.length - 1].key : -1,
        firstCapture : [],
        waitingTime: 0,
        turnAroundTime: 0,
        lastKeyNull: -1
      }
    })
  }
  pauseClock() {
    clearInterval(this.state.clock);
    this.setState(()=>{
      return {
        clock: undefined,
        pause: false
      }
    })
  }
  quantumChanged(event) {
    let temp = event.target.value;
    this.setState(()=>{
      return {quantum: +temp}
    });
  }
  updateTimes() {
    this.setState((prev)=>{
      let k = 0;
      let waitingTime = prev.processes.reduce((aggr, cur)=>{
          if(cur.departure != 0){
            aggr += (cur.departure - cur.arrival - cur.cpu);
            k++;
          }
          return aggr;
        },0);
      let turnAroundTime = prev.processes.reduce((aggr, cur)=>{
          if(cur.departure != 0){
            aggr += (cur.departure - cur.arrival);
          }
          return aggr;
        },0);
      return {
        turnAroundTime: (k == 0) ? 0 : (turnAroundTime/ k),
        waitingTime: (k == 0) ? 0 : (waitingTime/ k)
      }
    })
  }
  startClock() {
    this.startClicked();
    this.setState(()=>{
      return {
        clock: setInterval(()=>{
          this.runStep(this.state.step);  
          this.updateTimes(); 
        },1000)
      }
    })
  }
  runStep(step) {
    var input = this.state.processes.slice();
    input = input.filter((cur)=>{
      return cur.arrival <= this.state.counter
    }).filter((cur)=>cur.remainder != 0);
    input = input.map(cur=>Object.assign({},cur));
    var lastProcess = this.state.lastProcess;
    let results;
    //el3el2 waleed
    if (input.length == 0) {
      this.setState((prev)=>{
        var output = prev.output;
        var lastKeyNull = prev.lastKeyNull + 1; 
        output.push({
          key: '#' + lastKeyNull,
          flag: true,
          runTime: step
        });
        output = output.reduce((acc, cur)=>{
          if(cur.runTime == 0)return acc;
          if(acc.length != 0){
            if(acc[acc.length - 1].flag && cur.flag){
              acc[acc.length - 1].runTime += cur.runTime;
            }else{
              acc.push(cur)
            }
          }else{
            acc.push(cur)
          }
          return acc;
        },[]);
        return {
          counter: prev.counter + step,
          output,
          lastKeyNull
        }
      });
    }else{
      if(this.state.method == "FCFS")results = {output:fcfs(input.sort((prev, cur)=>{
        return prev.arrival > cur.arrival;
      }), step, lastProcess), lastProcess: undefined};
      else if(this.state.method == "RR")results = {output:roundrobin(input.sort((prev, cur)=>{
        return prev.arrival > cur.arrival;
      }), this.state.quantum, lastProcess), lastProcess: undefined};
      else if(this.state.method == "SJF")results = non_primitive_sjf(input, step, lastProcess);
      else if(this.state.method == "SJF-P")results = primitive_sjf(input, step, lastProcess);
      else if(this.state.method == "Priority")results = non_primitive_prority(input, step, lastProcess);
      else if(this.state.method == "Priority-p")results = primitive_prority(input, step, lastProcess);
      this.updateProcesses(results, this.state.processes);
      this.setState((prev)=>{
        let output = prev.output.concat(results.output);
        output = output.reduce((acc, cur)=>{
          if(cur.runTime == 0)return acc;
          if(acc.length != 0){
            if(acc[acc.length - 1].key == cur.key){
              acc[acc.length - 1].runTime += cur.runTime;
            }else{
              acc.push(cur)
            }
          }else{
            acc.push(cur)
          }
          return acc;
        },[]);
        return {
          counter: prev.counter + step,
          output
        }
      })
    }
  }
  render() {
    var colors = [
      '#375a7f',
      '#b72a67',
      '#fa9856',
      '#8559a5',
      '#e95280',
      '#e8751a',
      '#35c2bd',
      '#7e6752',
      '#6ba083',
      '#669b7'
    ]
    function getColor(key) {
      return colors[key%colors.length];
    }
    var processes = this.state.processes.map((cur)=>{
      function onChangeremainder(event) {
        this.handleInputChange(cur.key, cur.arrival, event.target.value, cur.priority);
      }
      function onChangePriority(event) {
        this.handleInputChange(cur.key, cur.arrival, cur.remainder, event.target.value);
      }
      function onChangeArrival(event) {
        this.handleInputChange(cur.key, event.target.value, cur.remainder, cur.priority);
      }
      function onDelete() {
        this.removeProcess(cur.key);
      }
  		return (
  			<tr key={cur.key}>
				<th scope="row">{cur.key}</th>
				<td>
					<input type="text" value={cur.arrival} onChange={onChangeArrival.bind(this)} disabled={cur.disabled}/>
				</td>
				<td>
					<input type="text" value={cur.remainder} onChange={onChangeremainder.bind(this)} disabled={cur.disabled}/>
				</td>
				<td>
					<input type="text" value={cur.priority} onChange={onChangePriority.bind(this)} disabled={cur.disabled}/>
					{cur.disabled ? '' : (
						<button className="delete--btn" onClick={onDelete.bind(this)}>
							<img src="close.svg" alt=""/>
						</button>
					)}
				</td>
			</tr>
  		)
  	})
    var startTime = 0;
    var counter = this.state.output.reduce((aggr, cur)=>aggr+=cur.runTime,0);
    var ganttChart = this.state.output.map((cur, index)=>{
     let endTime = startTime;
     startTime += cur.runTime;
     return (
      <div className="process" key={cur.key} style={{flex: (cur.runTime / counter)}}>
        <label className="key">{(cur.flag) ? '' : 'P'+ cur.key}</label>
        <span style={{background: (cur.flag) ? '#ccc' : getColor(cur.key)}}></span>
        <label className="start-time">{endTime}</label>
        {
          ((index+1) == this.state.output.length && false) ? (
            <label className="end-time">{counter}</label>
          ) : ''
        }
      </div>
     )
    })
    return (
      	<section className="UI">
		<header>
      <span>Scheduler</span>
		</header>
		<section className="input">
			<div className="container">
				<div className="table-content">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">P</th>
								<th scope="col">Arrival</th>
								<th scope="col">{this.state.state == 'reset' ? 'CPU Brust' : 'Remainder'}</th>
								<th scope="col">Priority</th>
							</tr>
						</thead>
						<tbody>
							{processes}
						</tbody>
					</table>
				</div>
				<div className="controller">
					<button className="add" onClick={this.addProcess.bind(this)} style={{
            backgroundColor: this.state.pause ? '#ccc' : '',  
            color: this.state.pause ? '#ccc' : '',
            border: this.state.pause ? '1px solid #ccc' : ''
          }} 
          disabled={this.state.pause}>
						<span style={{
              color: this.state.pause ? 'black' : ''
            }}>+</span>
					</button>
					<div className="type">
						<select onChange={this.methodChanged.bind(this)}>
							<option value="FCFS" selected>FCFS</option>
							<option value="RR">RR</option>
							<option value="SJF">SJF</option>
							<option value="SJF-P">SJF-Preemptive</option>
							<option value="Priority">Priority</option>
							<option value="Priority-p">Priority-Preemptive</option>
						</select>
					</div>
					<input type="text" disabled={this.state.state != 'reset'} style={{display: (this.state.method == 'RR') ? '' : 'none',backgroundColor: (this.state.state != 'reset') ? '#ccc' : ''}} className = "quantum " onChange={this.quantumChanged.bind(this)}  placeholder = "Quantum" />
          
					<div className="timer">
						<label>{this.state.counter}</label>
						<div>
							{!this.state.pause ? 
                  (     
                  <button className="play" onClick={this.startClock.bind(this)}>
                    <img src="play-button.svg" alt="" />
                  </button>
                  )
               : (
                <button className="pause" onClick={this.pauseClock.bind(this)}>
                  <img src="pause.svg" alt="" />
                </button>
              )}
							<button className="stop" onClick={this.resetClock.bind(this)}>
								<img src="media-stop-button.svg" alt="" />
							</button>
						</div>
					</div>
				</div>
				<div className="output">
					<div className="time">
						<div className="waiting-time">
							<span>Waiting Time : </span>
							<label>{this.state.waitingTime} s</label>
						</div>
						<div className="turn-around-time">
							<span>Turn around Time : </span>
							<label>{this.state.turnAroundTime} s</label>
						</div>
					</div>
					<div className="chart">
						{ganttChart}
					</div>
				</div>
			</div>
		</section>
	</section>
    );
  }
}

export default App;
