function organizeCompetitions(data) {
    const competitionList = document.getElementById('competitionList');
    competitionList.innerHTML = ''; // Clear existing list

    if (data && Array.isArray(data["compobj"])) {
        hierarchy = buildHierarchy(data);
        hierarchy.forEach(comp => {
            appendCompetition(comp, competitionList);
        });
    } else {
        console.error("compobj is not defined or is not an array.");
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

function displayHierarchy(jsonContent) {
    const hierarchy = organizeCompetitions(jsonContent);
    const competitionList = document.getElementById('competitionList');
    competitionList.innerHTML = ''; // Clear existing list

    hierarchy.forEach(competition => {
        appendCompetition(competition, competitionList, 0);
    });
}

function appendCompetition(comp, parentElement, expandedState = {}) {
    const listItem = document.createElement('li');
    listItem.classList.add(`level-${comp.level}`);
    listItem.dataset.compid = comp.line;
    listItem.dataset.name = comp.longname && comp.longname.trim() ? comp.longname.trim() : (comp.shortname ? comp.shortname.trim() : "Unnamed Competition");

    let fullName = listItem.dataset.name;
    if (comp.level >= 2 && comp.level <= 6) {
        fullName = replaceNames(fullName, data["compobj"]);
    }

    const itemContainer = document.createElement('div');
    itemContainer.style.display = 'flex';
    itemContainer.style.justifyContent = 'space-between';
    itemContainer.style.width = '100%';

    const textNode = document.createElement('span');
    textNode.textContent = `${fullName} (${comp.line})`;
    itemContainer.appendChild(textNode);
    listItem.appendChild(itemContainer);

    // Get children without storing them in comp.children
    const children = getChildrenByParent(comp.line);
    if (children.length > 0) {
        const childList = document.createElement('ul');
        children.forEach(child => {
            appendCompetition(child, childList, expandedState);
        });
        listItem.appendChild(childList);

        // Restore the expanded state
        if (expandedState[comp.line]) {
            childList.style.display = 'block';
        } else {
            childList.style.display = 'none'; 
        }

        // Create and append the toggle button
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '-';
        toggleButton.classList.add('toggle-button');
        toggleButton.style.display = expandedState[comp.line] || comp.level === 0 ? 'inline' : 'none';

        itemContainer.appendChild(toggleButton);

        // Ensure clicking the list item expands the children
        listItem.addEventListener('click', function(e) {
            e.stopPropagation();
            if (childList.style.display === 'none') {
                childList.style.display = 'block';
                toggleButton.style.display = 'inline';
            }
        });

        // Add click event to toggle child visibility
        toggleButton.addEventListener('click', function(e) {
            e.stopPropagation();
            childList.style.display = 'none';
            toggleButton.style.display = 'none';
        });
    }

    // Add click event to show corresponding level content and populate window
    listItem.addEventListener('click', function(e) {
        e.stopPropagation(); 
        showWindow(comp.level);
        populateWindow(comp.level, comp.line);
    });

    parentElement.appendChild(listItem);
}

function getExpandedState() {
    const expandedState = {};
    document.querySelectorAll('#competitionList li').forEach(item => {
        const compid = item.dataset.compid;
        const isExpanded = item.querySelector('ul') && item.querySelector('ul').style.display !== 'none';
        expandedState[compid] = isExpanded;
    });
    return expandedState;
}

function restoreExpandedState(expandedState) {
    document.querySelectorAll('#competitionList li').forEach(item => {
        const compid = item.dataset.compid;
        const childList = item.querySelector('ul');
        if (childList) {
            childList.style.display = expandedState[compid] ? 'block' : 'none';
        }
    });
}