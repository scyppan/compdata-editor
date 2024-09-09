function createInitTeamsDiv(id) {
    const div = document.createElement('div');
    div.id = 'initteams';
    div.classList.add('standard-div', 'level-content'); // Standard class for level content

    const header = document.createElement('h2');
    header.textContent = 'Initial Teams';
    div.appendChild(header);

    // Get the initial teams data for the specified id
    let initteamsData = getDataForId('initteams', id);  // Ensure 'initteams' exists in the global data object

    // Create the table for the initial teams
    const table = document.createElement('table');
    table.classList.add('window-tables');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Finishing Position', 'Team ID'];  // Changed to "Finishing Position"

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    // Add CSS to adjust the width of the "Finishing Position" column
    table.style.width = '100%';  // Ensure the table takes up full width
    const style = document.createElement('style');
    style.innerHTML = `
        table.window-tables td:nth-child(1),
        table.window-tables th:nth-child(1) {
            width: 150px; /* Adjust the width as needed */
            text-align: center;
        }
    `;
    document.head.appendChild(style);  // Append style to the document

    // Add button to add another row dynamically
    const addRowButton = document.createElement('button');
    addRowButton.textContent = 'Add Another Team';
    addRowButton.addEventListener('click', function () {
        const newRow = createNewRow(id, initteamsData, tbody); // Function to add a new row
        tbody.appendChild(newRow);
        renumberRows(tbody); // Re-sequentialize after adding a row
    });

    if (!initteamsData || initteamsData.length === 0) {
        // If there is no initial team data, create a button to start adding teams
        const createButton = document.createElement('button');
        createButton.textContent = 'Add Initial Teams';
        createButton.addEventListener('click', function () {
            initteamsData = createInitialTeamsData(id); // Now only creates 1 initial team
            createButton.remove();  // Remove the button
            table.classList.remove('hidden');  // Show the table after data is added
            initteamsData.forEach((entry, index) => {
                tbody.appendChild(createInitialTeamsRow(entry, index, tbody)); // Sequential numbering starts from 0
            });
            div.appendChild(table);  // Append the table
            div.appendChild(addRowButton);  // Add the button to add more teams
        });

        div.appendChild(createButton);
        table.classList.add('hidden'); // Keep the table hidden initially
    } else {
        // Populate table if data exists
        initteamsData.forEach((entry, index) => {
            tbody.appendChild(createInitialTeamsRow(entry, index, tbody)); // Sequential numbering starts from 0
        });
        div.appendChild(table);  // Append the table if there’s data
        div.appendChild(addRowButton);  // Append the add row button
    }

    return div;
}

function createInitialTeamsRow(entry, position, tbody) {
    const row = document.createElement('tr');
    row.dataset.id = entry.id; // Store the entry ID
    row.dataset.type = 'initteams'; // Indicate this is an 'initteams' row

    // Create cells for Finishing Position and Team ID
    const positionCell = document.createElement('td');
    positionCell.textContent = position; // Sequential numbering starting from 0
    row.appendChild(positionCell);

    const teamIdCell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'number';
    input.value = entry.teamid || -1;  // Default to -1 if teamid is not defined
    input.min = -1;
    input.max = 400000;
    input.classList.add('tablevalue-input');
    input.dataset.key = 'teamid'; // Key for the data field
    input.dataset.context = 'initteams'; // Context for data field

    // Event listener for changes to the teamid input
    input.addEventListener('change', function () {
        const newValue = parseInt(input.value, 10);
        if (newValue === '' || isNaN(newValue)) {
            deleteInitialTeamRow(entry.id, entry.finishpos, row, tbody); // Delete the row if teamid is cleared
        } else if (newValue >= -1 && newValue <= 400000) {
            updateInitialTeamsData(entry.id, entry.finishpos, newValue); // Update data in the global object
            entry.teamid = newValue;  // Reflect the change locally
        } else {
            alert('Team ID must be between -1 and 400000'); // Simple validation alert
            input.value = entry.teamid;  // Reset to previous value
        }
        renumberRows(tbody);  // Reorder and renumber after the change
    });

    teamIdCell.appendChild(input);
    row.appendChild(teamIdCell);

    return row;
}

function createNewRow(id, initteamsData, tbody) {
    // Determine the next sequential position
    const newPosition = initteamsData.length; // This is the index for finishpos, starting from 0

    // Create a new entry for the row with finishpos
    const newEntry = {
        id: id,
        finishpos: newPosition, // Explicitly set finishpos to the newPosition
        teamid: -1 // Default team ID
    };

    // Add to the data object
    data['initteams'].push(newEntry);
    initteamsData.push(newEntry); // Update the local data array

    // Create and return the row with the new position
    return createInitialTeamsRow(newEntry, newPosition, tbody);
}

function deleteInitialTeamRow(id, finishpos, row, tbody) {
    // Remove the entry from the data object by matching both id and finishpos
    const index = data['initteams'].findIndex(entry => entry.id === id && entry.finishpos === finishpos);
    if (index !== -1) {
        data['initteams'].splice(index, 1); // Remove the entry from the data
    }

    const nowarray = data['initteams']
    .filter(team => team.id == id)
    .sort((a, b) => a.finishpos - b.finishpos);

    for(let i=0;i<nowarray.length;i++){
        nowarray[i].finishpos=i;
    }

    row.remove();
    
}

function renumberRows(tbody) {
    // Get all rows and convert to an array for sorting
    const rowsArray = Array.from(tbody.querySelectorAll('tr'));

    // Sort the rows by id (team ID)
    rowsArray.sort((rowA, rowB) => {
        const idA = parseInt(rowA.dataset.id, 10);
        const idB = parseInt(rowB.dataset.id, 10);

        return idA - idB;
    });

    // Reorder rows without clearing the tbody to avoid losing focus
    rowsArray.forEach((row, index) => {
        const positionCell = row.querySelector('td:first-child');
        positionCell.textContent = index;  // Renumber starting from 0
    });
}

function createInitialTeamsData(id) {
    // Create a single new entry for the initial team
    const newEntry = {
        id: id,
        finishpos: 0, // Set the initial position to 0
        teamid: -1 // Default team ID
    };

    // Add the new entry to the global data object
    data['initteams'].push(newEntry);
    
    // Return the new entry in an array
    return [newEntry];
}

function updateInitialTeamsData(id, finishpos, newTeamId) {
    // Find the relevant entry by both id and finishpos
    let entry = data['initteams'].find(item => item.id == id && item.finishpos == finishpos);

    if (entry) {
        // Update only the team ID while preserving finishpos
        entry.teamid = newTeamId;  
    } else {
        console.error(`Initial team entry not found for id ${id} and finishpos ${finishpos}`);
    }
}

