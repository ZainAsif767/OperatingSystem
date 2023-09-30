from random import randint
from statistics import mean
from texttable import Texttable
import plotly.express as px
import pandas as pd
from datetime import datetime


class Process:
    def __init__(self, process_id, arrival_time, burst_time, execution_time):
        self.process_id = process_id
        self.arrival_time = arrival_time
        self.burst_time = burst_time
        self.time_left = execution_time
        self.is_arrived = False
        self.is_ready = False
        self.start_time = 0
        self.end_time = 0
        self.completion_time = 0
        self.turn_around_time = 0
        self.wait_time = 0
        self.response_time = 0
        self.utilization_time = 0
        self.response_ratio = 0
        self.start_times = []
        self.end_times = []

    def decrement_time_left(self):
        self.time_left -= 1

    def set_start_time(self, time_passed):
        self.start_time = time_passed

    def set_end_time(self, time_passed):
        self.end_time = time_passed

    def set_completion_time(self, time_passed):
        self.completion_time = time_passed

    def set_turn_around_time(self):
        self.turn_around_time = self.completion_time - self.arrival_time

    def set_wait_time(self):
        self.wait_time = self.turn_around_time - self.burst_time

    def set_response_time(self, time_passed):
        self.response_time = time_passed - self.arrival_time

    def set_utilization_time(self):
        self.utilization_time = self.burst_time / self.turn_around_time

    def append_start_times(self, time_passed):
        self.start_times.append(time_passed)

    def append_end_times(self, time_passed):
        self.end_times.append(time_passed)

    def set_response_ratio(self, time_passed):
        self.response_ratio = (
            (time_passed - self.arrival_time) + self.burst_time
        ) / self.burst_time


def input_entity(entity: str, min: int, max: int):
    number_of_entities = None
    while True:
        number_of_entities = int(
            input(f"Enter the {entity} (min: {min}, max: {max}):- ")
        )
        # number_of_entities = randint(0, 10)
        if number_of_entities >= min and number_of_entities <= max:
            break
    return number_of_entities


def print_process_table(process_list):
    table = Texttable()
    table_rows = [
        [
            "process_id",
            "arrival_time",
            "burst_time",
            "completion_time",
            "turn_around_time",
            "wait_time",
            "response_time",
            "utilization_time",
        ]
    ]
    for process in process_list:
        new_row = [
            process.process_id,
            process.arrival_time,
            process.burst_time,
            process.completion_time,
            process.turn_around_time,
            process.wait_time,
            process.response_time,
            process.utilization_time,
        ]
        table_rows.append(new_row)
    table.add_rows(table_rows)
    table.set_max_width(200)
    print(table.draw())


def print_process_average_table(process_list):
    table = Texttable()
    table_rows = [
        [
            "average_completion_time",
            "average_turn_around_time",
            "average_wait_time",
            "average_response_time",
            "average_utilization_time",
        ]
    ]
    average_completion_time = mean(
        [process.completion_time for process in process_list]
    )
    average_turn_around_time = mean(
        [process.turn_around_time for process in process_list]
    )
    average_wait_time = mean([process.wait_time for process in process_list])
    average_response_time = mean([process.response_time for process in process_list])
    average_utilization_time = mean(
        [process.utilization_time for process in process_list]
    )

    new_row = [
        average_completion_time,
        average_turn_around_time,
        average_wait_time,
        average_response_time,
        average_utilization_time,
    ]
    table_rows.append(new_row)
    table.add_rows(table_rows)
    table.set_max_width(200)
    print(table.draw())


def seconds_to_timestamp(seconds):
    timestamp = datetime.fromtimestamp(seconds)
    return timestamp.strftime("%Y-%m-%d %H:%M:%S")


def draw_gantt_chart(process_list):
    data_frame_list = []
    # df = pd.DataFrame([dict(Process=process.process_id, Start=seconds_to_timestamp(
    #     process.start_time), Finish=seconds_to_timestamp(process.end_time)) for process in process_list])

    for process in process_list:
        for i in range(len(process.start_times)):
            data_frame_list.append(
                dict(
                    Process=str(process.process_id),
                    Start=seconds_to_timestamp(process.start_times[i]),
                    Finish=seconds_to_timestamp(process.end_times[i]),
                )
            )
    df = pd.DataFrame(data_frame_list)

    fig = px.timeline(df, x_start="Start", x_end="Finish", y="Process", color="Process")
    # fig.update_yaxes(autorange="reversed")
    fig.update_layout(
        xaxis=dict(
            title="Seconds",
            tickformat="%S",
            tickvals=pd.date_range(
                start=df["Start"].min(), end=df["Finish"].max(), freq="S"
            ),
        ),
        yaxis=dict(
            title="Processes", tickvals=[process.process_id for process in process_list]
        ),
    )
    fig.show()


def sort_processes_according_to_shortest_job(process_list):
    return sorted(process_list, key=lambda process: process.burst_time, reverse=False)


def sort_processes_according_to_shortest_arrival(process_list):
    return sorted(process_list, key=lambda process: process.arrival_time, reverse=False)


def sort_processes_according_to_shortest_time_left(process_list):
    return sorted(process_list, key=lambda process: process.time_left, reverse=False)


def sort_processes_according_to_highest_response_ratio(process_list):
    return sorted(
        process_list, key=lambda process: process.response_ratio, reverse=True
    )


def get_processes_of_same_shortest_job(process_list, minimum_job):
    processes_of_same_shortest_job = []
    for process in process_list:
        if process.burst_time == minimum_job:
            processes_of_same_shortest_job.append(process)
    return processes_of_same_shortest_job


def get_processes_of_same_shortest_time_left(process_list, minimum_time_left):
    processes_of_same_shortest_time_left = []
    for process in process_list:
        if process.time_left == minimum_time_left:
            processes_of_same_shortest_time_left.append(process)
    return processes_of_same_shortest_time_left


def get_processes_of_same_highest_response_ratio(process_list, maximum_response_ratio):
    processes_of_same_highest_response_ratio = []
    for process in process_list:
        if process.time_left == maximum_response_ratio:
            processes_of_same_highest_response_ratio.append(process)
    return processes_of_same_highest_response_ratio


def check_should_execution_proceed(process_list):
    for process in process_list:
        if process.time_left > 0:
            return True
    return False


def execute_shortest_job_first(processes):
    ready_queue = []
    running_queue = []
    time_passed = 0
    print("\nExecuting Processes according to Shortest Job First.")
    while check_should_execution_proceed(processes):
        ready_queue = []
        for process in processes:
            if process.arrival_time <= time_passed and process.time_left > 0:
                ready_queue.append(process)

        if len(ready_queue) == 0:
            time_passed += 1
            # print("CPU was idle when time passed is", time_passed, '\n')
        else:
            sorted_ready_queue_according_to_shortest_job = (
                sort_processes_according_to_shortest_job(ready_queue)
            )
            minimum_job = sorted_ready_queue_according_to_shortest_job[0].burst_time

            processes_of_same_shortest_job = get_processes_of_same_shortest_job(
                sorted_ready_queue_according_to_shortest_job, minimum_job
            )

            sorted_ready_queue_according_to_shortest_arrival = (
                sort_processes_according_to_shortest_arrival(
                    processes_of_same_shortest_job
                )
            )

            running_queue = [sorted_ready_queue_according_to_shortest_arrival[0]]

            ran_process = running_queue[0]
            ran_process.is_ready = True
            ran_process.set_response_time(time_passed)
            ran_process.set_start_time(time_passed)
            ran_process.append_start_times(time_passed)
            time_passed += ran_process.burst_time
            ran_process.set_end_time(time_passed)
            ran_process.append_end_times(time_passed)
            ran_process.time_left = 0
            ran_process.set_completion_time(time_passed)
            ran_process.set_turn_around_time()
            ran_process.set_wait_time()
            ran_process.set_utilization_time()

            # print("\nProcess ran when time passed is", time_passed)
            # print_process_table(running_queue)
            # print()

    draw_gantt_chart(processes)

    print("Final Process Table")
    print_process_table(processes)
    print_process_average_table(processes)


def execute_shortest_remaining_time_first(processes):
    ready_queue = []
    time_passed = 0

    print("\nExecuting Processes according to Shortest Remaining Time First.")
    ran_process = None
    while check_should_execution_proceed(processes):
        ready_queue = []
        for process in processes:
            if process.arrival_time <= time_passed and process.time_left > 0:
                ready_queue.append(process)

        if len(ready_queue) == 0:
            time_passed += 1
        else:
            sorted_ready_queue_according_to_shortest_time_left = (
                sort_processes_according_to_shortest_time_left(ready_queue)
            )
            minimum_time_left = sorted_ready_queue_according_to_shortest_time_left[
                0
            ].time_left

            processes_of_same_shortest_time_left = (
                get_processes_of_same_shortest_time_left(
                    sorted_ready_queue_according_to_shortest_time_left,
                    minimum_time_left,
                )
            )

            sorted_ready_queue_according_to_shortest_arrival = (
                sort_processes_according_to_shortest_arrival(
                    processes_of_same_shortest_time_left
                )
            )

            running_queue = [sorted_ready_queue_according_to_shortest_arrival[0]]

            if not ran_process or ran_process != running_queue[0]:
                running_queue[0].append_start_times(time_passed)
                if ran_process:
                    ran_process.append_end_times(time_passed)
                ran_process = running_queue[0]
            if not ran_process.is_ready:
                ran_process.set_response_time(time_passed)
                ran_process.set_start_time(time_passed)
                ran_process.is_ready = True
            time_passed += 1
            ran_process.time_left -= 1
            if ran_process.time_left == 0:
                ran_process.set_end_time(time_passed)
                ran_process.set_completion_time(time_passed)
                ran_process.set_turn_around_time()
                ran_process.set_wait_time()
                ran_process.set_utilization_time()
    if len(ran_process.start_times) > len(ran_process.end_times):
        ran_process.append_end_times(time_passed)

    draw_gantt_chart(processes)

    print("Final Process Table")
    print_process_table(processes)
    print_process_average_table(processes)
 

def execute_highest_response_ratio_first(processes):
    ready_queue = []
    running_queue = []
    time_passed = 0
    print("\nExecuting Processes according to Highest Response Ratio First.")
    while check_should_execution_proceed(processes):
        ready_queue = []
        for process in processes:
            process.set_response_ratio(time_passed)
            if process.arrival_time <= time_passed and process.time_left > 0:
                ready_queue.append(process)

        if len(ready_queue) == 0:
            time_passed += 1
            # print("CPU was idle when time passed is", time_passed, '\n')
        else:
            sorted_ready_queue_according_to_highest_response_ratio = (
                sort_processes_according_to_highest_response_ratio(ready_queue)
            )
            maximum_response_ratio = (
                sorted_ready_queue_according_to_highest_response_ratio[0].burst_time
            )

            processes_of_same_highest_response_ratio = (
                get_processes_of_same_highest_response_ratio(
                    sorted_ready_queue_according_to_highest_response_ratio,
                    maximum_response_ratio,
                )
            )

            sorted_ready_queue_according_to_shortest_arrival = (
                sort_processes_according_to_shortest_arrival(
                    processes_of_same_highest_response_ratio
                )
            )

            running_queue = [sorted_ready_queue_according_to_shortest_arrival[0]]

            ran_process = running_queue[0]
            ran_process.is_ready = True
            ran_process.set_response_time(time_passed)
            ran_process.set_start_time(time_passed)
            ran_process.append_start_times(time_passed)
            time_passed += ran_process.burst_time
            ran_process.set_end_time(time_passed)
            ran_process.append_end_times(time_passed)
            ran_process.time_left = 0
            ran_process.set_completion_time(time_passed)
            ran_process.set_turn_around_time()
            ran_process.set_wait_time()
            ran_process.set_utilization_time()

            # print("\nProcess ran when time passed is", time_passed)
            # print_process_table(running_queue)
            # print()

    draw_gantt_chart(processes)

    print("Final Process Table")
    print_process_table(processes)
    print_process_average_table(processes)


if __name__ == "__main__":
    number_of_processes = input_entity("number of processes", 3, 5)
    # number_of_processes = 5
    # arrival_times = [1, 3, 5, 7, 8]
    # burst_times = [3, 6, 8, 4, 5]
    processes = []
    for i in range(number_of_processes):
        process_id = i + 1
        arrival_time = input_entity(f"arrival time of process {process_id}", 0, 10)
        execution_time = input_entity(f"execution time of process {process_id}", 1, 10)
        # arrival_time = arrival_times[i]
        # execution_time = burst_times[i]
        processes.append(
            Process(process_id, arrival_time, execution_time, execution_time)
        )

    chosen_algorithm = input_entity(
        f"algorithm you want to execute (1 for SJF, 2 for SRTF, 3 for HRRF)", 1, 3
    )

    if chosen_algorithm == 1:
        execute_shortest_job_first(processes)
    elif chosen_algorithm == 2:
        execute_shortest_remaining_time_first(processes)
    elif chosen_algorithm == 3:
        execute_highest_response_ratio_first(processes)
