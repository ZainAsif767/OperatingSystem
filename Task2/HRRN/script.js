function getInput() {
  const numProcesses = parseInt(document.getElementById("numProcesses").value)

  const processTable = document.getElementById("processTable")
  processTable.innerHTML = "" // Clear previous content

  processTable.classList.remove("table-fade-in") // Remove previous animation class
  void processTable.offsetWidth // Trigger reflow to reset animation
  processTable.classList.add("table-fade-in") // Add animation class

  let tableContent =
    "<tr><th>Process</th><th>Arrival Time</th><th>Execution Time</th></tr>"

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

// Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
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

function calculateHRRN() {
  const numProcesses = parseInt(document.getElementById("numProcesses").value)
  const processes = []

  for (let i = 1; i <= numProcesses; i++) {
    const arrivalTime = parseInt(
      document.getElementById(`arrivalTime${i}`).value
    )
    const burstTime = parseInt(
      document.getElementById(`executionTime${i}`).value
    )
    processes.push({
      name: `P${i}`,
      arrivalTime,
      burstTime,
      startTime: 0,
      finishTime: 0,
      waitingTime: 0,
      turnaroundTime: 0,
      utilizationTime: 0,
      responseRatio: 0,
    })
  }

  // Sort processes by arrival time

  processes.sort((a, b) => a.arrivalTime - b.arrivalTime)
  let currentTime = 0

  for (let i = 0; i < numProcesses; i++) {
    if (currentTime < processes[i].arrivalTime) {
      currentTime = processes[i].arrivalTime
    }

    processes[i].waitingTime = currentTime - processes[i].arrivalTime
    processes[i].responseRatio =
      (processes[i].waitingTime + processes[i].burstTime) /
      processes[i].burstTime

    currentTime += processes[i].burstTime

    processes[i].turnaroundTime =
      processes[i].waitingTime + processes[i].burstTime
    processes[i].utilizationTime =
      (processes[i].burstTime / processes[i].turnaroundTime) * 100

    processes[i].startTime = currentTime - processes[i].burstTime
    processes[i].finishTime = currentTime
    console.log("process ", i, "response Ratio = ", processes[i].responseRatio)
  }

  // Calculate average metrics
  const avgTurnaroundTime =
    processes.reduce((sum, process) => sum + process.turnaroundTime, 0) /
    numProcesses
  const avgWaitingTime =
    processes.reduce((sum, process) => sum + process.waitingTime, 0) /
    numProcesses
  const avgUtilizationTime =
    processes.reduce((sum, process) => sum + process.utilizationTime, 0) /
    numProcesses

  // Display HRRN results in a table
  const hrrnTable = document.getElementById("hrrnTable")
  hrrnTable.innerHTML = `<tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th>
    <th>Start Time</th>
    <th>Finish Time</th>
    <th>Waiting Time</th>
    <th>Turnaround Time</th>
    <th>Utilization Time (%)</th>
      </tr>`

  hrrnTable.classList.remove("table-fade-in")
  void hrrnTable.offsetWidth // Trigger reflow to reset animation
  hrrnTable.classList.add("table-fade-in")

  for (let i = 0; i < numProcesses; i++) {
    hrrnTable.innerHTML += `<tr>
                                <td>${processes[i].name}</td>
                                <td>${processes[i].arrivalTime}</td>
                                <td>${processes[i].burstTime}</td>
                                <td>${processes[i].startTime}</td>
                                <td>${processes[i].finishTime}</td>
                                <td>${processes[i].waitingTime}</td>
                                <td>${processes[i].turnaroundTime}</td>
                                <td>${processes[i].utilizationTime.toFixed(
      2
    )}</td>
                              </tr>`
  }

  // Display average metrics
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
                                <td>Average Utilization</td>
                                <td>${avgUtilizationTime.toFixed(2)}%</td>
                              </tr>
                            </table>
                          `

  metricsDiv.classList.remove("table-fade-in")
  void metricsDiv.offsetWidth // Trigger reflow to reset animation
  metricsDiv.classList.add("table-fade-in")
  const width = 1200
  const height = Math.max(100, (numProcesses + 1) * 40)

  d3.select("#visualization svg").remove()

  const svg = d3
    .select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  const xScale = d3.scaleLinear().domain([0, currentTime]).range([0, width])

  const visualizationData = []

  for (let i = 0; i < numProcesses; i++) {
    const randomColor = getRandomColor()

    visualizationData.push({
      process: processes[i].name,
      startTime: processes[i].startTime,
      finishTime: processes[i].finishTime,
      color: randomColor,
    })
  }

  // Draw rectangles for each process
  const rectHeight = 30
  const rectPadding = 10

  svg
    .selectAll("rect")
    .data(visualizationData)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.startTime))
    .attr("y", (d, i) => i * (rectHeight + rectPadding))
    .attr("width", d => xScale(d.finishTime) - xScale(d.startTime))
    .attr("height", rectHeight)
    .attr("fill", d => d.color)

  // Update the label positioning
  svg
    .selectAll("text")
    .data(visualizationData)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.startTime) + 5)
    .attr("y", (d, i) => i * (rectHeight + rectPadding) + rectHeight / 2)
    .text(d => d.process)
    .attr("alignment-baseline", "middle")

  // Create x-axis
  const xAxis = d3.axisBottom(xScale)

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - 20})`)
    .call(xAxis)
}
