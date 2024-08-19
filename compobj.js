const settingswithrefs=['rule_suspension', 'schedule_forcecomp', 'schedule_use_dates_comp', 'advance_maxteamsstageref', 'advance_standingskeep', 'advance_standingsrank', 'advance_pointskeep', 'standings_checkrank'];

function updateAllReferences(newLine, amt) {
    // Update advancement
    updateAdvancementReferences(newLine, amt);

    // Update objectives
    updateObjectivesReferences(newLine, amt);

    // Update schedule
    updateScheduleReferences(newLine, amt);

    // Update settings
    updateSettingsReferences(newLine, amt);

    // Update standings
    updateStandingsReferences(newLine, amt);

    // Update tasks
    updateTaskReferences(newLine, amt);

    // Update weather
    updateWeatherReferences(newLine, amt);
}

function updateTaskReferences(newLine, amt) {
    data['tasks'].forEach(task => {

        if(task.id>=newLine){
            task.id+=amt;
        }
        
        if(task.description=='UpdateTable'||task.description=='FillFromCompTableBackup'||task.description=='FillFromCompTablePosBackupSameLeague'||task.description=='FillFromCompTableBackupLeague'){
            if (task.param1 >= newLine) task.param1 += amt;
            if (task.param2 >= newLine) task.param2 += amt;
        }else{
            if (task.param1 >= newLine) task.param1 += amt;
        }

    });
}

function updateAdvancementReferences(newLine, amt) {
    data['advancement'].forEach(entry => {
        // If the groupid references a line number greater than or equal to newLine, increment it
        if (entry.groupid >= newLine) {
            entry.groupid += amt;
        }
    
        // If the pushtocompetition references a line number greater than or equal to newLine, increment it
        if (entry.pushtocompetition >= newLine) {
            entry.pushtocompetition += amt;
        }
    });
}

function updateObjectivesReferences(newLine, amt) {
    data['objectives'].forEach(entry => {
        // If the id references a line number greater than or equal to newLine, increment it
        if (entry.id >= newLine) {
            entry.id += amt;
        }
    });
}

function updateScheduleReferences(newLine, amt) {
    data['schedule'].forEach(entry => {
        // If the id references a line number greater than or equal to newLine, increment it
        if (entry.id >= newLine) {
            entry.id += amt;
        }
    });
}

function updateSettingsReferences(newLine, amt) {
    data['settings'].forEach(entry => {
        // If the id references a line number greater than or equal to newLine, increment it
        if (entry.id >= newLine) {
            entry.id += amt;

            if (entry.tag && settingswithrefs.includes(entry.tag)) {
                entry.value+=amt;
            }
        }
    });
}

function updateStandingsReferences(newLine, amt) {
    data['standings'].forEach(entry => {
        // If the id references a line number greater than or equal to newLine, increment it
        if (entry.id >= newLine) {
            entry.id += amt;
        }
    });
}

function updateWeatherReferences(newLine, amt) {
    data['weather'].forEach(entry => {
        // Update id references in the weather dataset
        if (entry.id >= newLine) {
            entry.id += amt;
        }
    });
}

function updateCompObj(removedObj, amt) {
    const removedLine = removedObj.line;
    const removedLevel = removedObj.level;

    data['compobj'].forEach(obj => {
        if (obj.line > removedLine) {
            if (obj.parent >= removedLine) {
                // Adjust parent only if the parent was part of the removed hierarchy or comes after it
                obj.parent += amt;
            }
            // Adjust line number if it’s after the removed obj
            obj.line += amt;
        }
    });
}

function createNewCompObj(parentId, compName, level, listElement) {
    const expandedState = getExpandedState();
    let insertionPoint = -1;
    
    switch(level){
        case 1:
            let lastConfedLine = findLastCompOfLvl(1, 0); // Level 1, parent 0
            insertionPoint = findIntlInsertionPoint(lastConfedLine);
        break;
        case 2:
            let lastNatLine = findLastCompOfLvl(2, parentId);
            insertionPoint = findInsertionPoint(lastNatLine, 2);
        break;
        case 3:
            let lastCompLine = findLastCompOfLvl(3, parentId); 
            insertionPoint = findInsertionPoint(lastCompLine, 3);
        break;
        case 4:
            let lastStageLine = findLastCompOfLvl(4, parentId); 
            insertionPoint = findInsertionPoint(lastStageLine, 4);
        break;
        case 5:
            let lastGroupLine = findLastCompOfLvl(5, parentId); 
            insertionPoint = findInsertionPoint(lastGroupLine, 5);
        break;
        default: break;
    }

    const newCompObj = {
        line: insertionPoint,
        level: level,
        shortname: compName,
        longname: compName,
        parent: parentId
    };

    // Push subsequent elements down by 1 to make space
    pushSubsequentCompObjs(insertionPoint);

    // Insert at the exact insertion point without subtracting 1
    data['compobj'].splice(insertionPoint, 0, newCompObj);

    updateAllReferences(insertionPoint, 1);

     if(listElement){
        const newCompElement = createCompetitionDivElement(newCompObj);
        listElement.appendChild(newCompElement);
     }
    
     // Sort compobj array by id
    data['compobj'].sort((a, b) => a.line - b.line);

    organizeCompetitions(data);
    restoreExpandedState(expandedState); 
}

function pushSubsequentCompObjs(startPoint){
    data['compobj'].forEach(obj=>{
        if(obj.line>=startPoint){
            obj.line++;
            
        }

        if(obj.parent>=startPoint){
            obj.parent++;
        }
    });
}

function removeCompObj(id, elementToRemove) {
    const firstDeletionPoint = data['compobj'].findIndex(obj => obj.line === id);
    if (firstDeletionPoint === -1) return; // Object not found, do nothing

    const compobj = data['compobj'][firstDeletionPoint];
    const lastDeletionPoint = findLastCompInHierarchy(id, compobj.level);

    // Calculate how many items should be deleted
    const deletionCount = (lastDeletionPoint !== -1) ? lastDeletionPoint - firstDeletionPoint + 1 : 1;

    // Adjust the lines and parents for objects after the deletion
    data['compobj'].forEach(comp => {
        if (comp.line > lastDeletionPoint) {
            // Only adjust objects that come after the last deletion point
            comp.line -= deletionCount;
            if (comp.parent >= id) {
                comp.parent -= deletionCount;
            }
        }
    });

    // Perform the deletion
    data['compobj'].splice(firstDeletionPoint, deletionCount);

    removeCompObjReferences(firstDeletionPoint, lastDeletionPoint);

    // Update references
    updateAllReferences(id, -deletionCount);

    // Remove the element from the DOM
    elementToRemove.remove();

    // Optionally, update the UI (e.g., refresh the list or state)
    let expandedState = getExpandedState();
    organizeCompetitions(data);
    restoreExpandedState(expandedState);
}

function removeCompObjReferences(firstDeletionPoint, lastDeletionPoint) {
    const linesToRemove = new Set();

    // Collect all lines that will be removed
    for (let i = firstDeletionPoint; i <= lastDeletionPoint; i++) {
        const line = data['compobj'][i].line;
        linesToRemove.add(line);
    }

    // List of tables to check for references
    const tablesToUpdate = ['settings', 'tasks', 'schedule', 'standings', 'objectives', 'weather']; 

    // Loop through each table and remove any references to the lines being deleted
    tablesToUpdate.forEach(table => {
        if (data[table] && Array.isArray(data[table])) {
            data[table] = data[table].filter(entry => {
                const entryId = entry.id || entry.compid; // Adjust this if your IDs are stored under a different field
                return !linesToRemove.has(entryId);
            });
        }
    });

    // Special handling for the 'advancement' table
    if (data['advancement'] && Array.isArray(data['advancement'])) {
        data['advancement'] = data['advancement'].filter(entry => {
            return !linesToRemove.has(entry.pushtocompetition) && !linesToRemove.has(entry.groupid);
        });
    }
}