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
        this.instructionRegister = ''; // Instruction Register to store the current instruction
        this.programCounter = 0; // Initialize program counter to 0
        this.instructions = Array.from({ length: executionTime }, (_, i) => `${processId}${String.fromCharCode(65 + i)}`); // Create an array of instruction names
        this.state = 'Ready';
        this.isBlocked = false; // New property to track blocked state
      }
  }
  
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
  
  function startScheduling(processes) {
    const queue = [...processes];
    let currentTime = 0;
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
  
    let blockedProcess = null; // To store the blocked process temporarily
  
    while (queue.length > 0) {
      const process = queue.shift();
      const timeSlice = Math.min(process.remainingTime, process.quantumSize);
  
      console.log(`\nExecuting ${process.processId} for ${timeSlice} units of time.`);
  
      // Randomly block a process
      if (Math.random() > 0.1 && !blockedProcess) { // Adjust the probability as needed
        const randomIndex = Math.floor(Math.random() * queue.length);
        blockedProcess = queue.splice(randomIndex, 1)[0];
        blockedProcess.isBlocked = true;
        console.log(`Process ${blockedProcess.processId} has been blocked.`);
      }
  
      if (process.isBlocked) {
        console.log(`Process ${process.processId} is currently blocked.`);
      } else {
        for (let i = 0; i < timeSlice; i++) {
          if (process.programCounter < process.instructions.length) {
            const currentInstructionIndex = process.programCounter;
            const currentInstruction = process.instructions[currentInstructionIndex];
  
            const nextInstructionIndex = process.programCounter + 1;
            const nextInstruction = nextInstructionIndex < process.instructions.length
                ? process.instructions[nextInstructionIndex]
                : 'No more instructions';
  
            console.log(` Current Executing Instruction: ${currentInstruction}`);
            console.log(`  Next Instruction: ${nextInstruction}`);
  
            process.programCounter++;
            currentTime++;
          }
        }
  
        process.remainingTime -= timeSlice;
        process.utilizationTime += timeSlice;
  
        // Output the process information after each time slice
        
        // ... (existing code to display process information)
                  // Output the process information after each time slice
                  console.log(`  \n  `);
                  //   console.log(`  Resume Intruction: ${process.instructionRegister}`);
                  // console.log(`  Instruction Register: ${process.instructionRegister}`);
                    console.log(`  Number of Instructions: ${process.noOfInstructions}`);
                    console.log(`  Process State: ${process.state}`);
                    console.log(`  Arrival Time: ${process.arrivalTime}`);
                    console.log(`  Total Execution Time: ${process.executionTime}`);
                    console.log(`  Remaining Time: ${process.remainingTime}`);
                    console.log(`  Quantum Size: ${process.quantumSize}`);
                    console.log(`  Turnaround Time: ${process.turnAroundTime}`);
                    console.log(`  Utilization Time: ${process.utilizationTime}`);
                    console.log(`  Current Time: ${currentTime} units.`);
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
      }
      
      // If the blocked process is being processed, unblock it
      if (blockedProcess === process) {
        blockedProcess.isBlocked = false;
        blockedProcess = null;
      }
      
      // ... (existing code)
    }
  
    console.log('All processes have completed execution.');
  }




//   function startScheduling(processes) {
//     const queue = [...processes];
//     let currentTime = 0;
//     queue.sort((a, b) => {
//         if (a.arrivalTime === b.arrivalTime) {
//           // If arrival times are equal, sort by process ID
//           return a.processId.localeCompare(b.processId);
//         }
//         return a.arrivalTime - b.arrivalTime;
//       });
    
//       // Find the process with the least arrival time
//       const firstProcess = queue.find(process => process.arrivalTime === queue[0].arrivalTime);
//       if (firstProcess) {
//         firstProcess.resumeInstructionAddress = 0;
//       }
//     // ... (same as before)
  
//     while (queue.length > 0) {
//       const process = queue.shift();
//       const timeSlice = Math.min(process.remainingTime, process.quantumSize);
  
//       console.log(`\nExecuting ${process.processId} for ${timeSlice} units of time.`);

//       if (Math.random() > 0.1 && !blockedProcess) { // Adjust the probability as needed
//         const randomIndex = Math.floor(Math.random() * queue.length);
//         blockedProcess = queue.splice(randomIndex, 1)[0];
//         blockedProcess.isBlocked = true;
//         console.log(`Process ${blockedProcess.processId} has been blocked.`);
//       }

//       if (process.isBlocked) {
//         console.log(`Process ${process.processId} is currently blocked.`);
//       } 

//       else {

//      // Inside the loop in startScheduling function
//      for (let i = 0; i < timeSlice; i++) {
//         if (process.programCounter < process.instructions.length) {
//             const currentInstructionIndex = process.programCounter;
//             const currentInstruction = process.instructions[currentInstructionIndex];
            
//             const nextInstructionIndex = process.programCounter + 1;
//             const nextInstruction = nextInstructionIndex < process.instructions.length
//                 ? process.instructions[nextInstructionIndex]
//                 : 'No more instructions';
            
//             console.log(` Current Executing Instruction: ${currentInstruction}`);
//             console.log(`  Next Instruction: ${nextInstruction}`);
            
//             process.programCounter++;
//             currentTime++;
//         }
//     }
    
      
//           process.remainingTime -= timeSlice;
//           process.utilizationTime += timeSlice;
      
//           // Output the process information after each time slice
//           console.log(`  \n  `);
//         //   console.log(`  Resume Intruction: ${process.instructionRegister}`);
//         // console.log(`  Instruction Register: ${process.instructionRegister}`);
//           console.log(`  Number of Instructions: ${process.noOfInstructions}`);
//           console.log(`  Process State: ${process.state}`);
//           console.log(`  Arrival Time: ${process.arrivalTime}`);
//           console.log(`  Total Execution Time: ${process.executionTime}`);
//           console.log(`  Remaining Time: ${process.remainingTime}`);
//           console.log(`  Quantum Size: ${process.quantumSize}`);
//           console.log(`  Turnaround Time: ${process.turnAroundTime}`);
//           console.log(`  Utilization Time: ${process.utilizationTime}`);
//           console.log(`  Current Time: ${currentTime} units.`);
//           console.log(`  \n  `);
      
//           if (process.remainingTime <= 0) {
//             // Calculate Turnaround Time when process is completed
//             process.finishTime = currentTime;
//             process.turnAroundTime = process.finishTime - process.arrivalTime;
//             console.log(`Finish Time: ${process.finishTime}`);
//             console.log(`${process.processId} has completed execution.`);
//           } else {
//             // Place the process back in the queue
//             queue.push(process);
//           }
//         }
//         console.log('All processes have completed execution.');

//       }

  
//   }
  
  createProcesses();
  