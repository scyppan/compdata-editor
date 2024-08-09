function createScheduleRow(entry) {
    const row = document.createElement('tr');
    row.dataset.id = entry.id; // Set data-id attribute
    row.dataset.type = 'schedule'; // Set data-type attribute

    const createCellWithInput = (type, value, key) => {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        input.classList.add('tablevalue-input');
        input.dataset.key = key;
        input.dataset.context = 'schedule';
        cell.appendChild(input);
        return { cell, input };
    };

    // Day cell with input
    const { cell: dayCell, input: dayInput } = createCellWithInput('text', entry.day, 'day');

    // Event listener for day change
    dayInput.addEventListener('change', function () {
        if (!dayInput.value) {
            // If day is deleted (empty), remove the row and update the data
            row.remove(); // Remove the row from the table
            deleteScheduleData(entry.id); // Remove the corresponding data entry
        } else {
            updateScheduleData(entry.id, 'day', dayInput.value);
            entry.day = dayInput.value;  // Update the local variable to reflect the change
        }
    });

    // Time cell with input
    const { cell: timeCell, input: timeInput } = createCellWithInput('text', entry.time, 'time');

    // Event listener for time change
    timeInput.addEventListener('change', function () {
        updateScheduleData(entry.id, 'time', timeInput.value);
        entry.time = timeInput.value;  // Update the local variable to reflect the change
    });

    // Event cell with input
    const { cell: eventCell, input: eventInput } = createCellWithInput('text', entry.event, 'event');

    // Event listener for event change
    eventInput.addEventListener('change', function () {
        updateScheduleData(entry.id, 'event', eventInput.value);
        entry.event = eventInput.value;  // Update the local variable to reflect the change
    });

    // Location cell with input
    const { cell: locationCell, input: locationInput } = createCellWithInput('text', entry.location, 'location');

    // Event listener for location change
    locationInput.addEventListener('change', function () {
        updateScheduleData(entry.id, 'location', locationInput.value);
        entry.location = locationInput.value;  // Update the local variable to reflect the change
    });

    // Append all cells to the row
    row.appendChild(dayCell);
    row.appendChild(timeCell);
    row.appendChild(eventCell);
    row.appendChild(locationCell);

    return row;
}

function createScheduleDiv(id) {
    const div = document.createElement('div');
    div.id = 'schedule';
    div.classList.add('standard-div', 'level-content'); // Ensure it has 'level-content' class

    const header = document.createElement('h2');
    header.textContent = `Schedule - ${getRoundData(id)}`;
    div.appendChild(header);

    // Get schedule data for the specified id
    const scheduleData = getDataForId('schedule', id);

    // Check for empty schedule data
    if (scheduleData.length === 0) {
        const scheduleParagraph = document.createElement('p');
        scheduleParagraph.textContent = 'No schedules';
        scheduleParagraph.style.fontSize = "12px";
        div.appendChild(scheduleParagraph); // Append the message to the main div
        return div; // Return early if there are no schedules
    }

    // Group schedule data by 'round'
    const groupedSchedule = scheduleData.reduce((acc, entry) => {
        if (!acc[entry.round]) {
            acc[entry.round] = [];
        }
        acc[entry.round].push(entry);
        return acc;
    }, {});

    // Create a table for each round
    for (const round in groupedSchedule) {
        const roundHeader = document.createElement('h3');
        roundHeader.textContent = `Round ${round}`;
        div.appendChild(roundHeader);

        const table = document.createElement('table');
        table.classList.add('window-tables', 'groupedtables');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Day', 'Min', 'Max', 'Time'].forEach(title => {
            const th = document.createElement('th');
            th.textContent = title;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        groupedSchedule[round].forEach(entry => {
            const row = document.createElement('tr');
            row.dataset.id = entry.id; // Set data-id attribute
            row.dataset.type = 'schedule'; // Set data-type attribute

            const createCellWithInput = (type, value, key) => {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = type;
                input.value = value;
                input.classList.add('tablevalue-input');
                input.dataset.id = id;
                input.dataset.key = key;
                input.dataset.context = 'schedule';
                input.dataset.fieldType = 'standard';
                cell.appendChild(input);
                return { cell, input };
            };

            const { cell: dayCell, input: dayInput } = createCellWithInput('number', entry.day, 'day');
            const { cell: minCell, input: minInput } = createCellWithInput('number', entry.min, 'min');
            const { cell: maxCell, input: maxInput } = createCellWithInput('number', entry.max, 'max');
            const { cell: timeCell, input: timeInput } = createCellWithInput('number', entry.time, 'time');

            // Event listener for day change
            dayInput.addEventListener('change', function () {
                if (!dayInput.value) {
                    // If day is deleted (empty), remove the row and update the data
                    row.remove(); // Remove the row from the table
                    deleteScheduleData(entry.id); // Remove the corresponding data entry
                } else {
                    updateScheduleData(entry.id, 'day', dayInput.value);
                    entry.day = dayInput.value;  // Update the local variable to reflect the change
                }
            });

            // Event listener for min change
            minInput.addEventListener('change', function () {
                updateScheduleData(entry.id, 'min', minInput.value);
                entry.min = minInput.value;  // Update the local variable to reflect the change
            });

            // Event listener for max change
            maxInput.addEventListener('change', function () {
                updateScheduleData(entry.id, 'max', maxInput.value);
                entry.max = maxInput.value;  // Update the local variable to reflect the change
            });

            // Event listener for time change
            timeInput.addEventListener('change', function () {
                updateScheduleData(entry.id, 'time', timeInput.value);
                entry.time = timeInput.value;  // Update the local variable to reflect the change
            });

            row.appendChild(dayCell);
            row.appendChild(minCell);
            row.appendChild(maxCell);
            row.appendChild(timeCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        div.appendChild(table);
    }

    return div;
}

function updateScheduleData(id, key, value) {
    // Find the relevant schedule entry
    let entry = data['schedule'].find(item => item.id == id);

    if (entry) {
        switch (key) {
            case 'day':
                entry.day = value;
                break;
            case 'time':
                entry.time = value;
                break;
            case 'event':
                entry.event = value;
                break;
            case 'location':
                entry.location = value;
                break;
            default:
                console.error(`Unknown key: ${key}`);
                return;
        }
    } else {
        console.error(`Schedule entry not found for id ${id}`);
    }
}

function deleteScheduleData(id) {
    // Find the index of the relevant schedule entry
    const index = data['schedule'].findIndex(item => item.id == id);

    if (index !== -1) {
        // Remove the entry from the array
        data['schedule'].splice(index, 1);
        console.log(`Schedule entry with id ${id} has been deleted.`);
    } else {
        console.error(`Schedule entry not found for id ${id}`);
    }
}