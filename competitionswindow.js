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

function createStagesListDiv(competitionId) {
    const div = document.createElement('div');
    div.id = 'stagesList';
    div.classList.add('standard-div');

    const header = document.createElement('h2');
    header.textContent = 'Stages List';
    div.appendChild(header);

    // Get the stages for the specified competition
    const stages = getStagesForCompetition(competitionId);

    const ul = document.createElement('ul');
    stages.forEach(stage => {
        const li = document.createElement('li');
        li.textContent = stage.name;

        // Create a nested list for child groups
        const groupsUl = document.createElement('ul');
        stage.groups.forEach(group => {
            const groupLi = document.createElement('li');
            groupLi.textContent = group.name;
            groupsUl.appendChild(groupLi);
        });

        li.appendChild(groupsUl);
        ul.appendChild(li);
    });

    div.appendChild(ul);

    // Add input and buttons for creating and deleting stages
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter new stage name';
    div.appendChild(input);

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Stage';
    addButton.onclick = () => {
        const newStageName = input.value.trim();
        if (newStageName) {
            addNewStage(competitionId, newStageName);
            buildwindow4(competitionId); // Rebuild the window to reflect the change
        }
    };
    div.appendChild(addButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Selected Stage';
    deleteButton.onclick = () => {
        const selectedStage = getSelectedStage(); // Assume this function gets the selected stage
        if (selectedStage) {
            deleteStage(competitionId, selectedStage);
            buildwindow4(competitionId); // Rebuild the window to reflect the change
        }
    };
    div.appendChild(deleteButton);

    return div;
}

function createGroupListDiv(stageId) {

    const div = document.createElement('div');
    div.id = 'groupList';
    div.classList.add('standard-div');

    const header = document.createElement('h2');
    header.textContent = 'Groups List';
    div.appendChild(header);

    // Get and display the groups for the specified stage
    const groups = getGroupsForStage(stageId);

    console.log("groups", groups);

    groups.forEach(group => {
        const groupElement = document.createElement('div');
        groupElement.textContent = group.longname.trim() || group.shortname; // Use longname or shortname if longname is empty
        div.appendChild(groupElement);
    });

    // Create an input field to add a new group
    const groupInput = document.createElement('input');
    groupInput.type = 'text';
    groupInput.placeholder = 'Write a group name to add a group';
    groupInput.classList.add('input');
    groupInput.style.marginTop = "10px"; // Add some space before the input field
    div.appendChild(groupInput);

    // Event listener for adding a new group on Enter key press
    groupInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const newGroupName = groupInput.value.trim();
            if (newGroupName) {
                // Call a function to add the new group to the data structure
                addNewGroup(stageId, newGroupName);
                groupInput.value = ''; // Clear the input field
            } else {
                alert("Please enter a valid group name.");
            }
        }
    });

    return div;
}

function getStagesForCompetition(competitionId) {
    const stages = [];
    
    // Traverse the data['compobj'] to find stages (level 4) under the given competition (level 3)
    data['compobj'].forEach(obj => {
        if (obj.level == 4 && obj.parent == competitionId) {
            // Find groups (level 5) that are children of this stage
            const groups = getGroupsForStage(obj.line);
            stages.push({
                id: obj.line,
                name: obj.longname,
                groups: groups
            });
        }
    });
    
    return stages;
}

function getGroupsForStage(stageId) {
    // Filter the compobj data to find groups (level 5) under the given stage (level 4)
    const groups = data['compobj'].filter(entry => entry.level == 5 && entry.parent == stageId);
    
    console.log(groups); // For debugging, to see the filtered groups
    
    return groups;
}

// Function to add a new stage
function addNewStage(parent, stageName) {
    // Placeholder: Implement the logic to add a new stage to compobj and update the UI
    console.log(`Add new stage: ${stageName} under parent: ${parent}`);
}

function addNewGroup(stageId, groupName){
    // Find the last group within the specified stage
    let lastGroupIndex = -1;
    let lastLineNumber = -1;

    data['compobj'].forEach((obj, index) => {
        if (obj.parent === stageId && obj.level === 5) {
            lastGroupIndex = index;
            lastLineNumber = obj.line;
        }
    });

    // Determine the new line number for the group
    const newLine = lastLineNumber + 1;

    // Create the new group entry
    const newGroup = {
        line: newLine,            // New line number
        level: 5,                 // Level for groups
        shortname: groupName, // Shortname, you can modify it based on your naming convention
        longname: groupName,      // The group name provided by the user
        parent: stageId,          // Parent ID is the stage ID
        new: true
        // Additional fields as necessary
    };

    // If there are no existing groups, insert after the stage itself
    if (lastGroupIndex === -1) {
        // Find the index of the stage
        const stageIndex = data['compobj'].findIndex(obj => obj.line === stageId);
        data['compobj'].splice(stageIndex + 1, 0, newGroup);
    } else {
        // Insert the new group after the last group in the stage
        data['compobj'].splice(lastGroupIndex + 1, 0, newGroup);
    }

    // Create a new list item and append it to the group list in the UI
    let li = getCompetitionLiElement(newGroup);
    const groupList = document.getElementById('groupList');
    
    // Append the new list item to the list
    if (groupList.children.length > 0) {
        groupList.insertBefore(li, groupList.lastElementChild);
    } else {
        groupList.appendChild(li);
    }

    updateCompObj(newGroup, 1); 
    updateAllReferences(newLine, 1);
    let expandedstate = getExpandedState();
    organizeCompetitions(data);
    restoreExpandedState(expandedstate);
}

// Function to delete a selected stage
function deleteStage(stageId) {
    // Placeholder: Implement the logic to delete a stage from compobj and update the UI
    console.log(`Delete stage with ID: ${stageId}`);
}

// Function to select a stage (highlighting and storing the selected ID)
function selectStage(stageElement) {
    // Clear previous selection
    const prevSelected = document.querySelector('.stage-selected');
    if (prevSelected) {
        prevSelected.classList.remove('stage-selected');
    }

    // Highlight the selected stage
    stageElement.classList.add('stage-selected');
}

// Function to get the currently selected stage ID
function getSelectedStageId() {
    const selectedElement = document.querySelector('.stage-selected');
    return selectedElement ? selectedElement.dataset.stageId : null;
}

function getCompetitionsList(parent) {
    const competitionsList = document.createElement('ul');
    data["compobj"].forEach(comp => {
        if (comp.level === 3 && comp.parent === parent) { // Ensure it's a level 3 child of the specified parent
            const listItem = getCompetitionLiElement(comp); // Use the modular function
            competitionsList.appendChild(listItem);
        }
    });
    return competitionsList;
}

function getCompetitionLiElement(comp) {
    const listItem = document.createElement('li');
    listItem.textContent = replaceNames(
        comp.longname && comp.longname.trim() ? comp.longname.trim() : (comp.shortname ? comp.shortname.trim() : "Unnamed Competition"),
        data["compobj"]
    );
    return listItem;
}

