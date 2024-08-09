function createStandingsDiv(id) {
    const div = document.createElement('div');
    div.id = 'standings';
    div.classList.add('standard-div', 'level-content'); // Ensure it has 'level-content' class

    const header = document.createElement('h2');
    header.textContent = `Standings`;
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
    input.min = 1;
    input.dataset.id = id;
    input.dataset.key = 'numberOfTeams';
    input.dataset.context = 'standings';
    input.dataset.fieldType = 'standard';

    // Event listener for changes in the number of teams
    input.addEventListener('change', function () {
        updateStandingsData(id, parseInt(input.value, 10));
    });

    numberOfTeamsDiv.appendChild(input);
    div.appendChild(numberOfTeamsDiv);

    return div;
}

function updateStandingsData(id, numberOfTeams) {
    // Get the current standings data for the specified id
    let standingsData = data['standings'].filter(item => item.id == id);

    // Adjust the number of entries in the standings data
    if (standingsData.length > numberOfTeams) {
        // If there are too many entries, remove the excess
        data['standings'] = data['standings'].filter(item => !(item.id == id && item.position >= numberOfTeams));
    } else if (standingsData.length < numberOfTeams) {
        // If there are too few entries, add the missing ones
        for (let i = standingsData.length; i < numberOfTeams; i++) {
            data['standings'].push({ id: id, position: i });
        }
    }

    // Sort the standings data by id and then by position
    data['standings'].sort((a, b) => {
        if (a.id === b.id) {
            return a.position - b.position;
        }
        return a.id - b.id;
    });
}


