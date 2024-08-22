function getChildren(parentId) {
    return data['compobj'].filter(entry => entry.parent === parentId);
}

function createCompetitionsListDiv(parentId) {
    const div = document.createElement('div');
    div.classList.add('level-content', 'standard-div');

    const parentObj = data['compobj'].find(comp => comp.line === parentId);
    let level = parentObj ? parentObj.level : 0;

    const leftDiv = document.createElement('div');
    const rightDiv = document.createElement('div');
    leftDiv.classList.add('confederations-container');
    rightDiv.classList.add('confederations-container');
    leftDiv.id=="leftcompdiv";
    rightDiv.id=="rightcompdiv";

    const leftHeader = document.createElement('h2');
    const rightHeader = document.createElement('h2');

    leftDiv.appendChild(leftHeader);
    rightDiv.appendChild(rightHeader);

    const leftList = document.createElement('ul');
    const rightList = document.createElement('ul');
    leftDiv.appendChild(leftList);
    rightDiv.appendChild(rightList);

    // Separate children based on their levels
    const children = getChildren(parentId);

    children.forEach(child => {
        
        const li = createCompetitionDivElement(child);
        if(level==0&&child.level==1){
            leftList.appendChild(li);
        }else if(level==0&&child.level==3){
            rightList.appendChild(li);
        }else if(level==1&&child.level==2){
            leftList.appendChild(li);
        }else if(level==1&&child.level==3){
            rightList.appendChild(li);
        }else{
            leftList.appendChild(li);
        }
    });

    div.appendChild(leftDiv);

    const leftAddDiv = document.createElement('div');
    leftAddDiv.classList.add('add-compobj-container');
    const inputleft = document.createElement('input');
    inputleft.type = 'text';
    inputleft.placeholder = 'Add new confederation...';
    inputleft.classList.add('add-compobj-input');
    leftAddDiv.appendChild(inputleft);
    leftDiv.appendChild(leftAddDiv);

    const rightAddDiv = document.createElement('div');
    rightAddDiv.classList.add('add-compobj-container');
    const inputright = document.createElement('input');
    inputright.type = 'text';
    inputright.placeholder = 'Add new competition...';
    inputright.classList.add('add-compobj-input');
    rightAddDiv.appendChild(inputright);
    rightDiv.appendChild(rightAddDiv);

    // Event listener for Enter key to add the competition
    inputleft.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && inputleft.value.trim() !== '') {
            createNewCompObj(parentId, inputleft.value.trim(), level+1, leftList);
            inputleft.value = ''; // Clear input after adding
        }
    });

    switch(level){
        case 0: 
            leftHeader.textContent = 'Confederations';
            rightHeader.textContent = 'Competitions';
            div.appendChild(rightDiv);

            // Event listener for Enter key to add the competition
            inputright.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' && inputright.value.trim() !== '') {
                createNewCompObj(parentId, inputright.value.trim(), 3, rightList);
                inputright.value = ''; // Clear input after adding
            }
            });

            div.classList.remove('standard-div');
            div.classList.add('competition-div');
        break;
        case 1:
            leftHeader.textContent = 'Nations';
            rightHeader.textContent = 'Competitions';
            div.appendChild(rightDiv);

            // Event listener for Enter key to add the competition
            inputright.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' && inputright.value.trim() !== '') {
                    createNewCompObj(parentId, inputright.value.trim(), 3, rightList);
                    inputright.value = ''; // Clear input after adding
                }
            });

            inputleft.placeholder = 'Add new nation...';

            div.classList.remove('standard-div');
            div.classList.add('competition-div');
        break;
        case 2:
            rightDiv.appendChild(rightList); //only append right if level is 0 or 1
            leftHeader.textContent = 'Competitions';
            inputleft.placeholder = 'Add new competition...';
            
            leftDiv.classList.remove('standard-div');
            leftDiv.classList.remove('confederations-container');
            
        break;
        case 3:
            rightDiv.appendChild(rightList); //only append right if level is 0 or 1
            leftHeader.textContent = 'Stages';
            inputleft.placeholder = 'Add new stage...';
            
            leftDiv.classList.remove('standard-div');
            leftDiv.classList.remove('confederations-container');
            
        break;
        case 4: 
            rightDiv.appendChild(rightList); //only append right if level is 0 or 1
            leftHeader.textContent = 'Groups';
            inputleft.placeholder = 'Add new group...';
            
            leftDiv.classList.remove('standard-div');
            leftDiv.classList.remove('confederations-container');
        break;
    }

    return div;
}

function createCompetitionDivElement(child) {
    const divElement = document.createElement('div');
    divElement.classList.add('competition-item');
    divElement.dataset.compid = child.line;
    divElement.dataset.name = child.longname && child.longname.trim() ? child.longname.trim() : (child.shortname ? child.shortname.trim() : "Unnamed Competition");

    // Set cursor to pointer to indicate clickability
    divElement.style.cursor = 'pointer';

    // Create a container for the inputs and save button
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.alignItems = 'center'; // Vertically center the items
    inputContainer.style.gap = '10px'; // Space between elements

    divElement.appendChild(inputContainer);

    // Create the text node (editable)
    const nameToDisplay = replaceNames(divElement.dataset.name, data["compobj"]);
    const textNode = document.createElement('span');
    textNode.textContent = nameToDisplay;
    textNode.contentEditable = false; // Disable editing by default

    // Create the input fields for shortname and longname
    const shortNameInput = document.createElement('input');
    shortNameInput.type = 'text';
    shortNameInput.value = child.shortname;
    shortNameInput.style.display = 'none'; // Hide initially

    const longNameInput = document.createElement('input');
    longNameInput.type = 'text';
    longNameInput.value = child.longname;
    longNameInput.style.display = 'none'; // Hide initially

    // Create the save button (✔)
    const saveButton = document.createElement('span');
    saveButton.innerHTML = '✔';
    saveButton.style.display = 'none'; // Hide initially
    saveButton.style.cursor = 'pointer'; // Set cursor to pointer

    inputContainer.appendChild(shortNameInput);
    inputContainer.appendChild(longNameInput);
    inputContainer.appendChild(textNode);
    inputContainer.appendChild(saveButton);

    saveButton.style.color = 'green';
    saveButton.style.fontSize = '16px'; // Adjust size to match input fields
    saveButton.style.lineHeight = '1'; // Align vertically with text
    shortNameInput.style.width = '60px';
    shortNameInput.style.height = '25px'; // Match with text height
    longNameInput.style.width = '120px';
    longNameInput.style.height = '25px'; // Match with text height

    // Create the delete button
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '⊖'; // Use the correct HTML entity for a minus sign inside a circle
    deleteButton.style.display = 'none'; // Hidden by default
    deleteButton.style.cursor = 'pointer'; // Set cursor to pointer for delete button
    inputContainer.appendChild(deleteButton);

    // Event listener to make the text editable and show the delete button
    divElement.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent triggering the document click event
        closeAllEditableElements(); // Close all other editable elements before opening this one

        textNode.style.display = 'none';
        shortNameInput.style.display = 'inline';
        longNameInput.style.display = 'inline';
        saveButton.style.display = 'inline';
        
        // Check if neither input is focused, then focus on the shortNameInput
        if (document.activeElement !== shortNameInput && document.activeElement !== longNameInput) {
            shortNameInput.focus(); // Focus on the shortname input only if neither input is already focused
        }

        deleteButton.style.display = 'inline'; // Show delete button
    });

    saveButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent triggering other click events
        commitChangesAndClose(shortNameInput, longNameInput, textNode, divElement);
    });    
    
    shortNameInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            commitChangesAndClose(shortNameInput, longNameInput, textNode, divElement);
        }
    });
    
    longNameInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            commitChangesAndClose(shortNameInput, longNameInput, textNode, divElement);
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

    shortNameInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            commitChangesAndClose(shortNameInput,longNameInput,textNode, divElement);
        }
    });
    
    longNameInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            commitChangesAndClose(shortNameInput,longNameInput, textNode, divElement);
        }
    });
    
    return divElement;
}

function closeEditableElement(element) {
    const inputContainer = element.querySelector('div');
    
    if (!inputContainer) return; // Safeguard to ensure the input container exists

    const shortNameInput = inputContainer.querySelector('input:nth-child(1)');
    const longNameInput = inputContainer.querySelector('input:nth-child(2)');
    const saveButton = inputContainer.querySelector('span:nth-child(4)'); // Ensure this targets the correct save button
    const deleteButton = inputContainer.querySelector('.delete-button');
    const textNode = inputContainer.querySelector('span'); // Ensure this targets the correct text element

    // Hide inputs and buttons
    if (shortNameInput) shortNameInput.style.display = 'none';
    if (longNameInput) longNameInput.style.display = 'none';
    if (saveButton) saveButton.style.display = 'none';
    if (deleteButton) deleteButton.style.display = 'none';

    // Show the text node
    if (textNode) textNode.style.display = 'inline';
}

function closeAllEditableElements() {
    document.querySelectorAll('.competition-item').forEach(item => {
        closeEditableElement(item);
    });
}

document.addEventListener('click', function() {
    closeAllEditableElements(); // Close all editable elements when clicking outside
});

function updateCompObjNames(compId, newShortName, newLongName) {
    const compObj = data['compobj'].find(obj => obj.line === compId);
    if (compObj) {
        compObj.shortname = newShortName;
        compObj.longname = newLongName;
    }

    // Update names in the left panel UI
    const listItem = document.querySelector(`#competitionList li[data-compid='${compId}']`);
    if (listItem) {
        const textNode = listItem.querySelector('span');
        if (textNode) {
            textNode.textContent = `${newLongName} (${compId})`;
        }
    }
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

function commitChangesAndClose(shortNameInput, longNameInput, textNode, divElement) {
    if (!shortNameInput || !longNameInput) {
        console.error("Input elements are not defined!");
        return;
    }

    const newShortName = shortNameInput.value.trim();
    const newLongName = longNameInput.value.trim();
    textNode.textContent = newLongName;

    // Commit the changes
    updateCompObjNames(divElement.dataset.compid, newShortName, newLongName);
    let compObj=data['compobj'][divElement.dataset.compid];
    compObj.shortname=newShortName;
    compObj.longname=newLongName;

    // Close the input mode
    closeAllEditableElements(); // Use the existing function to close the inputs and restore the text
}
