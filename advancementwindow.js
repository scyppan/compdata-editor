function createAdvancementDiv(id) {
    const div = document.createElement('div');
    div.id = 'advancement';
    div.classList.add('standard-div', 'level-content'); // Ensure it has 'level-content' class

    const header = document.createElement('h2');
    header.textContent = `Advancement`;
    div.appendChild(header);

    // Get advancement data for the specified id
    const advancementData = getDataForId('advancement', id);

    // Check for empty advancement data
    if (advancementData.length === 0) {
        const advancementParagraph = document.createElement('p');
        advancementParagraph.textContent = 'No advancement data';
        advancementParagraph.style.fontSize = "12px";
        div.appendChild(advancementParagraph); // Append the message to the main div
        return div; // Return early if there is no advancement data
    }

    // Sort the advancement data by slot
    advancementData.sort((a, b) => a.slot - b.slot);

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

    advancementData.forEach(entry => {
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
            updateAdvancementData(entry.groupid, entry.slot, 'slot', slotInput.value);
            entry.slot = slotInput.value;  // Update the local variable to reflect the change
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
    
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    div.appendChild(table);

    return div;
}

function updateAdvancementData(id, slot, key, value) {

    let parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
        console.error(`Invalid number for ${key}:`, value);
        return;
    }

    // Find the relevant advancement entry
    let entry = data['advancement'].find(item => item.groupid == id && item.slot == parseInt(slot, 10));

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