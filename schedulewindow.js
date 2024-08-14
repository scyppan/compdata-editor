function createScheduleRow(entry) {
    const row = document.createElement('tr');
    row.dataset.id = entry.id; // Set data-id attribute
    row.dataset.type = 'schedule'; // Set data-type attribute

    const createCellWithInput = (type, value, key) => {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = type;
        input.value = value !== undefined ? value : ''; // Default to empty string if value is undefined
        input.classList.add('tablevalue-input');
        input.dataset.key = key;
        input.dataset.context = 'schedule';
        cell.appendChild(input);
        return { cell, input };
    };

    // Day cell with input
    const { cell: dayCell, input: dayInput } = createCellWithInput('number', entry.day, 'day');

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

    // Min cell with input
    const { cell: minCell, input: minInput } = createCellWithInput('number', entry.min, 'min');

    // Event listener for min change
    minInput.addEventListener('change', function () {
        updateScheduleData(entry.id, 'min', minInput.value);
        entry.min = minInput.value;  // Update the local variable to reflect the change
    });

    // Max cell with input
    const { cell: maxCell, input: maxInput } = createCellWithInput('number', entry.max, 'max');

    // Event listener for max change
    maxInput.addEventListener('change', function () {
        updateScheduleData(entry.id, 'max', maxInput.value);
        entry.max = maxInput.value;  // Update the local variable to reflect the change
    });

    // Time cell with input
    const { cell: timeCell, input: timeInput } = createCellWithInput('number', entry.time, 'time');

    // Event listener for time change
    timeInput.addEventListener('change', function () {
        updateScheduleData(entry.id, 'time', timeInput.value);
        entry.time = timeInput.value;  // Update the local variable to reflect the change
    });

    // Append all cells to the row
    row.appendChild(dayCell);
    row.appendChild(minCell);
    row.appendChild(maxCell);
    row.appendChild(timeCell);

    return row;
}

function createScheduleDiv(id) {
    const div = document.createElement('div');
    div.id = 'schedule';
    div.classList.add('standard-div', 'level-content'); // Ensure it has 'level-content' class

    const header = document.createElement('h2');
    header.textContent = `Schedule - ${getRoundData(id)}`;
    div.appendChild(header);

    // Create a div to add a new round
    const addRoundDiv = document.createElement('div');
    addRoundDiv.innerHTML = '⊕ New Round';
    addRoundDiv.classList.add('round-control');
    addRoundDiv.addEventListener('click', function () {
        addNewRound(id);
    });
    div.appendChild(addRoundDiv);

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
        
        // Create a control panel for the round
        const roundControls = document.createElement('div');
        roundControls.classList.add('round-controls');

        // Add entry control div
        const addEntryDiv = document.createElement('div');
        addEntryDiv.innerHTML = '⊕';
        addEntryDiv.classList.add('entry-control');
        addEntryDiv.title = `Add Entry to Round ${round}`;
        addEntryDiv.addEventListener('click', function () {
            addNewEntryToRound(id, round);
        });

        // Remove round control div
        const removeRoundDiv = document.createElement('div');
        removeRoundDiv.innerHTML = '⊖';
        removeRoundDiv.classList.add('round-control');
        removeRoundDiv.title = `Remove Round ${round}`;
        removeRoundDiv.addEventListener('click', function () {
            removeRound(id, round);
        });

        // Add controls to the control panel
        roundControls.appendChild(addEntryDiv);
        roundControls.appendChild(removeRoundDiv);

        // Append controls to the header
        roundHeader.appendChild(roundControls);
        div.appendChild(roundHeader);

        const table = document.createElement('table');
        table.classList.add('window-tables', 'groupedtables');
        table.id = `schedule-table-round-${round}`; // Set the table ID
        table.dataset.round = round;

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
            tbody.appendChild(createScheduleRow(entry));
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
            case 'min':
                entry.min = value;
                break;
            case 'max':
                entry.max = value;
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

function addNewRound(id) {
    console.log("I'm here!");
    
    // Create a new round with a default round number
    const newRoundNumber = getNextRoundNumber(id);
    const newRoundData = {
        id: id,
        round: newRoundNumber,
        day: 1,  // Default day
        min: 0,  // Default min
        max: 0,  // Default max
        time: 1200  // Default time
    };

    // Add to the global schedule data
    data['schedule'].push(newRoundData);

    // Get the existing schedule div
    const scheduleDiv = document.getElementById('schedule');
    
    if (!scheduleDiv) {
        console.error('Schedule div not found.');
        return;
    }

    // Create the new round table and append it
    const newTable = createScheduleTable(newRoundData); // Create a function to generate just the table
    scheduleDiv.appendChild(newTable);
}

function createScheduleTable(roundData) {
    const roundHeader = document.createElement('h3');
    roundHeader.textContent = `Round ${roundData.round}`;
    
    // Create a control panel for the round
    const roundControls = document.createElement('div');
    roundControls.classList.add('round-controls');

    // Add entry control div
    const addEntryDiv = document.createElement('div');
    addEntryDiv.innerHTML = '⊕';
    addEntryDiv.classList.add('entry-control');
    addEntryDiv.title = `Add Entry to Round ${roundData.round}`;
    addEntryDiv.addEventListener('click', function () {
        addNewEntryToRound(roundData.id, roundData.round);
    });

    // Remove round control div
    const removeRoundDiv = document.createElement('div');
    removeRoundDiv.innerHTML = '⊖';
    removeRoundDiv.classList.add('round-control');
    removeRoundDiv.title = `Remove Round ${roundData.round}`;
    removeRoundDiv.addEventListener('click', function () {
        removeRound(roundData.id, roundData.round);
    });

    // Add controls to the control panel
    roundControls.appendChild(addEntryDiv);
    roundControls.appendChild(removeRoundDiv);

    // Append controls to the header
    roundHeader.appendChild(roundControls);

    const table = document.createElement('table');
    table.classList.add('window-tables', 'groupedtables');
    table.id = `schedule-table-round-${roundData.round}`; // Set the table ID
    table.dataset.round = roundData.round;

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
    tbody.appendChild(createScheduleRow(roundData)); // Add the new row to the table body

    table.appendChild(tbody);

    // Wrap the table and header together for easy appending
    const wrapper = document.createElement('div');
    wrapper.appendChild(roundHeader);
    wrapper.appendChild(table);

    return wrapper; // Return the full wrapper including the header and table
}

function getNextRoundNumber(id) {
    const scheduleData = getDataForId('schedule', id);
    const existingRounds = scheduleData.map(entry => entry.round);
    return existingRounds.length > 0 ? Math.max(...existingRounds) + 1 : 1;
}

function removeRound(id, round) {
    // Filter out all entries for the specified round
    data['schedule'] = data['schedule'].filter(entry => entry.round !== round);

    // Refresh the schedule div
    const scheduleDiv = document.getElementById('schedule');
    scheduleDiv.innerHTML = '';
    scheduleDiv.appendChild(createScheduleDiv(id));
}

function addNewEntryToRound(id, round) {
    const newEntry = {
        id: id,
        round: round,
        day: 1,  // Default day
        min: 0,  // Default min
        max: 0,  // Default max
        time: 0  // Default time
    };

    // Add to the global schedule data
    data['schedule'].push(newEntry);

    // Find the corresponding table body using the new ID
    const table = document.querySelector(`#schedule-table-round-${round} tbody`);
    if (table) {
        table.appendChild(createScheduleRow(newEntry));
    } else {
        console.error('Could not find table for round:', round);
    }
}