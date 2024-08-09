
function createTaskSection(title, taskOptions, tasks) {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('task-section');

    const header = document.createElement('h3');
    header.textContent = title;
    sectionDiv.appendChild(header);

    tasks.forEach(task => {
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task-container');

        const taskRow = document.createElement('div');
        taskRow.classList.add('task-row');

        const taskLeft = document.createElement('div');
        taskLeft.classList.add('task-left');
        taskLeft.style.width = '35%'; // Set width to 35%

        const descriptionSelect = createDescriptionSelectElement(task.description, taskOptions, 'description-select');
        taskLeft.appendChild(descriptionSelect);

        const taskRight = document.createElement('div');
        taskRight.classList.add('task-right');
        taskRight.style.width = '65%'; // Set width to 65%

        const param1Input = createInputElement('number', task.param1, 'input');
        const param2Input = createInputElement('number', task.param2, 'input');
        const param3Input = createInputElement('number', task.param3, 'input');
        const param4Input = createInputElement('number', task.param4, 'input');

        taskRight.appendChild(createCell(param1Input));
        taskRight.appendChild(createCell(param2Input));
        taskRight.appendChild(createCell(param3Input));
        taskRight.appendChild(createCell(param4Input));

        taskRow.appendChild(taskLeft);
        taskRow.appendChild(taskRight);

        descriptionSelect.addEventListener('change', () => {
            updateParamLabels(descriptionSelect.value, param1Input, param2Input, param3Input, param4Input);
        });

        // Initial call to set labels and visibility based on the current description
        updateParamLabels(task.description, param1Input, param2Input, param3Input, param4Input);

        taskContainer.appendChild(taskRow);
        sectionDiv.appendChild(taskContainer);
    });

    return sectionDiv;
}

function createTasksDiv(id) {
    const div = document.createElement('div');
    div.id = 'tasks';
    div.classList.add('standard-div');

    const header = document.createElement('h2');
    header.textContent = `Tasks - ${getTrophyNameById(id)}`;
    div.appendChild(header);

    const tasksData = getDataForId('tasks', id);

    // Define start and end tasks
    const startTasks = [
        'FillWithTeam', 'FillFromCompTable', 'FillChampionsCupSeeded',
        'FillFromSpecialTeamsWithNation', 'FillFromLeagueMaxFromCountry',
        'FillFromLeagueMaxFromCountryShadowed', 'FillFromCompTablePosBackupSameLeague',
        'FillFromCompTableBackupLeague', 'FillFromLeagueInOrder', 'FillFromLeague',
        'ClearLeagueStats', 'FillFromCompTableBackup'
    ];

    const endTasks = [
        'UpdateTable', 'UpdateMultiGroupLeagueStats', 'UpdateLeagueStats'
    ];

    // Create Start Tasks section
    const startSection = createTaskSection('Start Tasks', startTasks, tasksData.filter(task => startTasks.includes(task.description)));
    div.appendChild(startSection);

    // Create End Tasks section
    const endSection = createTaskSection('End Tasks', endTasks, tasksData.filter(task => endTasks.includes(task.description)));
    div.appendChild(endSection);

    return div;
}

function createTaskSection(title, taskOptions, tasks) {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('task-section');

    const header = document.createElement('h3');
    header.textContent = title;
    sectionDiv.appendChild(header);

    tasks.forEach(task => {
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task-container');

        const taskRow = document.createElement('div');
        taskRow.classList.add('task-row');

        const taskLeft = document.createElement('div');
        taskLeft.classList.add('task-left');
        taskLeft.style.width = '35%'; // Set width to 35%

        const descriptionSelect = createDescriptionSelectElement(task.description, taskOptions, 'description-select');
        taskLeft.appendChild(descriptionSelect);

        const taskRight = document.createElement('div');
        taskRight.classList.add('task-right');
        taskRight.style.width = '65%'; // Set width to 65%

        const param1Input = createInputElement('number', task.param1, 'input');
        const param2Input = createInputElement('number', task.param2, 'input');
        const param3Input = createInputElement('number', task.param3, 'input');
        const param4Input = createInputElement('number', task.param4, 'input');

        taskRight.appendChild(createCell(param1Input));
        taskRight.appendChild(createCell(param2Input));
        taskRight.appendChild(createCell(param3Input));
        taskRight.appendChild(createCell(param4Input));

        taskRow.appendChild(taskLeft);
        taskRow.appendChild(taskRight);

        descriptionSelect.addEventListener('change', () => {
            updateTaskData(task, 'description', descriptionSelect.value);
            updateParamLabels(descriptionSelect.value, param1Input, param2Input, param3Input, param4Input);
        });

        // Event listeners for param changes
        param1Input.addEventListener('change', () => {
            updateTaskData(task, 'param1', param1Input.value);
        });
        param2Input.addEventListener('change', () => {
            updateTaskData(task, 'param2', param2Input.value);
        });
        param3Input.addEventListener('change', () => {
            updateTaskData(task, 'param3', param3Input.value);
        });
        param4Input.addEventListener('change', () => {
            updateTaskData(task, 'param4', param4Input.value);
        });

        // Initial call to set labels based on the current description
        updateParamLabels(task.description, param1Input, param2Input, param3Input, param4Input);

        taskContainer.appendChild(taskRow);
        sectionDiv.appendChild(taskContainer);
    });

    return sectionDiv;
}

function createCell(element) {
    const cell = document.createElement('div');
    cell.classList.add('task-cell');
    cell.appendChild(element);
    return cell;
}

function createDescriptionSelectElement(selectedValue, options, className) {
    const select = document.createElement('select');
    select.classList.add(className);

    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        if (option === selectedValue) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    return select;
}

function createInputElement(type, value, className) {
    const input = document.createElement('input');
    input.type = type;
    input.value = value;
    input.classList.add(className);
    return input;
}

function updateParamLabels(description, param1Input, param2Input, param3Input, param4Input) {
    // Reset all inputs to default state (show all)
    showInputs(param1Input, param2Input, param3Input, param4Input);

    switch (description) {
        case 'FillFromSpecialTeamsWithNation':
            param1Input.title = 'Param1';
            param1Input.placeholder = 'Param1';
            param2Input.title = 'Param2';
            param2Input.placeholder = 'Param2';
            param3Input.title = 'Param3';
            param3Input.placeholder = 'Param3';
            hideInputs(param4Input);
        break;
        case 'FillWithTeam':
            param1Input.title = 'Group Line ID';
            param1Input.placeholder = 'Enter Group Line ID';
            param2Input.title = 'Task Order Number';
            param2Input.placeholder = 'Enter Task Order Number';
            param3Input.title = 'Team ID';
            param3Input.placeholder = 'Enter Team ID';
            hideInputs(param4Input);
            break;
        case 'UpdateTable':
            param1Input.title = 'Competition Object ID';
            param1Input.placeholder = 'Enter Competition Object ID';
            param2Input.title = 'Group Object ID';
            param2Input.placeholder = 'Enter Group Object ID';
            param3Input.title = 'Group Position';
            param3Input.placeholder = 'Enter Group Position';
            param4Input.title = 'Team Position';
            param4Input.placeholder = 'Enter Team Position';
            break;
            case 'FillFromLeagueInOrder':
            case 'FillFromLeague':
            param1Input.title = 'Source Competition';
            param1Input.placeholder = 'Enter Source Competition';
            param2Input.title = 'Source Position';
            param2Input.placeholder = 'Enter Source Position';
            hideInputs(param3Input, param4Input);
            break;
            case 'FillFromCompTable':
                param1Input.title = 'Group Line ID';
                param1Input.placeholder = 'Enter Group Line ID';
                param2Input.title = 'Competition Object ID';
                param2Input.placeholder = 'Enter Competition Object ID';
                param3Input.title = 'Number of Teams';
                param3Input.placeholder = 'Enter Number of Teams';
                hideInputs(param4Input);
            break;            
        case 'FillChampionsCupSeeded':
        
        case 'FillFromLeagueMaxFromCountry':
        case 'FillFromLeagueMaxFromCountryShadowed':
        case 'FillFromCompTablePosBackupSameLeague':
        case 'FillFromCompTableBackupLeague':
        case 'FillFromCompTableBackup':
            param1Input.title = 'Source Competition';
            param1Input.placeholder = 'Enter Source Competition';
            param2Input.title = 'Source Position';
            param2Input.placeholder = 'Enter Source Position';
            param3Input.title = 'Destination Competition';
            param3Input.placeholder = 'Enter Destination Competition';
            param4Input.title = 'Destination Position';
            param4Input.placeholder = 'Enter Destination Position';
            break;
        case 'ClearLeagueStats':
        case 'UpdateMultiGroupLeagueStats':
        case 'UpdateLeagueStats':
            param1Input.title = 'Competition ID';
            param1Input.placeholder = 'Enter Competition ID';
            param2Input.title = 'League ID';
            param2Input.placeholder = 'Enter League ID';
            hideInputs(param3Input, param4Input);
            break;
        default:
            param1Input.title = 'Param 1';
            param1Input.placeholder = 'Enter Param 1';
            param2Input.title = 'Param 2';
            param2Input.placeholder = 'Enter Param 2';
            param3Input.title = 'Param 3';
            param3Input.placeholder = 'Enter Param 3';
            param4Input.title = 'Param 4';
            param4Input.placeholder = 'Enter Param 4';
            break;
    }

    adjustInputWidths(param1Input, param2Input, param3Input, param4Input);
}

function hideInputs(...inputs) {
    inputs.forEach(input => {
        input.style.display = 'none';
        input.parentElement.style.display = 'none'; // Hide the parent element as well to avoid layout issues
    });
}

function showInputs(...inputs) {
    inputs.forEach(input => {
        input.style.display = 'inline-block';
        input.parentElement.style.display = 'inline-block'; // Show the parent element
    });
}

function adjustInputWidths(...inputs) {
    const visibleInputs = inputs.filter(input => input.style.display !== 'none');
    const totalWidth = 100; // Total width in percentage
    const widthPerInput = totalWidth / visibleInputs.length;

    visibleInputs.forEach(input => {
        input.style.width = `${widthPerInput}%`;
    });
}

function updateTaskData(task, key, value) {
    // Update the specific key in the task object
    switch (key) {
        case 'description':
            task.description = value; // Update the description
            updateTaskDataForHiddenFields(task); // Update the hidden fields based on the new description
            break;
        case 'param1':
            task.param1 = parseInt(value, 10) || 0;
            break;
        case 'param2':
            task.param2 = parseInt(value, 10) || 0;
            break;
        case 'param3':
            task.param3 = parseInt(value, 10) || 0;
            break;
        case 'param4':
            task.param4 = parseInt(value, 10) || 0;
            break;
        default:
            console.error(`Unknown key: ${key}`);
    }
}

function updateTaskDataForHiddenFields(task) {
    switch (task.description) {
        case 'FillFromSpecialTeamsWithNation':
            task.param4 = 0;
            break;
        case 'FillWithTeam':
            task.param4 = 0;
            break;
        case 'FillFromLeagueInOrder':
        case 'FillFromLeague':
            task.param3 = 0;
            task.param4 = 0;
            break;
        case 'FillFromCompTable':
            task.param4 = 0;
            break;
        case 'ClearLeagueStats':
        case 'UpdateMultiGroupLeagueStats':
        case 'UpdateLeagueStats':
            task.param3 = 0;
            task.param4 = 0;
            break;
        // Add other cases as needed
    }
}

