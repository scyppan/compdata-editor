function updateScheduleData(entry, key, value) {

    if (entry) {
        switch (key) {
            case 'day':
                entry.day = parseInt(value);
                break;
            case 'min':
                entry.min = parseInt(value);
                break;
            case 'max':
                entry.max = parseInt(value);
                break;
            case 'time':
                entry.time = parseInt(value);
                break;
            default:
                console.error(`Unknown key: ${key}`);
                return;
        }
    } else {
        console.error(`Schedule entry not found for id ${id}`);
    }
}

function deleteScheduleData(id, day, min, max, time) {
    // Find the index of the relevant schedule entry that matches all the provided parameters
    const index = data['schedule'].findIndex(item => 
        parseInt(item.id) === parseInt(id) && 
        parseInt(item.day) === parseInt(day) && 
        parseInt(item.min) === parseInt(min) && 
        parseInt(item.max) === parseInt(max) && 
        parseInt(item.time) === parseInt(time)
    );

    if (index !== -1) {
        data['schedule'].splice(index, 1);
    } else {
        console.error(`Schedule entry not found for id ${id}, day ${day}, min ${min}, max ${max}, time ${time}.`);
    }
}

function addNewRound(id) {
    const newRoundNumber = getNextRoundNumber(id);
    const newRoundData = {
        id: id,
        day: 1,  // Default day
        round: newRoundNumber,
        min: 0,  // Default min
        max: 0,  // Default max
        time: 1200  // Default time
    };

    // Add the new round data to the global schedule data
    data['schedule'].push(newRoundData);

    // Get the existing schedule div
    const scheduleDiv = document.getElementById('schedule');
    if (!scheduleDiv) {
        console.error('Schedule div not found.');
        return;
    }

    // Create the new round wrapper
    const newRoundWrapper = createRoundWrapper(id, newRoundData);

    // Create the new table with the first row
    const table = createTable(id, newRoundNumber, [newRoundData]);

    // Append the table to the new round wrapper
    newRoundWrapper.appendChild(table);

    // Insert the new round wrapper as the penultimate child
    const childrenCount = scheduleDiv.children.length;
    if (childrenCount > 0) {
        // Insert the new round wrapper before the last child (which is the "New Round" control)
        scheduleDiv.insertBefore(newRoundWrapper, scheduleDiv.children[childrenCount - 1]);
    } else {
        // If there are no children, append the new round wrapper as the first child
        scheduleDiv.appendChild(newRoundWrapper);
    }

    reorderRounds(id);
}

function getNextRoundNumber(id) {
    const scheduleData = getDataForId('schedule', id);
    const existingRounds = scheduleData.map(entry => entry.round);
    return existingRounds.length > 0 ? Math.max(...existingRounds) + 1 : 1;
}

function removeRound(id, round, wrapper) {
    console.log(`Removing round ${round} for id ${id}`);

    // Filter out the entries where the id and round match
    data['schedule'] = data['schedule'].filter(entry => {
        if (entry.id === id && entry.round === round) {
            console.log('Removing entry:', entry);
            return false; // Exclude this entry from the new array
        }
        return true; // Keep this entry
    });

    // Remove the DOM element associated with the round
    wrapper.remove();

    // Reorder the rounds for the specified competition id to be sequential starting from 1
    reorderRounds(id);
}

function reorderRounds(id) {
    sortSchedules();
    const scheduleData = data['schedule'].filter(entry => entry.id === id);

    // Get all unique rounds sorted in ascending order
    const uniqueRounds = [...new Set(scheduleData.map(entry => entry.round))].sort((a, b) => a - b);

    // Reassign round numbers to be sequential starting from 1
    uniqueRounds.forEach((oldRound, index) => {
        const newRound = index + 1;
        scheduleData.forEach(entry => {
            if (entry.round === oldRound) {
                entry.round = newRound;
            }
        });
    });

    // Update the DOM elements with the class 'schedule-round'
    let rounds = document.getElementsByClassName('schedule-round');

    for (let i = 0; i < rounds.length; i++) {
        rounds[i].dataset.round = i + 1;
        // Update only the text content of the first child (the h3 tag) directly without using querySelector
        rounds[i].children[0].childNodes[0].textContent = `Round ${i + 1}`;
    }
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

function createRoundWrapper(id, roundData) {
    const roundNumber = roundData.round;

    const newRoundWrapper = document.createElement('div');
    newRoundWrapper.id = `schedule-table-round-${roundNumber}`;
    newRoundWrapper.classList.add('schedule-round');
    newRoundWrapper.dataset.round = roundNumber;

    const headerWithControls = createHeaderWithControls(
        roundNumber,
        () => addNewEntryToRound(id, roundNumber),
        () => removeRound(id, roundNumber, newRoundWrapper)
    );

    newRoundWrapper.appendChild(headerWithControls);
    const table = createTable(id, roundNumber, [roundData]);
    //newRoundWrapper.appendChild(table);

    return newRoundWrapper;
}

function createTableRow(entry, keys) {
    const row = document.createElement('tr');
    row.dataset.id = entry.id;

    keys.forEach(key => {
        const { cell, input } = createTableCellWithInput('number', entry[key], key);
        row.appendChild(cell);

        input.addEventListener('change', function () {
            if (key === 'day' && input.value === '') {
                // If the "day" input is deleted, remove the row and entry
                const tbody = row.parentNode;
                tbody.removeChild(row);
                deleteScheduleData(entry.id, entry.day, entry.min, entry.max, entry.time);
            } else {
                updateScheduleData(entry, key, input.value);
                entry[key] = parseInt(input.value);  // Update the local variable to reflect the change
                sortSchedules();
            }
        });
    });

    return row;
}

// Helper function to create a table cell with an input
function createTableCellWithInput(type, value, key) {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = type;
    input.value = value !== undefined ? value : '';
    input.classList.add('tablevalue-input');
    input.dataset.key = key;
    input.dataset.context = 'schedule';
    cell.appendChild(input);
    return { cell, input };
}

// Helper function to create a header with controls
function createHeaderWithControls(roundNumber, addEntryCallback, removeRoundCallback) {
    const roundHeader = document.createElement('h3');
    roundHeader.textContent = `Round ${roundNumber}`;

    const roundControls = document.createElement('div');
    roundControls.classList.add('round-controls');

    const addEntryDiv = document.createElement('div');
    addEntryDiv.innerHTML = '⊕';
    addEntryDiv.classList.add('entry-control');
    addEntryDiv.title = `Add Entry to Round ${roundNumber}`;
    addEntryDiv.addEventListener('click', addEntryCallback);

    const removeRoundDiv = document.createElement('div');
    removeRoundDiv.innerHTML = '⊖';
    removeRoundDiv.classList.add('round-control');
    removeRoundDiv.title = `Remove Round ${roundNumber}`;
    removeRoundDiv.addEventListener('click', removeRoundCallback);

    roundControls.appendChild(addEntryDiv);
    roundControls.appendChild(removeRoundDiv);
    roundHeader.appendChild(roundControls);

    return roundHeader;
}

// Helper function to create a table structure
function createTable(id, roundNumber, roundData) {
    const table = document.createElement('table');
    table.classList.add('window-tables', 'groupedtables');
    table.id = `schedule-table-round-${roundNumber}`;
    table.dataset.round = roundNumber;

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
    roundData.forEach(entry => {
        tbody.appendChild(createTableRow(entry, ['day', 'min', 'max', 'time']));
    });
    table.appendChild(tbody);

    return table;
}

// Modified createScheduleRow using the new helpers
function createScheduleRow(entry) {
    return createTableRow(entry, ['day', 'min', 'max', 'time']);
}

// Helper to create the header
function createDivHeader(text) {
    const header = document.createElement('h2');
    header.textContent = text;
    return header;
}

// Helper to handle empty schedules
function handleEmptySchedule(div, id) {
    const scheduleParagraph = document.createElement('p');
    scheduleParagraph.textContent = 'No schedules';
    scheduleParagraph.style.fontSize = "12px";
    div.appendChild(scheduleParagraph);

    const createButton = createButtonWithClickHandler(
        'Create Schedule Data for Round 1',
        () => {
            addNewRound(id);
            const newDiv = createScheduleDiv(id);
            div.innerHTML = ''; // Clear existing content
            div.appendChild(newDiv);
        }
    );
    div.appendChild(createButton);
}

// Helper to group schedule data by round
function groupScheduleDataByRound(scheduleData) {
    return scheduleData.reduce((acc, entry) => {
        if (!acc[entry.round]) {
            acc[entry.round] = [];
        }
        acc[entry.round].push(entry);
        return acc;
    }, {});
}

// Helper to create add round control
function createAddRoundControl(callback) {
    const addRoundDiv = document.createElement('div');
    addRoundDiv.innerHTML = '⊕ New Round';
    addRoundDiv.classList.add('round-control');
    addRoundDiv.addEventListener('click', callback);
    return addRoundDiv;
}

// Helper to create buttons with a click handler
function createButtonWithClickHandler(text, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', clickHandler);
    return button;
}

function createScheduleDiv(id) {

    const div = document.createElement('div');
    div.id = 'schedule';
    div.classList.add('level-content', 'standard-div');

    const header = createDivHeader(`Schedule - ${getRoundData(id)}`);
    div.appendChild(header);
    
    const scheduleData = getDataForId('schedule', id);
    
    if (scheduleData.length === 0) {
        handleEmptySchedule(div, id);
        return div;
    }

    const groupedSchedule = groupScheduleDataByRound(scheduleData);
    
    Object.values(groupedSchedule).forEach((roundData, index) => {
    
        const roundWrapper = createRoundWrapper(id, roundData[0]);
        div.appendChild(roundWrapper);
    
        roundData.forEach((entry, entryIndex) => {
    
            const row = createScheduleRow(entry);
    
            const tbody = roundWrapper.querySelector('tbody');
    
            tbody.appendChild(row);
    });
    
    });
    

    const addRoundDiv = createAddRoundControl(() => addNewRound(id));
    div.appendChild(addRoundDiv);
    
    return div;
}

function createScheduleDiv(id) {
    const div = document.createElement('div');
    div.id = 'schedule';
    div.classList.add('level-content', 'standard-div');

    const header = createDivHeader(`Schedule - ${getRoundData(id)}`);
    div.appendChild(header);

    const scheduleData = getDataForId('schedule', id);
    
    if (scheduleData.length === 0) {
        handleEmptySchedule(div, id);
        return div;
    }

    const groupedSchedule = groupScheduleDataByRound(scheduleData);

    Object.values(groupedSchedule).forEach((roundData, index) => {
        
        const roundWrapper = createRoundWrapper(id, roundData[0]);
        
        div.appendChild(roundWrapper);
        
        const table = createTable(id, index + 1, roundData);
        roundWrapper.appendChild(table);
        
    });

    const addRoundDiv = createAddRoundControl(() => addNewRound(id));
    div.appendChild(addRoundDiv);

    return div;
}

function sortSchedules() {
    data['schedule'].sort((a, b) => {
        if (a.id !== b.id) {
            return a.id - b.id;  // Sort by id first
        } else if (a.round !== b.round) {
            return a.round - b.round;  // Then by round
        } else if (a.day !== b.day) {
            return a.day - b.day;  // Then by day
        } else {
            return a.time - b.time;  // Finally by time
        }
    });
}
