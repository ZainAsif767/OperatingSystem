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
    let blockedProcess = null; // Initialize blockedProcess to null

    // Sort processes by arrival time before starting the simulation
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

    
  while (queue.length > 0 || blockedProcess) {
    if (queue.length === 0 && blockedProcess) {
      // Execute the blocked process when no other processes are left
      const timeSlice = Math.min(blockedProcess.remainingTime, blockedProcess.quantumSize);
      console.log(`\nExecuting Blocked ${blockedProcess.processId} for ${timeSlice} units of time.`);

      for (let i = 0; i < timeSlice; i++) {
        if (blockedProcess.programCounter < blockedProcess.instructions.length) {
          const currentInstructionIndex = blockedProcess.programCounter;
          const currentInstruction = blockedProcess.instructions[currentInstructionIndex];

          const nextInstructionIndex = blockedProcess.programCounter + 1;
          const nextInstruction = nextInstructionIndex < blockedProcess.instructions.length
              ? blockedProcess.instructions[nextInstructionIndex]
              : 'No more instructions';

          console.log(`  Current Executing Instruction: ${currentInstruction}`);
          console.log(`  Next Instruction: ${nextInstruction}`);

          blockedProcess.programCounter++;
          currentTime++;
        }
      }

      blockedProcess.remainingTime -= timeSlice;
      blockedProcess.utilizationTime += timeSlice;

      console.log(`  \n  `);

      console.log(`  Number of Instructions: ${blockedProcess.noOfInstructions}`);
      console.log(`  Process State: ${blockedProcess.state}`);
      console.log(`  Arrival Time: ${blockedProcess.arrivalTime}`);
      console.log(`  Total Execution Time: ${blockedProcess.executionTime}`);
      console.log(`  Remaining Time: ${blockedProcess.remainingTime}`);
      console.log(`  Quantum Size: ${blockedProcess.quantumSize}`);
      console.log(`  Turnaround Time: ${blockedProcess.turnAroundTime}`);
      console.log(`  Utilization Time: ${blockedProcess.utilizationTime}`);
      console.log(`  Current Time: ${currentTime} units.`);
      console.log(`  \n  `);

      if (blockedProcess.remainingTime <= 0) {
        blockedProcess.finishTime = currentTime;
        blockedProcess.turnAroundTime = blockedProcess.finishTime - blockedProcess.arrivalTime;
        console.log(`Finish Time: ${blockedProcess.finishTime}`);
        console.log(`${blockedProcess.processId} has completed execution.`);
        blockedProcess = null; // Unblock the process
      }
    } else if (!blockedProcess && Math.random() > 0.5) {
      blockedProcess = queue.shift(); // Block the process
      blockedProcess.state = 'Blocked';
      console.log(`Process ${blockedProcess.processId} has been blocked.`);
    } else {
      const process = queue.shift();
      // Execute the process (same logic as before)
    }
  }

  console.log('All processes have completed execution.');
}

//     while (queue.length > 0 || blockedProcess) {
//         if (!blockedProcess && queue.length > 0) {
//             const process = queue.shift();
//             const timeSlice = Math.min(process.remainingTime, process.quantumSize);

//             console.log(`\nExecuting ${process.processId} for ${timeSlice} units of time.`);

//             for (let i = 0; i < timeSlice; i++) {
//                 if (process.programCounter < process.instructions.length) {
//                     const currentInstructionIndex = process.programCounter;
//                     const currentInstruction = process.instructions[currentInstructionIndex];

//                     const nextInstructionIndex = process.programCounter + 1;
//                     const nextInstruction = nextInstructionIndex < process.instructions.length
//                         ? process.instructions[nextInstructionIndex]
//                         : 'No more instructions';

//                     console.log(` Current Executing Instruction: ${currentInstruction}`);
//                     console.log(`  Next Instruction: ${nextInstruction}`);

//                     process.programCounter++;
//                     currentTime++;
//                 }
//             }

//             process.remainingTime -= timeSlice;
//             process.utilizationTime += timeSlice;

//             console.log(`  \n  `);

//             console.log(`  Number of Instructions: ${process.noOfInstructions}`);
//             console.log(`  Process State: ${process.state}`);
//             console.log(`  Arrival Time: ${process.arrivalTime}`);
//             console.log(`  Total Execution Time: ${process.executionTime}`);
//             console.log(`  Remaining Time: ${process.remainingTime}`);
//             console.log(`  Quantum Size: ${process.quantumSize}`);
//             console.log(`  Turnaround Time: ${process.turnAroundTime}`);
//             console.log(`  Utilization Time: ${process.utilizationTime}`);
//             console.log(`  Current Time: ${currentTime} units.`);
//             console.log(`  \n  `);

//             if (process.remainingTime <= 0) {
//                 process.finishTime = currentTime;
//                 process.turnAroundTime = process.finishTime - process.arrivalTime;
//                 console.log(`Finish Time: ${process.finishTime}`);
//                 console.log(`${process.processId} has completed execution.`);
//             } else {
//                 if (!blockedProcess && Math.random() > 0.2) {
//                     blockedProcess = process; // Block the process
//                     blockedProcess.state = 'Blocked';
//                     console.log(`Process ${blockedProcess.processId} has been blocked.`);
//                 } else {
//                     queue.push(process); // Place the process back in the queue
//                 }
//             }
//         } else if (blockedProcess) {
//             console.log(`\nExecuting blocked process ${blockedProcess.processId} after other processes have finished.`);
            
//             const timeSlice = Math.min(blockedProcess.remainingTime, blockedProcess.quantumSize);
            
//             for (let i = 0; i < timeSlice; i++) {
//                 if (blockedProcess.programCounter < blockedProcess.instructions.length) {
//                     const currentInstructionIndex = blockedProcess.programCounter;
//                     const currentInstruction = blockedProcess.instructions[currentInstructionIndex];

//                     const nextInstructionIndex = blockedProcess.programCounter + 1;
//                     const nextInstruction = nextInstructionIndex < blockedProcess.instructions.length
//                         ? blockedProcess.instructions[nextInstructionIndex]
//                         : 'No more instructions';

//                     console.log(` Current Executing Instruction: ${currentInstruction}`);
//                     console.log(`  Next Instruction: ${nextInstruction}`);

//                     blockedProcess.programCounter++;
//                     currentTime++;
//                 }
//             }

//             blockedProcess.remainingTime -= timeSlice;
//             blockedProcess.utilizationTime += timeSlice;

//             console.log(`  \n  `);

//             console.log(`  Number of Instructions: ${blockedProcess.noOfInstructions}`);
//             console.log(`  Process State: ${blockedProcess.state}`);
//             console.log(`  Arrival Time: ${blockedProcess.arrivalTime}`);
//             console.log(`  Total Execution Time: ${blockedProcess.executionTime}`);
//             console.log(`  Remaining Time: ${blockedProcess.remainingTime}`);
//             console.log(`  Quantum Size: ${blockedProcess.quantumSize}`);
//             console.log(`  Turnaround Time: ${blockedProcess.turnAroundTime}`);
//             console.log(`  Utilization Time: ${blockedProcess.utilizationTime}`);
//             console.log(`  Current Time: ${currentTime} units.`);
//             console.log(`  \n  `);

//             if (blockedProcess.remainingTime <= 0) {
//                 blockedProcess.finishTime = currentTime;
//                 blockedProcess.turnAroundTime = blockedProcess.finishTime - blockedProcess.arrivalTime;
//                 console.log(`Finish Time: ${blockedProcess.finishTime}`);
//                 console.log(`${blockedProcess.processId} has completed execution after being unblocked.`);
//                 blockedProcess = null; // Unblock the process
//             }
//         }
//     }

//     console.log('All processes have completed execution.');
// }


// function startScheduling(processes) {
//     const queue = [...processes];
//     let currentTime = 0;
//     let blockedProcess = null; // Keep track of the blocked process

//     queue.sort((a, b) => {
//         if (a.arrivalTime === b.arrivalTime) {
//             // If arrival times are equal, sort by process ID
//             return a.processId.localeCompare(b.processId);
//         }
//         return a.arrivalTime - b.arrivalTime;
//     });

//     // Find the process with the least arrival time
//     const firstProcess = queue.find(process => process.arrivalTime === queue[0].arrivalTime);
//     if (firstProcess) {
//         firstProcess.resumeInstructionAddress = 0;
//     }

//     while (queue.length > 0 || blockedProcess) {
//         if (!blockedProcess && queue.length > 0) {
//         const process = queue.shift();
//         const timeSlice = Math.min(process.remainingTime, process.quantumSize);
//         }

//         // console.log("Math.random = " ,Math.random());
//         // console.log("queue.length = " ,queue.length);
//         // console.log("blockedProcess = " ,blockedProcess);
//         // console.log("process.state = " ,process.state);
//         //                     // Randomly block one process

//         // const cond = (Math.random() > 0.001 && process.state !== 'Blocked' && queue.length > 1 && blockedProcess === null)
//         // console.log("condition = " , cond);
//         // if (Math.random() < 0.05 && process.state !== 'Blocked' && queue.length > 1 && blockedProcess === null) {
//         //     console.log(`${process.processId} is blocked.`);
//         //     process.state = 'Blocked';
//         //     blockedProcess = process; // Set the blocked process
//         //     continue; // Skip the rest of the loop and proceed to the next iteration
//         // }
//             // if (Math.random() < 0.05 && process.state !== 'Blocked' && queue.length > 1) {
//             //     console.log(`${process.processId} is blocked.`);
//             //     process.state = 'Blocked';
//             //     queue.push(process);
//             //     break;
//             // }

                  
//         const cond = (Math.random() > 0.01 && process.state !== 'Blocked' && queue.length > 1)
//         console.log("condition = " , cond);
//     // Check the condition for blocking and update the process state accordingly
//     if (Math.random() > 0.01 && process.state !== 'Blocked' && queue.length > 1) {
//         console.log(`Process ${process.processId} is now blocked.`);
//         process.state = 'Blocked';
//         blockedProcess = process;
//         continue;
//     }

//         console.log(`\nExecuting ${process.processId} for ${timeSlice} units of time.`);

//         for (let i = 0; i < timeSlice; i++) {
//             if (process.programCounter < process.instructions.length) {
//                 const currentInstructionIndex = process.programCounter;
//                 const currentInstruction = process.instructions[currentInstructionIndex];

//                 const nextInstructionIndex = process.programCounter + 1;
//                 const nextInstruction = nextInstructionIndex < process.instructions.length
//                     ? process.instructions[nextInstructionIndex]
//                     : 'No more instructions';

//                 console.log(`Current Executing Instruction: ${currentInstruction}`);
//                 console.log(`Next Instruction: ${nextInstruction}`);
              
//                 process.programCounter++;
//                 currentTime++;
//             }

          
//         }
      
        
 

//         process.remainingTime -= timeSlice;
//         process.utilizationTime += timeSlice;

//         // Output the process information after each time slice
//         console.log(`  \n  `);

//         console.log(`Number of Instructions: ${process.noOfInstructions}`);
//         console.log(`Process State: ${process.state}`);
//         console.log(`Arrival Time: ${process.arrivalTime}`);
//         console.log(`Total Execution Time: ${process.executionTime}`);
//         console.log(`Remaining Time: ${process.remainingTime}`);
//         console.log(`Quantum Size: ${process.quantumSize}`);
//         console.log(`Turnaround Time: ${process.turnAroundTime}`);
//         console.log(`Utilization Time: ${process.utilizationTime}`);
//         console.log(`Current Time: ${currentTime} units.`);
//         console.log(`  \n  `);

//         if (process.remainingTime <= 0) {
//             // Calculate Turnaround Time when process is completed
//             process.finishTime = currentTime;
//             process.turnAroundTime = process.finishTime - process.arrivalTime;
//             console.log(`Finish Time: ${process.finishTime}`);
//             console.log(`${process.processId} has completed execution.`);
//             process.state = 'Terminated'; // Set process state to "Terminated"
//         } else {
//             // Place the process back in the queue
//             queue.push(process);
//         }
//     }

//     console.log('All processes have completed execution.');
// }

createProcesses();
