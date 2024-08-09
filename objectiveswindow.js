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
            const input = document.createElement('input');
            input.type = type;
            input.value = value;
            input.classList.add('tablevalue-input');
            input.dataset.key = key;
            input.dataset.context = 'objectives';
            cell.appendChild(input);
            return { cell, input };
        };

        const { cell: objectiveCell, input: objectiveInput } = createCellWithInput('text', entry.objective, 'objective');
        const { cell: valueCell, input: valueInput } = createCellWithInput('number', entry.value, 'value');

        // Event listener for objective change
        objectiveInput.addEventListener('change', function () {
            updateObjectivesData(entry.id, 'objective', objectiveInput.value);
            entry.objective = objectiveInput.value;  // Update the local variable to reflect the change
        });

        // Event listener for value change
        valueInput.addEventListener('change', function () {
            updateObjectivesData(entry.id, 'value', valueInput.value);
            entry.value = valueInput.value;  // Update the local variable to reflect the change
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

