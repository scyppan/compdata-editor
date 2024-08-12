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
    
    // Create a container div for the groups list
    const groupsDiv = document.createElement('div');
    groupsDiv.id = 'groupList';
    groupsDiv.classList.add('standard-div');

    // Create and append the header
    const header = document.createElement('h2');
    header.textContent = 'Groups List';
    groupsDiv.appendChild(header);

    // Iterate over the groups and create div elements for each
    groups.forEach(group => {
        const groupDiv = createGroupDivElement(group);
        groupsDiv.appendChild(groupDiv);
    });

    console.log(groups); // For debugging, to see the filtered groups
    
    return groupsDiv;
}

function createGroupDivElement(group) {
    const divElement = document.createElement('div');
    divElement.classList.add('group-item');
    divElement.dataset.groupid = group.line;
    divElement.dataset.name = group.longname && group.longname.trim() ? group.longname.trim() : (group.shortname ? group.shortname.trim() : "Unnamed Group");
    
    // Create the text node (editable)
    const nameToDisplay = replaceNames(divElement.dataset.name, data["compobj"]);
    const textNode = document.createElement('span');
    textNode.textContent = nameToDisplay;
    textNode.contentEditable = false; // Disable editing by default
    divElement.appendChild(textNode);

    // Create the delete button
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '⊖'; // Use the correct HTML entity for a minus sign inside a circle
    deleteButton.style.display = 'none'; // Hidden by default
    divElement.appendChild(deleteButton);

    // Event listener to make the text editable and show the delete button
    divElement.addEventListener('click', function() {
        textNode.contentEditable = true; 
        textNode.focus();
        deleteButton.style.display = 'inline'; // Show delete button
    });

    // Event listener for the delete button
    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering the divElement click event
        const groupId = parseInt(divElement.dataset.groupid, 10);
        removeGroup(groupId, divElement); // Pass the divElement to remove it later
    });

    // Handle saving the edited name
    textNode.addEventListener('blur', function() {
        textNode.contentEditable = false;
        divElement.dataset.name = textNode.textContent.trim();
        deleteButton.style.display = 'none'; // Hide delete button after editing
        // Update the compobj data here as well if needed
    });

    // Exit editing mode on Esc key
    textNode.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            textNode.contentEditable = false;
            textNode.blur(); // Trigger blur to exit editing mode
        }
    });

    return divElement;
}

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

function deleteStage(stageId) {
    // Placeholder: Implement the logic to delete a stage from compobj and update the UI
    console.log(`Delete stage with ID: ${stageId}`);
}

function selectStage(stageElement) {
    // Clear previous selection
    const prevSelected = document.querySelector('.stage-selected');
    if (prevSelected) {
        prevSelected.classList.remove('stage-selected');
    }

    // Highlight the selected stage
    stageElement.classList.add('stage-selected');
}

function getSelectedStageId() {
    const selectedElement = document.querySelector('.stage-selected');
    return selectedElement ? selectedElement.dataset.stageId : null;
}

function getCompetitionsList(parent) {
    const competitionsList = document.createElement('ul');
    data["compobj"].forEach(comp => {
        if (comp.level === 3 && comp.parent === parent) { // Ensure it's a level 3 child of the specified parent
            const divElement = createCompetitionDivElement(comp); // Now returns a div
            const listWrapper = document.createElement('li'); // Create a wrapper 'li' for the div
            listWrapper.appendChild(divElement);
            competitionsList.appendChild(listWrapper);
        }
    });
    return competitionsList;
}

function createCompetitionDivElement(comp) {
    const divElement = document.createElement('div');
    divElement.classList.add('competition-item');
    divElement.dataset.compid = comp.line;
    divElement.dataset.name = comp.longname && comp.longname.trim() ? comp.longname.trim() : (comp.shortname ? comp.shortname.trim() : "Unnamed Competition");
    
    // Create the text node (editable)
    const nameToDisplay = replaceNames(divElement.dataset.name, data["compobj"]);
    const textNode = document.createElement('span');
    textNode.textContent = nameToDisplay;
    textNode.contentEditable = false; // Disable editing by default
    divElement.appendChild(textNode);

    // Create the delete button
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '⊖'; // Use the correct HTML entity for a minus sign inside a circle
    deleteButton.style.display = 'none'; // Hidden by default
    divElement.appendChild(deleteButton);

    // Event listener to make the text editable and show the delete button
    divElement.addEventListener('click', function() {
        textNode.contentEditable = true; 
        textNode.focus();
        deleteButton.style.display = 'inline'; // Show delete button
    });

    // Event listener for the delete button
    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering the divElement click event
        const groupId = parseInt(divElement.dataset.compid, 10);
        removeGroup(groupId, divElement.parentElement); // Pass the parent 'li' to remove it later
    });

    // Handle saving the edited name
    textNode.addEventListener('blur', function() {
        textNode.contentEditable = false;
        divElement.dataset.name = textNode.textContent.trim();
        deleteButton.style.display = 'none'; // Hide delete button after editing
        // Update the compobj data here as well if needed
    });

    // Exit editing mode on Esc key
    textNode.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            textNode.contentEditable = false;
            textNode.blur(); // Trigger blur to exit editing mode
        }
    });

    return divElement;
}

function createCompetitionItem(comp) {
    const listItem = document.createElement('div');
    listItem.classList.add('competition-item');
    listItem.dataset.compid = comp.line;
    listItem.dataset.name = comp.longname && comp.longname.trim() ? comp.longname.trim() : (comp.shortname ? comp.shortname.trim() : "Unnamed Competition");
    
    // Create the text node (editable)
    const textNode = document.createElement('span');
    textNode.textContent = listItem.dataset.name;
    textNode.contentEditable = false; // Disable editing by default
    listItem.appendChild(textNode);

    // Create the delete button
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '&minus;'; // Use HTML entity for a minus sign
    deleteButton.style.display = 'none'; // Hidden by default
    listItem.appendChild(deleteButton);

    // Event listener to make the text editable and show the delete button
    listItem.addEventListener('click', function() {
        textNode.contentEditable = true; 
        textNode.focus();
        deleteButton.style.display = 'inline'; // Show delete button
    });

    // Event listener for the delete button
    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering the listItem click event
        const groupId = parseInt(listItem.dataset.compid, 10);
        removeGroup(groupId);
    });

    // Handle saving the edited name
    textNode.addEventListener('blur', function() {
        textNode.contentEditable = false;
        listItem.dataset.name = textNode.textContent.trim();
        // You might want to update the compobj data here as well
    });

    return listItem;
}

function removeGroup(groupId, groupDivElement) {
    // Find and remove the group from compobj
    const groupIndex = data['compobj'].findIndex(obj => obj.line === groupId);
    if (groupIndex === -1) return; // Group not found, do nothing

    const removedGroup = data['compobj'].splice(groupIndex, 1)[0];

    // Update all references and the compobj
    updateCompObj(removedGroup, -1); 
    updateAllReferences(removedGroup.line, -1);

    // Remove the group div from the UI
    groupDivElement.remove();
}