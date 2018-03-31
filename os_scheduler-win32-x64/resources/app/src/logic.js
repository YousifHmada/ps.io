
var turn = 0;
var remaining_quantum = 0 ;

function resetQuantum() {
	remaining_quantum = 0;
}

function roundrobin(input,Quantum){
    var output = [];
    turn %= input.length;
    if (input.length == 1)
    {
    	turn = 0;
    }
    if (remaining_quantum == 0)
        {
            remaining_quantum = Quantum;
        }
    input[turn].remainder --;
    remaining_quantum --;
    output.push(
        {
            key:input[turn].key,
            runTime:1
        }
    );
    if(remaining_quantum == 0 && input[turn].remainder != 0)
        {
            remaining_quantum = Quantum;
            debugger;
            turn ++;
        }
    else if (input[turn].remainder == 0)
        {
            remaining_quantum = Quantum;
        }
    return output;
}

function non_primitive_prority(input, cpuBurst, lastProcess){
	var output = [];
	function selectedProceess(){
		input = input.filter((cur)=>{
			return cur.remainder != 0;
		}).sort((prev, cur)=>{
			return cur.priority > prev.priority;
		})
	};
	if(cpuBurst == 0)return output;
	while(true)
	{
		let x;
		if(lastProcess != undefined)
		{
			for (var i = 0; i < input.length; i++) {
				if(input[i].key == lastProcess){	
					x = i;	
					lastProcess = undefined;
				};
			}
		}else{
			selectedProceess();
			x = 0;
		}
		if(input.length == 0)break;
		var temp = input[x].remainder - cpuBurst;
		if(temp < 0){
			output.push(
				{
					key: input[x].key,
					runTime: input[x].remainder
				}
			);
			cpuBurst -= input[x].remainder;
			input[x].remainder = 0;
		}else{
			input[x].remainder = temp;
			output.push(
				{
					key: input[x].key,
					runTime: cpuBurst
				}
			);
			input[x].remainder = temp;
			if(temp != 0)lastProcess = input[x].key;
			break;
		}
	}
	return {
		output,
		lastProcess
	};
}

function primitive_prority(input, cpuBurst){
	var output = [];
	function selectedProceess(){
		input = input.filter((cur)=>{
			return cur.remainder != 0;
		}).sort((prev, cur)=>{
			return cur.priority > prev.priority;
		})
	};
	if(cpuBurst == 0)return output;
	while(true)
	{
		selectedProceess();
		if(input.length == 0)break;
		var temp = input[0].remainder - cpuBurst;
		if(temp < 0){
			output.push(
				{
					key: input[0].key,
					runTime: input[0].remainder
				}
			);
			cpuBurst -= input[0].remainder;
			input[0].remainder = 0;
		}else{
			input[0].remainder = temp;
			output.push(
				{
					key: input[0].key,
					runTime: cpuBurst
				}
			);
			input[0].remainder = temp;
			break;
		}
	}
	return {output};
}

function non_primitive_sjf(input, cpuBurst, lastProcess){
	debugger;
	var output = [];
	function selectedProceess(){
		input = input.filter((cur)=>{
			return cur.remainder != 0;
		}).sort((prev, cur)=>{
			return cur.remainder < prev.remainder;
		})
	};
	if(cpuBurst == 0)return output;
	while(true)
	{
		let x;
		if(lastProcess != undefined)
		{
			for (var i = 0; i < input.length; i++) {
				if(input[i].key == lastProcess){	
					x = i;
					lastProcess = undefined;
				};
			}
		}else{
			selectedProceess();
			x = 0;
		}
		if(input.length == 0)break;
		var temp = input[x].remainder - cpuBurst;
		if(temp < 0){
			output.push(
				{
					key: input[x].key,
					runTime: input[x].remainder
				}
			);
			cpuBurst -= input[x].remainder;
			input[x].remainder = 0;
		}else{
			input[x].remainder = temp;
			output.push(
				{
					key: input[x].key,
					runTime: cpuBurst
				}
			);
			input[x].remainder = temp;
			console.log(input[x]);
			if(temp != 0)lastProcess = input[x].key;
			break;
		}
	}
	debugger;
	return {
		output,
		lastProcess
	};
}

function primitive_sjf(input, cpuBurst){
	var output = [];
	function selectedProceess(){
		input = input.filter((cur)=>{
			return cur.remainder != 0;
		}).sort((prev, cur)=>{
			return cur.remainder < prev.remainder;
		})
	};
	if(cpuBurst == 0)return output;
	while(true)
	{
		selectedProceess();
		if(input.length == 0)break;
		var temp = input[0].remainder - cpuBurst;
		if(temp < 0){
			output.push(
				{
					key: input[0].key,
					runTime: input[0].remainder
				}
			);
			cpuBurst -= input[0].remainder;
			input[0].remainder = 0;
		}else{
			input[0].remainder = temp;
			output.push(
				{
					key: input[0].key,
					runTime: cpuBurst
				}
			);
			input[0].remainder = temp;
			break;
		}
	}
	return {output};
}

function fcfs(input, cpuBurst){
	var output = [];
	if(cpuBurst == 0)return output;
	for (var i = 0; i < input.length; i++) {
		var temp = input[i].remainder - cpuBurst;
		if(temp < 0){
			output.push(
				{
					key: input[i].key,
					runTime: input[i].remainder
				}
			);
			cpuBurst -= input[i].remainder;
		}else{
			input[i].remainder = temp;
			output.push(
				{
					key: input[i].key,
					runTime: cpuBurst
				}
			);
			break;
		}
	}
	return output;
}


module.exports = {
	fcfs,
	primitive_sjf,
	non_primitive_sjf,
	primitive_prority,
	non_primitive_prority,
	roundrobin,
	resetQuantum
}
