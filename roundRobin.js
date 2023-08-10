 
// Define a class to represent a Process Control Block (PCB)
class PCB {
    constructor(processId, arrivalTime, executionTime) {
      this.processId = processId;
      this.arrivalTime = arrivalTime;
      this.executionTime = executionTime;
      this.quantumSize = 3; // Set quantum size
      this.remainingTime = executionTime;
      this.resumeInstructionAddress = 0; // Initialize to start
      this.noOfInstructions = executionTime; // Assume each instruction takes half of execution time
      this.turnAroundTime = 0;
      this.utilizationTime = 0;
      this.psw = 0; // Program Status Word
      this.schedulingAlgo = 'Round Robin';
      this.finishTime = 0;
    }
  }
  
  // Function to create processes based on user input
  function createProcesses() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
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
  
            const process = new PCB(`P${processCount}`, arrivalTime, executionTime);
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
      }
  
      createProcess();
    });
  }
  
 
  // Function to simulate Round Robin scheduling
  function startScheduling(processes) {
    const queue = [...processes];
    let currentTime = 0;
  
    // Sort processes by arrival time before starting the simulation
    // queue.sort((a, b) => a.arrivalTime - b.arrivalTime);
    queue.sort((a, b) => {
        if (a.arrivalTime === b.arrivalTime) {
          // If arrival times are equal, sort by process ID
          return a.processId.localeCompare(b.processId);
        }
        return a.arrivalTime - b.arrivalTime;
      });
    
      // Find the process with the least arrival time
      const firstProcess = queue.find(process => process.arrivalTime === queue[0].arrivalTime);
      if (firstProcess) {
        firstProcess.resumeInstructionAddress = 0;
      }
    while (queue.length > 0) {
      const process = queue.shift();
      const timeSlice = Math.min(process.remainingTime, process.quantumSize);
  
      // Initialize the resumeInstructionAddress for the first process
      currentTime += timeSlice;
      process.utilizationTime += timeSlice;
      process.remainingTime -= timeSlice;
      process.resumeInstructionAddress += process.noOfInstructions;
    //   const previousProcess = queue[queue.length - 1]; // Get the previous process in the queue
    //   process.resumeInstructionAddress = previousProcess ? previousProcess.resumeInstructionAddress + previousProcess.noOfInstructions : 0;
  

            // Rest of the code remains the same
            console.log(`  \n  `);
            console.log(`Executing ${process.processId} for ${timeSlice} units of time.`);      
            console.log(`  Process ID: ${process.processId}`);
            console.log(`  Number of Instructions: ${process.noOfInstructions}`);
            console.log(`  Arrival Time: ${process.arrivalTime}`);
            console.log(`  Total Execution Time: ${process.executionTime}`);
            console.log(`  Remaining Time: ${process.remainingTime}`);
            console.log(`  Quantum Size: ${process.quantumSize}`);
            console.log(`  Turnaround Time: ${process.turnAroundTime}`);
            console.log(`  Utilization Time: ${process.utilizationTime}`);
          //   console.log(`  PSW: ${process.psw}`);
            console.log(`  Current Time: ${currentTime} units.`);
         
            console.log(`  Resume Instruction Address: ${process.resumeInstructionAddress}`);
            console.log(`  \n  `);


            if (process.remainingTime <= 0) {
                // Calculate Turnaround Time when process is completed
                process.finishTime = currentTime;
                process.turnAroundTime = process.finishTime - process.arrivalTime;
                console.log(`Finish Time: ${process.finishTime}`);
                console.log(`${process.processId} has completed execution.`);
                
              } else {
                // Place the process back in the queue
                queue.push(process);
              }

    //   if (process.remainingTime > 0) {
    //     queue.push(process);
    //   } else {
    //     process.finishTime = currentTime + timeSlice;
    //     process.turnAroundTime = process.finishTime - process.arrivalTime;
    //     console.log(`${process.processId} has completed execution.`);
    //   }
  
    //   currentTime += timeSlice;
    }
  
    console.log('All processes have completed execution.');
  }
  // Start the simulation by creating processes
  createProcesses();

  
 