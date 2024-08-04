function displayDetails(competition) {
    const level = competition.level;
    const contentDivId = `level-${level}-content`;
    console.log(contentDivId);
    const contentDiv = document.getElementById(contentDivId);

    if (contentDiv) {
        // Hide and clear all content divs
        for (let i = 0; i <= 5; i++) {
            const div = document.getElementById(`level-${i}-content`);
            if (div) {
                div.style.display = 'none';
                div.innerHTML = '';
            }
        }
        
        // Display the selected content div
        contentDiv.style.display = 'block';
        
        // Call the appropriate UI function based on the level
        if (level === 0) {
            displayLevel0UI(contentDiv, competition);
        } else if (level === 1) {
            displayLevel1UI(contentDiv, competition);
        } else {
            // For other levels, just display the competition details
            contentDiv.innerHTML = `<pre>${JSON.stringify(competition, null, 2)}</pre>`;
        }
    } else {
        console.error(`No element found for ${contentDivId}`);
    }
}

function createNewInternationalCompetition(data) {
    let newId = getNextAvailableId(data['compobj.txt']);
    let newCompetition = {
        id: newId,
        shortName: "New Competition",
        fullName: "New International Competition",
        level: 3, 
        parent: "0", // Assuming "FIFA" has ID "0"
        children: []
    };

    // Parse the existing compobj.txt data
    const compobjLines = data['compobj.txt'].split('\r\n');
    
    // Add the new competition to the data
    compobjLines.push(`${newCompetition.id},${newCompetition.level},${newCompetition.shortName},${newCompetition.fullName},${newCompetition.parent}`);
    
    // Update the IDs for all subsequent competitions
    let idCounter = parseInt(newCompetition.id) + 1;
    for (let i = parseInt(newCompetition.id) + 1; i < compobjLines.length; i++) {
        let fields = compobjLines[i].split(',');
        fields[0] = idCounter.toString();
        compobjLines[i] = fields.join(',');
        idCounter++;
    }
    
    // Update the compobj.txt data in the data object
    data['compobj.txt'] = compobjLines.join('\r\n');
    
    // Find the parent in the hierarchy and add the new competition
    let parentCompetition = data.hierarchy.find(comp => comp.id === "0");
    if (parentCompetition) {
        parentCompetition.children.push(newCompetition);
    }
    
    console.log(data['compobj.txt']); // For debugging
}

function displayLevel0UI(contentDiv, competition) {
    contentDiv.innerHTML = `<pre>${JSON.stringify(competition, null, 2)}</pre>`;
    
    // Add the "Create New International Competition" button for level 0 competitions
    const newCompButton = document.createElement('button');
    newCompButton.textContent = "Create New International Competition";
    newCompButton.addEventListener('click', function() {
        createNewInternationalCompetition(data);
        displayHierarchy(data); // Refresh the display after adding new competition
    });
    contentDiv.prepend(newCompButton);
}

function displayLevel1UI(contentDiv, competition) {
    contentDiv.innerHTML = `<pre>${JSON.stringify(competition, null, 2)}</pre>`;
    
    // Add any other UI elements specific to level 1 competitions here
    // Example: Add a button for some level 1 specific action
    const level1ActionButton = document.createElement('button');
    level1ActionButton.textContent = "Level 1 Action";
    level1ActionButton.addEventListener('click', function() {
        // Perform some action for level 1 competition
        console.log(`Action performed for competition ${competition.id}`);
    });
    contentDiv.appendChild(level1ActionButton);
}