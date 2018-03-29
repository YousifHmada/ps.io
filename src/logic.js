function non_primitive_prority(input, cpuBurst, lastProcess){
	var output = [];
	function selectedProceess(){
		input = input.filter((cur)=>{
			return cur.reminder != 0;
		}).sort((prev, cur)=>{
			return cur.priority >= prev.priority;
		})
	};
	if(cpuBurst == 0)return output;
	while(true)
	{
		let x;
		if(lastProcess)
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
		var temp = input[x].reminder - cpuBurst;
		if(temp < 0){
			output.push(
				{
					key: input[x].key,
					runTime: input[x].reminder
				}
			);
			cpuBurst -= input[x].reminder;
			input[x].reminder = 0;
		}else{
			input[x].reminder = temp;
			output.push(
				{
					key: input[x].key,
					runTime: cpuBurst
				}
			);
			input[x].reminder = temp;
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
			return cur.reminder != 0;
		}).sort((prev, cur)=>{
			return cur.priority >= prev.priority;
		})
	};
	if(cpuBurst == 0)return output;
	while(true)
	{
		selectedProceess();
		if(input.length == 0)break;
		var temp = input[0].reminder - cpuBurst;
		if(temp < 0){
			output.push(
				{
					key: input[0].key,
					runTime: input[0].reminder
				}
			);
			cpuBurst -= input[0].reminder;
			input[0].reminder = 0;
		}else{
			input[0].reminder = temp;
			output.push(
				{
					key: input[0].key,
					runTime: cpuBurst
				}
			);
			input[0].reminder = temp;
			break;
		}
	}
	return output;
}

function non_primitive_sjf(input, cpuBurst, lastProcess){
	var output = [];
	function selectedProceess(){
		input = input.filter((cur)=>{
			return cur.reminder != 0;
		}).sort((prev, cur)=>{
			return cur.reminder < prev.reminder;
		})
	};
	if(cpuBurst == 0)return output;
	while(true)
	{
		let x;
		if(lastProcess)
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
		var temp = input[x].reminder - cpuBurst;
		if(temp < 0){
			output.push(
				{
					key: input[x].key,
					runTime: input[x].reminder
				}
			);
			cpuBurst -= input[x].reminder;
			input[x].reminder = 0;
		}else{
			input[x].reminder = temp;
			output.push(
				{
					key: input[x].key,
					runTime: cpuBurst
				}
			);
			input[x].reminder = temp;
			if(temp != 0)lastProcess = input[x].key;
			break;
		}
	}
	return {
		output,
		lastProcess
	};
}

function primitive_sjf(input, cpuBurst){
	var output = [];
	function selectedProceess(){
		input = input.filter((cur)=>{
			return cur.reminder != 0;
		}).sort((prev, cur)=>{
			return cur.reminder < prev.reminder;
		})
	};
	if(cpuBurst == 0)return output;
	while(true)
	{
		selectedProceess();
		if(input.length == 0)break;
		var temp = input[0].reminder - cpuBurst;
		if(temp < 0){
			output.push(
				{
					key: input[0].key,
					runTime: input[0].reminder
				}
			);
			cpuBurst -= input[0].reminder;
			input[0].reminder = 0;
		}else{
			input[0].reminder = temp;
			output.push(
				{
					key: input[0].key,
					runTime: cpuBurst
				}
			);
			input[0].reminder = temp;
			break;
		}
	}
	return output;
}

function fcfs(input, cpuBurst){
	var output = [];
	if(cpuBurst == 0)return output;
	for (var i = 0; i < input.length; i++) {
		var temp = input[i].reminder - cpuBurst;
		if(temp < 0){
			output.push(
				{
					key: input[i].key,
					runTime: input[i].reminder
				}
			);
			cpuBurst -= input[i].reminder;
		}else{
			input[i].reminder = temp;
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

console.log(
		non_primitive_sjf(
			[
			  {
			    'key': 1,
			    'priority':5,
			    'reminder':4
			  
			  },
			  {
			    'key': 2,
			    'priority':6,
			    'reminder':2
			  },
			  {
			    'key': 3,
			    'priority':2,
			    'reminder':1
			  }

			],
			10
		)
);

module.exports = {
	fcfs,
	primitive_sjf,
	non_primitive_sjf,
	primitive_prority,
	non_primitive_prority
}

