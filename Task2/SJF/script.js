function getInput() {
  const numProcesses = parseInt(document.getElementById("numProcesses").value)

  const processTable = document.getElementById("processTable")
  processTable.innerHTML = "" // Clear previous content

  processTable.classList.remove("table-fade-in") // Remove previous animation class
  void processTable.offsetWidth // Trigger reflow to reset animation
  processTable.classList.add("table-fade-in") // Add animation class

  let tableContent =
    "<tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th></tr>"

  for (let i = 1; i <= numProcesses; i++) {
    tableContent += `<tr>
                        <td>Process ${i}</td>
                        <td><input type="number" id="arrivalTime${i}" min="0" step="1" class="input" ></td>
                        <td><input type="number" id="executionTime${i}" min="1" step="1" class="input" ></td>
                      </tr>`
  }

  processTable.innerHTML = tableContent
  document.getElementById("processesInput").style.display = "block"
  return false
}

function generateRandomValues() {
  const numProcesses = parseInt(document.getElementById("numProcesses").value)
  const processTable = document.getElementById("processTable")

  // Generate random arrival and execution times for each process
  for (let i = 1; i <= numProcesses; i++) {
    const arrivalTimeInput = document.getElementById(`arrivalTime${i}`)
    const executionTimeInput = document.getElementById(`executionTime${i}`)

    // Generate random values between 1 and 20 for arrival and execution times
    const randomArrivalTime = Math.floor(Math.random() * 10) + 1
    const randomExecutionTime = Math.floor(Math.random() * 10) + 1

    // Set the random values in the input fields
    arrivalTimeInput.value = randomArrivalTime
    executionTimeInput.value = randomExecutionTime
  }
}

// Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function calculateSJF() {
  const numProcesses = parseInt(document.getElementById("numProcesses").value)
  const processes = []

  for (let i = 1; i <= numProcesses; i++) {
    const arrivalTime = parseInt(
      document.getElementById(`arrivalTime${i}`).value
    )
    const executionTime = parseInt(
      document.getElementById(`executionTime${i}`).value
    )

    processes.push({ process: i, arrivalTime, executionTime })
  }

  // Sort processes based on arrival time and then by execution time (burst time)
  processes.sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime
    }
    return a.executionTime - b.executionTime
  })

  // Calculate waiting time, turnaround time, start time, finish time, and utilization time
  let startTime = 0
  let totalTime = 0

  const sjfTable = document.getElementById("sjfTable")
  sjfTable.innerHTML =
    "<tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Start Time</th><th>Finish Time</th><th>Waiting Time</th><th>Turnaround Time</th><th>Utilization Time</th></tr>"

  sjfTable.classList.remove("table-fade-in")
  void sjfTable.offsetWidth // Trigger reflow to reset animation
  sjfTable.classList.add("table-fade-in")

  // Data for visualization
  const visualizationData = []

  for (let i = 0; i < numProcesses; i++) {
    if (i > 0) {
      startTime = Math.max(
        processes[i].arrivalTime,
        processes[i - 1].finishTime
      )
    } else {
      startTime = processes[i].arrivalTime
    }

    const finishTime = startTime + processes[i].executionTime
    const waitingTime = startTime - processes[i].arrivalTime
    const turnaroundTime = finishTime - processes[i].arrivalTime
    const utilizationTime = processes[i].executionTime / turnaroundTime
    processes[i].startTime = startTime
    processes[i].finishTime = finishTime
    processes[i].turnaroundTime = turnaroundTime
    processes[i].waitingTime = waitingTime
    processes[i].utilizationTime = utilizationTime
    sjfTable.innerHTML += `<tr>
    <td>Process ${processes[i].process}</td>
    <td>${processes[i].arrivalTime}</td>
    <td>${processes[i].executionTime}</td>
    <td>${processes[i].startTime}</td>
    <td>${processes[i].finishTime}</td>
    <td>${processes[i].waitingTime}</td>
    <td>${processes[i].turnaroundTime}</td>
    <td>${(processes[i].utilizationTime * 100).toFixed(2)}%</td>
  </tr>`

    let totalTurnaroundTime = 0
    let totalWaitingTime = 0
    let totalUtilization = 0

    for (let i = 0; i < numProcesses; i++) {
      // Existing code ...

      totalTurnaroundTime += processes[i].turnaroundTime
      totalWaitingTime += processes[i].waitingTime
      totalUtilization += processes[i].utilizationTime
    }

    const avgTurnaroundTime = totalTurnaroundTime / numProcesses
    const avgWaitingTime = totalWaitingTime / numProcesses
    const cpuUtilization = (totalUtilization / numProcesses) * 100

    const metricsDiv = document.getElementById("metrics")
    metricsDiv.innerHTML = `
    <h2>Metrics:</h2>
    <table>
      <tr>
        <th>Metric</th>
        <th>Average Value</th>
      </tr>
      <tr>
        <td>Average Turnaround Time</td>
        <td>${avgTurnaroundTime.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Average Waiting Time</td>
        <td>${avgWaitingTime.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Utilization</td>
        <td>${cpuUtilization.toFixed(2)}%</td>
      </tr>
    </table>
  `

    metricsDiv.classList.remove("table-fade-in")
    void metricsDiv.offsetWidth // Trigger reflow to reset animation
    metricsDiv.classList.add("table-fade-in")

    // Generate a random color for each process
    processes[i].color = getRandomColor()

    visualizationData.push({
      process: processes[i].process,
      startTime: processes[i].startTime,
      finishTime: processes[i].finishTime,
      color: processes[i].color,
    })

    totalTime += turnaroundTime
  }

  // Visualization dimensions

  // const width = 1200
  const height = 100

  let width
  if (numProcesses <= 10) {
    width = 1200
  } else if (numProcesses >= 10 && numProcesses < 20) {
    width = 1600
  } else if (numProcesses >= 20 && numProcesses < 30) {
    width = 2400
  } else if (numProcesses >= 30 && numProcesses < 40) {
    width = 3600
  } else if (numProcesses >= 40 && numProcesses < 50) {
    width = 4800
  } else if (numProcesses >= 50 && numProcesses < 60) {
    width = 6000
  } else {
    // For processes between 10 and 20, you can set a width of your choice
    // Adjust this as needed
    width = 7000
  }

  d3.select("#visualization svg").remove()

  // Create an SVG element
  const svg = d3
    .select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  const maxFinishTime = d3.max(visualizationData, d => d.finishTime)
  // const uniqueTimeValues = Array.from(
  //   new Set(
  //     visualizationData
  //       .map(d => d.startTime)
  //       .concat(visualizationData.map(d => d.finishTime))
  //   )
  // )
  // Create x-scale based on total time
  // const xScale = d3.scaleLinear().domain([0, totalTime]).range([0, width])
  const xScale = d3.scaleLinear().domain([0, maxFinishTime]).range([0, width])
  // const xScale = d3.scaleLinear().domain(0, maxFinishTime).range([0, width])

  // Draw rectangles for each process
  svg
    .selectAll("rect")
    .data(visualizationData)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.startTime))
    .attr("y", 20)
    .attr("width", d => xScale(d.finishTime) - xScale(d.startTime))
    .attr("height", 30)
    .attr("fill", d => d.color)

  // Add labels for each process
  svg
    .selectAll("text")
    .data(visualizationData)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.startTime) + 5)
    .attr("y", 40)
    .text(d => `P${d.process}`)
    .attr("font-size", "14px")
    .attr("fill", "black")

  // Create x-axis
  const xAxis = d3.axisBottom(xScale)
  svg.append("g").attr("transform", `translate(0, 60)`).call(xAxis)
}
