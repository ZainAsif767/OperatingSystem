# Round Robin Scheduling Simulation

This repository contains a simple simulation of the Round Robin scheduling algorithm for a set of processes.

https://github.com/umershaikh123/OperatingSystem/assets/42178214/2fc26511-328f-4322-bf98-84970fb75714

## How It Works

1. **Creating Processes**: Run the program and input the number of processes you want to create (between 3 and 5). For each process, provide its arrival time and execution time.

2. **Sorting Processes**: The processes are sorted based on their arrival times. The process with the earliest arrival time is set to start execution first.

3. **Executing Processes**: The simulation begins by running the first process that arrived. It's given a certain amount of time to execute, known as a time slice (quantum size). The process runs until it uses up its time slice or completes its execution.

4. **Resume Instruction Address**: Each process keeps track of its execution progress using the "Resume Instruction Address." This helps processes pick up where they left off when they get another chance to run.

5. **Time Tracking**: The simulation updates the current time as processes are scheduled and executed. Remaining execution time for each process is adjusted based on the time slice allocated.

6. **Completion and Turnaround Time**: When a process completes its execution, its finish time is recorded. Turnaround time is calculated as the total time from arrival to completion.

7. **Queue Management**: Processes that don't complete within their time slice are placed back in the queue to run later. This continues until all processes complete their execution.

8. **Output**: The program provides detailed information about each process's execution, including arrival time, execution time, remaining time, utilization time, and more. It also shows which processes have completed their execution and overall completion.

## Getting Started

1. Clone the repository: `https://github.com/umershaikh123/OperatingSystem.git`
2. Navigate to the project directory: `cd OperatingSystem`
3. Run the simulation: `node .\Final.js`

## Contributions

Contributions to this simulation are welcome! Feel free to fork this repository, make improvements, and submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
