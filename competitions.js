function getChildren(parentId) {
    return data['compobj'].filter(entry => entry.parent === parentId);
}

function createCompetitionsListDiv(parentId) {
    const div = document.createElement('div');
    div.id = `Children`;
    div.classList.add('standard-div');

    const header = document.createElement('h2');
    header.textContent = `Children`;
    div.appendChild(header);

    const children = getChildren(parentId);
    const ul = document.createElement('ul');

    children.forEach(child => {
        const li = createCompetitionDivElement(child);
        ul.appendChild(li);
    });

    div.appendChild(ul);

    return div;
}

function createCompetitionDivElement(child) {
    const divElement = document.createElement('div');
    divElement.classList.add('competition-item');
    divElement.dataset.compid = child.line;
    divElement.dataset.name = child.longname && child.longname.trim() ? child.longname.trim() : (child.shortname ? child.shortname.trim() : "Unnamed Competition");

    // Set cursor to pointer to indicate clickability
    divElement.style.cursor = 'pointer';

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
    deleteButton.style.cursor = 'pointer'; // Set cursor to pointer for delete button
    divElement.appendChild(deleteButton);

    // Event listener to make the text editable and show the delete button
    divElement.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent triggering the document click event
        closeAllEditableElements(); // Close all other editable elements before opening this one

        textNode.contentEditable = true;
        textNode.focus();
        deleteButton.style.display = 'inline'; // Show delete button
    });

    // Handle "Esc" key to exit editing mode
    textNode.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeEditableElement(divElement); // Close this element's editing mode
        }
    });

    // Event listener for the delete button
    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering the divElement click event
        const id = parseInt(divElement.dataset.compid, 10);
        removeCompObj(id, divElement); // Pass the divElement to remove it later
    });

    // Handle saving the edited name
    textNode.addEventListener('blur', function() {
        textNode.contentEditable = false;
        divElement.dataset.name = textNode.textContent.trim();
        updateCompObjName(divElement.dataset.compid, divElement.dataset.name);
    });

    return divElement;
}

function closeEditableElement(element) {
    const textNode = element.querySelector('span');
    const deleteButton = element.querySelector('.delete-button');
    if (textNode) textNode.contentEditable = false;
    if (deleteButton) deleteButton.style.display = 'none';
}

function closeAllEditableElements() {
    document.querySelectorAll('.competition-item').forEach(item => {
        closeEditableElement(item);
    });
}

document.addEventListener('click', function() {
    closeAllEditableElements(); // Close all editable elements when clicking outside
});

function updateCompObjName(compId, newName) {
    // Update the compobj name based on compId
    const compObj = data['compobj'].find(obj => obj.line === compId);
    if (compObj) {
        compObj.longname = newName;
    }
}

function removeCompObj(compObj, elementToRemove) {
    // Find the index of the group to remove
    const compObjIndex = data['compobj'].findIndex(obj => obj.line === compObj);
    if (compObjIndex === -1) return; // Group not found, do nothing

    const removedGroup = data['compobj'][compObjIndex];
    const removedLevel = removedGroup.level;

    // Remove the original group
    data['compobj'].splice(compObjIndex, 1);
    let removalCount = 1; // Start with 1 for the original group

    // Use a regular for loop to go through subsequent elements
    for (let i = compObjIndex; i < data['compobj'].length; i++) {
        const obj = data['compobj'][i];

        if (obj.level > removedLevel) {
            // Remove the group if it has a higher level
            data['compobj'].splice(i, 1);
            i--; // Adjust the index after removal
            removalCount++;
        } else {
            // Stop removing if the level is the same or lower
            break;
        }
    }

    // Update all references by the number of removed objects
    updateCompObj(removedGroup, -removalCount); 
    updateAllReferences(removedGroup.line, -removalCount);

    // Remove the element from the DOM
    elementToRemove.remove();

    // Optionally, update the UI (e.g., refresh the list or state)
    let expandedState = getExpandedState();
    organizeCompetitions(data);
    restoreExpandedState(expandedState);
}

function getRemovalCount(){
    let i = groupIndex + 1;
    let removalCount = 0;

    

    while (i < data['compobj'].length) {
        const currentGroup = data['compobj'][i];

        // If the current group's level is less than or equal to the removed level, break the loop
        if (currentGroup.level <= removedLevel) {
            break;
        }

        // Remove the group from compobj
        data['compobj'].splice(i, 1);
        removalCount++;
    }

    return removalCount;
}

