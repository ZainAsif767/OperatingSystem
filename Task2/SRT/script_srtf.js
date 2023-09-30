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

function calculateSRTF() {
  const processes = []
  const burstRemaining = []
  const isCompleted = []
  const numProcesses = parseInt(document.getElementById("numProcesses").value)

  for (let i = 1; i <= numProcesses; i++) {
    const arrivalTime = parseInt(
      document.getElementById(`arrivalTime${i}`).value
    )
    const burstTime = parseInt(
      document.getElementById(`executionTime${i}`).value
    )

    processes.push({
      pid: i,
      arrivalTime,
      burstTime,
      startTime: 0,
      completionTime: 0,
      turnaroundTime: 0,
      waitingTime: 0,
      responseTime: 0,
    })

    burstRemaining.push(processes[i - 1].burstTime)
    isCompleted.push(0)
  }

  let currentTime = 0
  let completed = 0
  let prev = 0
  let totalTurnaroundTime = 0
  let totalWaitingTime = 0
  let totalResponseTime = 0
  let totalIdleTime = 0

  while (completed !== numProcesses) {
    let idx = -1
    let mn = 10000000
    for (let i = 0; i < numProcesses; i++) {
      if (processes[i].arrivalTime <= currentTime && !isCompleted[i]) {
        if (burstRemaining[i] < mn) {
          mn = burstRemaining[i]
          idx = i
        }
        if (burstRemaining[i] === mn) {
          if (processes[i].arrivalTime < processes[idx].arrivalTime) {
            mn = burstRemaining[i]
            idx = i
          }
        }
      }
    }

    if (idx !== -1) {
      if (burstRemaining[idx] === processes[idx].burstTime) {
        processes[idx].startTime = currentTime
        totalIdleTime += processes[idx].startTime - prev
      }
      burstRemaining[idx] -= 1
      currentTime++
      prev = currentTime

      if (burstRemaining[idx] === 0) {
        processes[idx].completionTime = currentTime
        processes[idx].turnaroundTime =
          processes[idx].completionTime - processes[idx].arrivalTime
        processes[idx].waitingTime =
          processes[idx].turnaroundTime - processes[idx].burstTime
        processes[idx].responseTime =
          processes[idx].startTime - processes[idx].arrivalTime

        totalTurnaroundTime += processes[idx].turnaroundTime
        totalWaitingTime += processes[idx].waitingTime
        totalResponseTime += processes[idx].responseTime

        isCompleted[idx] = 1
        completed++
      }
    } else {
      currentTime++
    }
  }

  let minArrivalTime = 10000000
  let maxCompletionTime = -1

  for (let i = 0; i < numProcesses; i++) {
    minArrivalTime = Math.min(minArrivalTime, processes[i].arrivalTime)
    maxCompletionTime = Math.max(maxCompletionTime, processes[i].completionTime)
  }

  const avgTurnaroundTime = totalTurnaroundTime / numProcesses
  const avgWaitingTime = totalWaitingTime / numProcesses
  // const avgResponseTime = totalResponseTime / numProcesses
  const cpuUtilization =
    ((maxCompletionTime - totalIdleTime) / maxCompletionTime) * 100
  // const throughput = numProcesses / (maxCompletionTime - minArrivalTime)

  processes.sort((a, b) => a.startTime - b.startTime)

  const srtfTable = document.getElementById("srtfTable")
  srtfTable.innerHTML = `
    <tr>
      <th>Process</th>
      <th>Arrival Time</th>
      <th>Burst Time</th>
      <th>Start Time</th>
      <th>Finish Time</th>
      <th>Turnaround Time</th>
      <th>Waiting Time</th>
      <th>Utilization Time</th>
    </tr>
  `

  srtfTable.classList.remove("table-fade-in")
  void srtfTable.offsetWidth // Trigger reflow to reset animation
  srtfTable.classList.add("table-fade-in")

  for (let i = 0; i < numProcesses; i++) {
    const utilizationPercentage = (
      (processes[i].burstTime / processes[i].turnaroundTime) *
      100
    ).toFixed(2)
    srtfTable.innerHTML += `<tr>
                              <td>Process ${processes[i].pid}</td>
                              <td>${processes[i].arrivalTime}</td>
                              <td>${processes[i].burstTime}</td>
                              <td>${processes[i].startTime}</td>
                              <td>${processes[i].completionTime}</td>
                              <td>${processes[i].turnaroundTime}</td>
                              <td>${processes[i].waitingTime}</td>
                              <td>${utilizationPercentage}</td>
                            </tr>`
  }

  // Visualization dimensions

  const width = 1200
  const height = Math.max(100, (numProcesses + 1) * 40) // Increased height to accommodate the last rectangle
  d3.select("#visualization svg").remove()
  // Create an SVG element
  const svg = d3
    .select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // Create x-scale based on total time
  const xScale = d3
    .scaleLinear()
    .domain([0, maxCompletionTime])
    .range([0, width])

  // Data for visualization
  const visualizationData = []

  for (let i = 0; i < numProcesses; i++) {
    // Rest of the code to calculate processes' start and finish times...

    // Generate a random color for each process
    const randomColor = getRandomColor()

    visualizationData.push({
      process: processes[i].pid,
      startTime: processes[i].startTime,
      finishTime: processes[i].completionTime,
      color: randomColor,
    })
  }

  // Update the rectangle positioning and width calculation
  svg
    .selectAll("rect")
    .data(visualizationData)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.startTime))
    .attr("y", (d, i) => 10 + i * 40) // Adjust y-position to prevent overlap
    .attr("width", d => Math.max(1, xScale(d.finishTime) - xScale(d.startTime))) // Ensure width is at least 1
    .attr("height", 30)
    .attr("fill", d => d.color)

  // Update the label positioning
  svg
    .selectAll("text")
    .data(visualizationData)
    .enter()
    .append("text")
    .attr(
      "x",
      d =>
        xScale(d.startTime) +
        Math.max(5, (xScale(d.finishTime) - xScale(d.startTime)) / 2)
    ) // Center the label
    .attr("y", (d, i) => 30 + i * 40) // Adjust y-position to match the rectangles
    .text(d => `P${d.process}`)
    .attr("font-size", "14px")
    .attr("fill", "black")

  // Create x-axis
  const xAxis = d3.axisBottom(xScale)
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - 20})`)
    .call(xAxis)
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
      <td>${cpuUtilization.toFixed(2)}%</td>
    </tr>
  </table>
`

  metricsDiv.classList.remove("table-fade-in")
  void metricsDiv.offsetWidth // Trigger reflow to reset animation
  metricsDiv.classList.add("table-fade-in")
}
