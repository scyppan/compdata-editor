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