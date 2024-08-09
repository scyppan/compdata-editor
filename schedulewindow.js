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
                updateScheduleData(entry.id, 'day', dayInput.value);
                entry.day = dayInput.value;  // Update the local variable to reflect the change
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
        let parsedValue = parseInt(value, 10);

        if (isNaN(parsedValue)) {
            console.error(`Invalid number for ${key}: ${value}`);
            return;
        }

        // Update the entry's specific key with the parsed value
        switch (key) {
            case 'day':
                entry.day = parsedValue;  // Ensure day is always an integer
                break;
            case 'min':
                entry.min = parsedValue;  // Ensure min is always an integer
                break;
            case 'max':
                entry.max = parsedValue;  // Ensure max is always an integer
                break;
            case 'time':
                entry.time = parsedValue;  // Ensure time is always an integer
                break;
            default:
                console.error(`Unknown key: ${key}`);
                return;
        }

    } else {
        console.error(`Schedule entry not found for id ${id}`);
    }
}

