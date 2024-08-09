function createObjectivesDiv(id) {
    // Get objectives data for the specified id
    const objectivesData = getDataForId('objectives', id);

    const div = document.createElement('div');
    div.id = 'objectives';
    div.classList.add('standard-div', 'level-content'); // Ensure it has 'level-content' class

    const header = document.createElement('h2');
    header.innerHTML = `Objectives - ${getCompetitionNameById(id)}`;
    div.appendChild(header);

    if (objectivesData.length === 0) {
        const objectivesParagraph = document.createElement('p');
        objectivesParagraph.textContent = 'No objectives';
        objectivesParagraph.style.fontSize = "12px";
        header.appendChild(objectivesParagraph);
        return div;
    }

    // Create table to display objectives data
    const table = document.createElement('table');
    table.classList.add('window-tables');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Objective', 'Value'].forEach(title => {
        const th = document.createElement('th');
        th.textContent = title;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    objectivesData.forEach(entry => {
        const row = document.createElement('tr');
        row.dataset.id = entry.id; // Set data-id attribute
        row.dataset.type = 'objectives'; // Set data-type attribute

        const createCellWithInput = (type, value, key) => {
            const cell = document.createElement('td');
            let input;

            if (type === 'select') {
                input = document.createElement('select');
                const objectivesOptions = [
                    'REACH_GROUPS',
                    'REACH_QUARTER_FINALS',
                    'REACH_SEMI_FINALS',
                    'CHAMPION',
                    'REACH_FINALS',
                    'REACH_KNOCKOUT',
                    'PRIMARY_REGIONAL_CUP_SLOT',
                    'ANY_REGIONAL_CUP_SLOT',
                    'MID_TABLE',
                    'AVOID_LOWLY_FINISH',
                    'FIGHT_FOR_TITLE',
                    'HIGH_FINISH',
                    'REACH_ROUND_OF_16',
                    'SECONDARY_REGIONAL_CUP_SLOT',
                    'AVOID_RELEGATION',
                    'PROMOTION',
                    'FIGHT_FOR_PROMOTION',
                    'REACH_PLAYOFFS'
                ];

                objectivesOptions.forEach(optionValue => {
                    const option = document.createElement('option');
                    option.value = optionValue;
                    option.textContent = optionValue;
                    if (optionValue === value) {
                        option.selected = true;
                    }
                    input.appendChild(option);
                });
            } else {
                input = document.createElement('input');
                input.type = type;
                input.value = value;
            }

            input.classList.add('tablevalue-input');
            input.dataset.key = key;
            input.dataset.context = 'objectives';
            cell.appendChild(input);
            return { cell, input };
        };

        const { cell: objectiveCell, input: objectiveInput } = createCellWithInput('select', entry.objective, 'objective');
        const { cell: valueCell, input: valueInput } = createCellWithInput('number', entry.value, 'value');

        // Event listener for objective change
        objectiveInput.addEventListener('change', function () {
            updateObjectivesData(entry.id, 'objective', objectiveInput.value);
            entry.objective = objectiveInput.value;  // Update the local variable to reflect the change
        });

        // Event listener for value change
        valueInput.addEventListener('change', function () {
            if (!valueInput.value) {
                // If value is deleted (empty), remove the row and update the data
                row.remove(); // Remove the row from the table
                deleteObjectiveData(entry.id); // Remove the corresponding data entry
            } else {
                updateObjectivesData(entry.id, 'value', valueInput.value);
                entry.value = valueInput.value;  // Update the local variable to reflect the change
            }
        });

        row.appendChild(objectiveCell);
        row.appendChild(valueCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    div.appendChild(table);

    return div;
}

function updateObjectivesData(id, key, value) {
    // Find the relevant objective entry
    let entry = data['objectives'].find(item => item.id == id);

    if (entry) {
        switch (key) {
            case 'objective':
                entry.objective = value;  // Objectives are likely to remain strings
                break;
            case 'value':
                entry.value = parseInt(value, 10);  // Ensure value is always an integer
                if (isNaN(entry.value)) {
                    console.error(`Invalid number for value: ${value}`);
                    return;
                }
                break;
            default:
                console.error(`Unknown key: ${key}`);
                return;
        }

    } else {
        console.error(`Objective entry not found for id ${id}`);
    }
}

function deleteObjectiveData(id) {
    // Find the index of the relevant objective entry
    const index = data['objectives'].findIndex(item => item.id == id);

    if (index !== -1) {
        // Remove the entry from the array
        data['objectives'].splice(index, 1);
        console.log(`Objective entry with id ${id} has been deleted.`);
    } else {
        console.error(`Objective entry not found for id ${id}`);
    }
}