function non_primitive_prority(input, cpuBurst, lastProcess){
	var output = [];
	function selectedProceess(){
		input = input.filter((cur)=>{
			return cur.remainder != 0;
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
			return cur.priority >= prev.priority;
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

console.log(
		non_primitive_sjf(
			[
			  {
			    'key': 1,
			    'priority':5,
			    'remainder':4
			  
			  },
			  {
			    'key': 2,
			    'priority':6,
			    'remainder':2
			  },
			  {
			    'key': 3,
			    'priority':2,
			    'remainder':1
			  }

			],
			10,
			1
		)
);

module.exports = {
	fcfs,
	primitive_sjf,
	non_primitive_sjf,
	primitive_prority,
	non_primitive_prority
}

