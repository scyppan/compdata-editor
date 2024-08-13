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

function createNewCompObj(parentId, compName, level) {
    const expandedState = getExpandedState();
    
    let lastChildLine = parentId;
    data['compobj'].forEach(comp => {
        if (comp.parent === parentId && comp.line > lastChildLine) {
            lastChildLine = comp.line;
        }
    });
    
    const newLine = lastChildLine + 1;

    const newCompObj = {
        line: newLine,
        level: level,
        shortname: compName,
        longname: compName,
        parent: parentId
    };

    data['compobj'].splice(newLine, 0, newCompObj); // Add new compobj to the list in order
    updateCompObj(newCompObj, 1); // Update references with +1
    updateAllReferences(newLine, 1); // Update all related references

    // Update UI: Append the new competition object to the UI under the correct parent
    const parentElement = document.querySelector(`[data-compid="${parentId}"] ul`);
    if (parentElement) {
        const newCompElement = createCompetitionDivElement(newCompObj);
        parentElement.appendChild(newCompElement);
    }

    organizeCompetitions(data); // Reorganize competitions in the left panel
    restoreExpandedState(expandedState); // Restore expanded state to keep UI consistent
}
