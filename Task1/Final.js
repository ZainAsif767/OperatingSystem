class PCB {
  constructor(processId, arrivalTime, executionTime, resourceRequest) {
    this.processId = processId;
    this.arrivalTime = arrivalTime;
    this.executionTime = executionTime;
    this.resourceRequest = resourceRequest;
    this.quantumSize = 0;
    this.remainingTime = executionTime;
    this.resumeInstructionAddress = 0;
    this.noOfInstructions = executionTime;
    this.turnAroundTime = 0;
    this.utilizationTime = 0;
    this.schedulingAlgo = 'Round Robin';
    this.finishTime = 0;
    this.state = 'Ready';
    this.resourcesAllocated = false;
    this.instructions = [];
    for (let i = 0; i < this.noOfInstructions; i++) {
      this.instructions.push(`${this.processId}${String.fromCharCode(65 + i)}`);
    }
    this.programCounter = 0;
  }
}



function createProcesses() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter quantum size (2-3): ', (quantumSize) => {
    quantumSize = parseInt(quantumSize);
    if (quantumSize < 2 || quantumSize > 3) {
      console.log('Quantum size must be between 2 and 3.');
      rl.close();
      return;
    }

    rl.question('How many processes do you want to create? (3-5): ', (numProcesses) => {
      numProcesses = parseInt(numProcesses);
      if (numProcesses < 3 || numProcesses > 5) {
        console.log('Number of processes must be between 3 and 5.');
        rl.close();
        return;
      }

      const processes = [];
      let processCount = 1;

      function createProcess() {
        rl.question(`Enter arrival time for Process P${processCount}: `, (arrivalTime) => {
          arrivalTime = parseInt(arrivalTime);
          rl.question(`Enter execution time for Process P${processCount} (<= 10): `, (executionTime) => {
            executionTime = parseInt(executionTime);
            if (executionTime > 10) {
              console.log('Execution time must be less than or equal to 10.');
              rl.close();
              return;
            }

            rl.question(`Enter resource request for Process P${processCount} (true/false): `, (resourceRequest) => {
              resourceRequest = resourceRequest.toLowerCase() === 'true';

              const process = new PCB(`P${processCount}`, arrivalTime, executionTime, resourceRequest);
              process.quantumSize = quantumSize;
              processes.push(process);

              processCount++;
              if (processCount <= numProcesses) {
                createProcess();
              } else {
                rl.close();
                startScheduling(processes);
              }
            });
          });
        });
      }

      createProcess();
    });
  });
}


function startScheduling(processes) {
  const queue = [...processes];
  let currentTime = 0;

  queue.sort((a, b) => {
    if (a.arrivalTime === b.arrivalTime) {
      return a.processId.localeCompare(b.processId);
    }
    return a.arrivalTime - b.arrivalTime;
  });

  const firstProcess = queue.find(process => process.arrivalTime === queue[0].arrivalTime);
  if (firstProcess) {
    firstProcess.resumeInstructionAddress = 0;
  }

  while (queue.length > 0) {
    const process = queue.shift();
    const timeSlice = Math.min(process.remainingTime, process.quantumSize);

    console.log(`\nExecuting ${process.processId} for ${timeSlice} units of time.`);

    if (process.resourceRequest && !process.resourcesAllocated) {
      console.log(`${process.processId} is in Blocked state due to resource request.`);
      process.state = 'Blocked';
    } else {
      process.state = 'Running';
      
      for (let i = 0; i < timeSlice; i++) {
        if (process.programCounter < process.instructions.length) {
          const currentInstructionIndex = process.programCounter;
          const currentInstruction = process.instructions[currentInstructionIndex];
          
          const nextInstructionIndex = process.programCounter + 1;
          const nextInstruction = nextInstructionIndex < process.instructions.length
              ? process.instructions[nextInstructionIndex]
              : 'No more instructions';
          
          console.log(` IR current Instruction: ${currentInstruction}`);
          console.log(` PC Next Instruction: ${nextInstruction}`);
          
          process.programCounter++;
          currentTime++;
        }
      }

      process.remainingTime -= timeSlice;
      process.utilizationTime += timeSlice;


      console.log(`  \n  `);
 
        console.log(`  Number of Instructions: ${process.noOfInstructions}`);
        console.log(`  Process State: ${process.state}`);
        console.log(`  Arrival Time: ${process.arrivalTime}`);
        console.log(`  Total Execution Time: ${process.executionTime}`);
        console.log(`  Remaining Time: ${process.remainingTime}`);
        console.log(`  Turnaround Time: ${process.turnAroundTime}`);
        console.log(`  Utilization Time: ${process.utilizationTime}`);
        console.log(`  Current Time: ${currentTime} units.`);
        console.log(`  \n  `);



      if (process.remainingTime <= 0) {
        process.finishTime = currentTime;
        process.turnAroundTime = process.finishTime - process.arrivalTime;
        console.log(`Finish Time: ${process.finishTime}`);
        console.log(`${process.processId} has completed execution.`);
      } else {
        queue.push(process);
      }
    }
  }

  console.log('All processes have completed execution.');
}

createProcesses();
