// Function to organize competitions into a hierarchy while preserving order
function organizeCompetitions(jsonContent) {
    const hierarchy = [];
    const levelStack = [];

    if (jsonContent['compobj.txt']) {
        const compobjLines = jsonContent['compobj.txt'].split('\r\n');
        compobjLines.forEach(line => {
            if (line) {
                const fields = line.split(',');
                const level = parseInt(fields[1]);
                const competition = {
                    id: fields[0],
                    shortName: replaceNames(fields[2].trim()),
                    fullName: replaceNames(fields[3].trim() || fields[2].trim() || "Unnamed Competition"),
                    level: level,
                    children: []
                };

                if (level === 0) {
                    hierarchy.push(competition);
                    levelStack[level] = competition;
                } else {
                    while (levelStack.length > level) {
                        levelStack.pop();
                    }
                    const parent = levelStack[level - 1];
                    if (parent) {
                        parent.children.push(competition);
                        levelStack[level] = competition;
                    }
                }
            }
        });
    }
    return hierarchy;
}

// Function to replace placeholder nation or trophy names with actual names
function replaceNames(name) {
    // Check for nation names
    const nationMatch = name.match(/NationName_(\d+)/);
    if (nationMatch) {
        const nationID = nationMatch[1];
        return nations[nationID] || name;
    }
    // Check for trophy names
    const trophyMatch = name.match(/TrophyName_Abbr15_(\d+)/);
    if (trophyMatch) {
        const trophyID = trophyMatch[1];
        return trophynames[trophyID] || name;
    }
    return name;
}

// Function to display competitions in a hierarchical manner
function displayHierarchy(jsonContent) {
    const hierarchy = organizeCompetitions(jsonContent);
    const competitionList = document.getElementById('competitionList');
    competitionList.innerHTML = ''; // Clear existing list

    hierarchy.forEach(competition => {
        appendCompetition(competition, competitionList, 0);
    });
}

function appendCompetition(competition, parentElement, level) {
    const listItem = document.createElement('li');
    listItem.textContent = `${competition.fullName} (${competition.id})`;
    listItem.classList.add(`level-${level}`);
    listItem.dataset.details = JSON.stringify(competition);
    listItem.addEventListener('click', function(e) {
        e.stopPropagation();
        displayDetails(competition);
        toggleExpandCollapse(this);
    });

    parentElement.appendChild(listItem);

    if (competition.children.length > 0) {
        const childList = document.createElement('ul');
        childList.classList.add('level-list');
        childList.style.display = 'none';
        competition.children.forEach(child => {
            appendCompetition(child, childList, level + 1);
        });
        parentElement.appendChild(childList);
    }
}

function toggleExpandCollapse(element) {
    const nextSibling = element.nextElementSibling;
    if (nextSibling && nextSibling.tagName === 'UL') {
        if (nextSibling.style.display === 'none') {
            nextSibling.style.display = 'block';
        } else {
            nextSibling.style.display = 'none';
        }
    }
}

// Expose the function to load JSON and display hierarchy
function loadAndDisplayHierarchy(jsonContent) {
    displayHierarchy(jsonContent);
}
