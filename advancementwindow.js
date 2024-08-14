function createAdvancementDiv(id) {
    const div = document.createElement('div');
    div.id = 'advancement';
    div.classList.add('standard-div', 'level-content'); // Ensure it has 'level-content' class

    const header = document.createElement('h2');
    header.textContent = `Advancement`;
    div.appendChild(header);

    // Create table to display advancement data
    const table = document.createElement('table');
    table.classList.add('window-tables');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Slot', 'Push Comp', 'Push Pos'].forEach(title => {
        const th = document.createElement('th');
        th.textContent = title;
        th.style.fontSize = 'small'; // Make the font size small for headers
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    // Create button for adding new advancements
    const createButton = document.createElement('button');
    createButton.textContent = 'Create New Advancement';
    createButton.addEventListener('click', function () {
        let newAdv = createNewAdvancementData(id);
        // Ensure that if it's the first advancement, the table is displayed and the message is removed
        table.classList.remove('hidden');
        const noDataMessage = div.querySelector('.no-data-message');
        if (noDataMessage) {
            noDataMessage.remove();
        }
        
        addAdvancementRow(newAdv, tbody);
    });

    div.appendChild(table);
    div.appendChild(createButton); // Append the button after the table

    // Get advancement data for the specified id
    const advancementData = getDataForId('advancement', id);
    advancementData.sort((a, b) => a.slot - b.slot);

    advancementData.forEach(entry => {
        addAdvancementRow(entry, tbody); // Ensure tbody is passed correctly
    });    

    // Check for empty advancement data
    if (advancementData.length === 0) {
        table.classList.add('hidden'); // Hide the table if there's no data
        const advancementParagraph = document.createElement('p');
        advancementParagraph.textContent = 'No advancement data';
        advancementParagraph.classList.add('no-data-message'); // Add a class for easy targeting later
        advancementParagraph.style.fontSize = "12px";
        div.appendChild(advancementParagraph); // Append the message to the main div
    }

    return div;
}

function createNewAdvancementData(id) {
    // Determine the appropriate slot based on the existing entries
    
    const advancementData = getDataForId('advancement', id);
    let newSlot = 0;
    let firstSlot = 0;

    if(advancementData.length!=0){
        firstSlot = advancementData[0].slot;
        advancementData.sort((a, b) => a.slot - b.slot);
    }
            
    if (firstSlot !== 0) {
        newSlot = Math.max(...advancementData.map(entry => entry.slot)) + 1;
    }

    // Create the new advancement entry
    let newAdvancement = {
        groupid: id, // Use the provided ID
        slot: newSlot,
        pushtocompetition: 0,
        pushtoposition: 0
    };

    data['advancement'].push(newAdvancement);

    // Map the array to include the index, sort it, and then map it back to remove the index
    data['advancement'] = data['advancement']
    .map((item, index) => ({ ...item, _index: index })) // Add an _index property
    .sort((a, b) => {
        if (!a || !b) {
            console.error(`Encountered undefined entry at index ${a ? a._index : 'undefined'}, ${b ? b._index : 'undefined'}`, a, b);
            return 0; // or handle the case as needed
        }
        if (a.groupid === b.groupid) {
            return a.slot - b.slot;
        } else {
            return a.groupid - b.groupid;
        }
    })
    .map(({ _index, ...rest }) => rest); // Remove the _index property after sorting

    return newAdvancement;
}

function addAdvancementRow(entry, tbody) {
    if (!tbody) {
        console.error('No table body found to add the row.');
        return;
    }

    const row = document.createElement('tr');
    row.dataset.id = entry.groupid; // Set data-id attribute
    row.dataset.slot = entry.slot; // Set data-slot attribute
    row.dataset.type = 'advancement'; // Set data-type attribute

    const createCellWithInput = (value, key) => {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.value = value;
        input.classList.add('tablevalue-input');
        input.dataset.key = key;
        input.dataset.context = 'advancement';
        input.dataset.fieldType = 'standard';
        cell.appendChild(input);
        return { cell, input };
    };

    const { cell: slotCell, input: slotInput } = createCellWithInput(entry.slot, 'slot');
    const { cell: pushCompCell, input: pushCompInput } = createCellWithInput(entry.pushtocompetition, 'pushtocompetition');
    const { cell: pushPosCell, input: pushPosInput } = createCellWithInput(entry.pushtoposition, 'pushtoposition');

    // Event listener for slot change
    slotInput.addEventListener('change', function () {
        if (!slotInput.value || isNaN(slotInput.value)) {
            // If slot is removed or invalid, remove the row and update data
            row.remove(); // Remove the row from the table
            updateAdvancementData(entry.groupid, entry.slot, 'slot', ''); // Clear data
        } else {
            updateAdvancementData(entry.groupid, entry.slot, 'slot', slotInput.value);
            entry.slot = slotInput.value;  // Update the local variable to reflect the change
        }
    });

    // Event listener for push competition change
    pushCompInput.addEventListener('change', function () {
        updateAdvancementData(entry.groupid, entry.slot, 'pushtocompetition', pushCompInput.value);
        entry.pushtocompetition = pushCompInput.value;  // Update the local variable to reflect the change
    });

    // Event listener for push position change
    pushPosInput.addEventListener('change', function () {
        updateAdvancementData(entry.groupid, entry.slot, 'pushtoposition', pushPosInput.value);
        entry.pushtoposition = pushPosInput.value;  // Update the local variable to reflect the change
    });

    row.appendChild(slotCell);
    row.appendChild(pushCompCell);
    row.appendChild(pushPosCell);

    tbody.appendChild(row); // Add the new row to the table body
}

function updateAdvancementData(id, slot, key, value) {
    let parsedValue = parseInt(value, 10);

    // Find the relevant advancement entry
    let entry = data['advancement'].find(item => item.groupid == id && item.slot == parseInt(slot, 10));

    if (!parsedValue) {
        // If slot value is invalid (e.g., cleared), remove the entry and the row
        if (entry) {
            // Remove entry from data
            data['advancement'] = data['advancement'].filter(item => item !== entry);

            // Remove the corresponding row from the table
            const row = document.querySelector(`tr[data-id='${id}'][data-slot='${slot}']`);
            if (row) {
                row.remove();
            }
            console.log(`Entry for groupid ${id}, slot ${slot} removed.`);
        }
        return;
    }

    if (entry) {
        // Update the entry's specific key with the parsed value
        switch (key) {
            case 'slot':
                entry.slot = parsedValue;  // Ensure slot is always an integer
                break;
            case 'pushtocompetition':
                entry.pushtocompetition = parsedValue;  // Ensure pushtocompetition is an integer
                break;
            case 'pushtoposition':
                entry.pushtoposition = parsedValue;  // Ensure pushtoposition is an integer
                break;
            default:
                console.error(`Unknown key: ${key}`);
                return;
        }
    } else {
        console.error(`Advancement entry not found for groupid ${id}, slot ${slot}`);
    }
}