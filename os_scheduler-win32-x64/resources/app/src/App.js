import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
	fcfs,
	primitive_sjf,
	non_primitive_sjf,
	primitive_prority,
	non_primitive_prority
} from './logic.js';


class App extends Component {
  constructor() {
  	super();
  	this.state = {
  		lastKey : -1,
  		method: 'FCFS',
  		state: 'reset',
  		step: 1,
  		counter: 0,
      pause: false,
  		lastProcess: undefined,
  		output: [],
  		processes: [],
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
		    'reminder':0,
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
  		if(processes[i].key == id)processes[i].reminder -= amount;
  	};
  }
  removeProcess(id) {
  	var processes = [];
  	for (var i = 0; i < this.state.processes.length; i++) {
  		if(this.state.processes[i].key != id)processes.push(this.state.processes[i]);
  	};
  	this.setState((prev)=>{
  		return {
  			processes
  		}
  	})
  }
  handleInputChange(id, arrival, reminder, priority) {
  	for (var i = 0; i < this.state.processes.length; i++) {
  		if(this.state.processes[i].key == id){
  			this.setState((prev)=>{
		  		var processes = prev.processes;
		  		processes[i].arrival = +arrival;
		  		processes[i].reminder = +reminder;
		  		processes[i].cpu = +reminder;
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
  	clearInterval(this.state.clock);
  	this.setState(()=>{
  		return {
  			counter: 0,
  			state: 'reset',
  			clock: undefined,
  			output: [],
        pause: false,
  			processes: this.state.firstCapture,
  			firstCapture : []
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
  startClock() {
  	this.startClicked();
  	this.setState(()=>{
  		return {
  			clock: setInterval(()=>{
		  		this.runStep(this.state.step);		
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
  	if(this.state.method == "FCFS")results = {output:fcfs(input, step, lastProcess), lastProcess: undefined};
  	else if(this.state.method == "RR")results = {output:fcfs(input, step, lastProcess), lastProcess: undefined};
  	else if(this.state.method == "SJF")results = non_primitive_sjf(input, step, lastProcess);
  	else if(this.state.method == "SJF-P")results = primitive_sjf(input, step, lastProcess);
  	else if(this.state.method == "Priority")results = non_primitive_prority(input, step, lastProcess);
  	else if(this.state.method == "Priority-p")results = primitive_prority(input, step, lastProcess);
  	this.updateProcesses(results, this.state.processes);
  	console.log(results);
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
	  	console.log(output);
  		return {
  			counter: prev.counter + step,
  			output
  		}
  	})
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
    var i = -1;
    function getColor() {
      i++;
      i = i%colors.length;
      return colors[i];
    }
  	var processes = this.state.processes.map((cur)=>{
  		function onChangeReminder(event) {
  			this.handleInputChange(cur.key, cur.arrival, event.target.value, cur.priority);
  		}
  		function onChangePriority(event) {
  			this.handleInputChange(cur.key, cur.arrival, cur.reminder, event.target.value);
  		}
  		function onChangeArrival(event) {
  			this.handleInputChange(cur.key, event.target.value, cur.reminder, cur.priority);
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
					<input type="text" value={cur.reminder} onChange={onChangeReminder.bind(this)} disabled={cur.disabled}/>
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
        <label className="key">P{cur.key}</label>
        <span style={{background: getColor()}}></span>
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
					<div className="timer">
						<label for="">{this.state.step}</label>
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
							<span>Waiting Time :</span>
							<label>13 s</label>
						</div>
						<div className="turn-around-time">
							<span>Turn around Time :</span>
							<label>17 s</label>
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
