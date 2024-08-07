function parentDiv() {
    const container = document.createElement('div');
    container.id = 'windowcontainer';

    const leftDiv = document.createElement('div');
    leftDiv.id = 'leftDiv';
    leftDiv.classList.add('window-left');

    const rightDiv = document.createElement('div');
    rightDiv.id = 'rightDiv';
    rightDiv.classList.add('window-right');

    container.appendChild(leftDiv);
    container.appendChild(rightDiv);

    return container;
}

function createSettingsDiv(competitionid) {
    const div = document.createElement('div');
    div.id = 'settings';
    div.classList.add('standard-div');

    const header = document.createElement('h2');
    header.textContent = 'Settings';
    div.appendChild(header);

    // Fetch settings for the specified competitionid
    const settings = getDataForId('settings',competitionid);

    // Create table to display settings
    const table = document.createElement('table');
    table.classList.add('window-tables'); // Add the window-tables class
    const tbody = document.createElement('tbody');

    settings.forEach(setting => {
        const row = document.createElement('tr');
        const tagCell = document.createElement('td');
        const valueCell = document.createElement('td');
        valueCell.classList.add('tablevalue'); // Add the tablevalue class

        tagCell.textContent = setting.tag;

        // Create a numeric input for the value cell
        const input = document.createElement('input');
        input.type = 'number';
        input.value = setting.value !== null ? setting.value : 0; // Default to 0 if value is null
        input.classList.add('tablevalue-input');

        valueCell.appendChild(input);
        row.appendChild(tagCell);
        row.appendChild(valueCell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    div.appendChild(table);

    return div;
}

function createWeatherDiv(id) {
    const div = document.createElement('div');
    div.id = 'weather';
    div.classList.add('standard-div');

    const header = document.createElement('h2');
    header.textContent = 'Weather';
    div.appendChild(header);

    // Get weather data for the specified line
    const weatherData = getDataForId('weather',id);

    // Create a table for each month's weather data
    const months = {};
    weatherData.forEach(entry => {
        if (!months[entry.month]) {
            months[entry.month] = [];
        }
        months[entry.month].push(entry);
    });

    Object.keys(months).forEach(month => {
        // Create a table for each month
        const table = document.createElement('table');
        table.classList.add('groupedtables', 'window-tables');
        const tbody = document.createElement('tbody');

        months[month].forEach(entry => {
            const dataPairs = [
                { title: 'Month', value: entry.month, readOnly: true },
                { title: 'Chance Dry', value: entry.chancedry },
                { title: 'Chance Rain', value: entry.chancerain },
                { title: 'Chance Snow', value: entry.chancesnow },
                { title: 'Chance Overcast', value: entry.chanceovercast },
                { title: 'Sunset', value: entry.sunset },
                { title: 'Nighttime', value: entry.nighttime }
            ];

            dataPairs.forEach(dataPair => {
                const row = document.createElement('tr');
                
                const titleCell = document.createElement('td');
                titleCell.textContent = dataPair.title;
                row.appendChild(titleCell);
                
                const valueCell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.value = dataPair.value;
                input.classList.add('tablevalue-input');
                if (dataPair.readOnly) {
                    input.readOnly = true; // Make the month input read-only
                }
                valueCell.appendChild(input);
                row.appendChild(valueCell);
                
                tbody.appendChild(row);
            });
        });

        table.appendChild(tbody);
        div.appendChild(table);
    });

    return div;
}

function createAdvancementDiv(id) {
    const div = document.createElement('div');
    div.id = 'advancement';
    div.classList.add('standard-div');

    const header = document.createElement('h2');
    header.textContent = `Advancement - ${getCompetitionNameById(id)}`;
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

    // Create table to display advancement data
    const table = document.createElement('table');
    table.classList.add('window-tables');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Pull Comp', 'Pull Pos', 'Push Comp', 'Push Pos'].forEach(title => {
        const th = document.createElement('th');
        th.textContent = title;
        th.style.fontSize = 'small'; // Make the font size small for headers
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    advancementData.forEach(entry => {console.log(typeof entry.pullfromcompetition);
        const row = document.createElement('tr');

        const pullCompCell = document.createElement('td');
        const pullCompInput = document.createElement('input');
        pullCompInput.type = 'number'; // Changed to text to match the value being set
        pullCompInput.value = entry.pullfromcompetition;
        pullCompInput.classList.add('tablevalue-input');
        pullCompCell.appendChild(pullCompInput);

        const pullPosCell = document.createElement('td');
        const pullPosInput = document.createElement('input');
        pullPosInput.type = 'number';
        pullPosInput.value = entry.pullfromposition;
        pullPosInput.classList.add('tablevalue-input');
        pullPosCell.appendChild(pullPosInput);

        const pushCompCell = document.createElement('td');
        const pushCompInput = document.createElement('input');
        pushCompInput.type = 'number'; // Changed to text to match the value being set
        pushCompInput.value = entry.pushtocompetition;
        pushCompInput.classList.add('tablevalue-input');
        pushCompCell.appendChild(pushCompInput);

        const pushPosCell = document.createElement('td');
        const pushPosInput = document.createElement('input');
        pushPosInput.type = 'number';
        pushPosInput.value = entry.pushtoposition;
        pushPosInput.classList.add('tablevalue-input');
        pushPosCell.appendChild(pushPosInput);

        row.appendChild(pullCompCell);
        row.appendChild(pullPosCell);
        row.appendChild(pushCompCell);
        row.appendChild(pushPosCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    div.appendChild(table);

    return div;
}

function createObjectivesDiv(id) {

    // Get objectives data for the specified id
    const objectivesData = getDataForId('objectives', id);

    const div = document.createElement('div');
    div.id = 'objectives';
    div.classList.add('standard-div');

    const header = document.createElement('h2');
    header.innerHTML = `Objectives - ${getCompetitionNameById(id)}`;
    div.appendChild(header);

    if(objectivesData.length===0){
        const objectivesParagraph = document.createElement('p');
        objectivesParagraph.textContent = 'No objectives';
        objectivesParagraph.style.fontSize="12px";
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

        const objectiveCell = document.createElement('td');
        const objectiveInput = createInputElement('text', entry.id, 'tablevalue-input');
        objectiveCell.appendChild(objectiveInput);

        const valueCell = document.createElement('td');
        const valueInput = createInputElement('number', entry.value, 'tablevalue-input');
        valueCell.appendChild(valueInput);

        row.appendChild(objectiveCell);
        row.appendChild(valueCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    div.appendChild(table);

    return div;
}

function createStandingsDiv(id) {
    const div = document.createElement('div');
    div.id = 'standings';
    div.classList.add('standard-div');

    const header = document.createElement('h2');
    header.textContent = `Standings - ${getCompetitionNameById(id)} (${id})`;
    div.appendChild(header);

    // Get standings data for the specified id
    const standingsData = getDataForId('standings', id);

    // Count the number of entries
    const numberOfTeams = standingsData.length;

    // Create a div to display the number of teams
    const numberOfTeamsDiv = document.createElement('div');
    numberOfTeamsDiv.style.display = 'flex';
    numberOfTeamsDiv.style.alignItems = 'center';

    const label = document.createElement('span');
    label.textContent = 'Number of Teams:';
    label.style.marginRight = '10px'; // Add some space between the label and the input
    numberOfTeamsDiv.appendChild(label);

    const input = document.createElement('input');
    input.type = 'number';
    input.value = numberOfTeams;
    input.classList.add('tablevalue-input');
    input.style.width = '100px'; // Set a specific width for the input
    numberOfTeamsDiv.appendChild(input);

    div.appendChild(numberOfTeamsDiv);

    return div;
}

function createCompetitionsListDiv(parent) {
    const div = document.createElement('div');
    div.id = 'competitionsList';
    div.classList.add('standard-div');

    const header = document.createElement('h2');
    header.textContent = 'Competitions List';
    div.appendChild(header);

    // Get and append the competitions list for the specified parent
    const competitionsList = getCompetitionsList(parent);
    div.appendChild(competitionsList);

    return div;
}

function createScheduleDiv(id) {
    const div = document.createElement('div');
    div.id = 'schedule';
    div.classList.add('standard-div');

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
        table.classList.add('window-tables');
        table.classList.add('groupedtables');

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

            const dayCell = document.createElement('td');
            const dayInput = createInputElement('number', entry.day, 'tablevalue-input');
            dayCell.appendChild(dayInput);

            const minCell = document.createElement('td');
            const minInput = createInputElement('number', entry.min, 'tablevalue-input');
            minCell.appendChild(minInput);

            const maxCell = document.createElement('td');
            const maxInput = createInputElement('number', entry.max, 'tablevalue-input');
            maxCell.appendChild(maxInput);

            const timeCell = document.createElement('td');
            const timeInput = createInputElement('number', entry.time, 'tablevalue-input');
            timeCell.appendChild(timeInput);

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