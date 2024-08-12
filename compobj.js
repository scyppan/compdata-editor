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

function updateAdvancementReferences(newLine) {
    data['advancement'].forEach(entry => {
        // If the groupid references a line number greater than or equal to newLine, increment it
        if (entry.groupid >= newLine) {
            entry.groupid += 1;
        }
    
        // If the pushtocompetition references a line number greater than or equal to newLine, increment it
        if (entry.pushtocompetition >= newLine) {
            entry.pushtocompetition += 1;
        }
    });
}

function updateObjectivesReferences(newLine) {
    data['objectives'].forEach(entry => {
        // If the id references a line number greater than or equal to newLine, increment it
        if (entry.id >= newLine) {
            entry.id += 1;
        }
    });
}

function updateScheduleReferences(newLine) {
    data['schedule'].forEach(entry => {
        // If the id references a line number greater than or equal to newLine, increment it
        if (entry.id >= newLine) {
            entry.id += 1;
        }
    });
}

function updateSettingsReferences(newLine) {
    data['settings'].forEach(entry => {
        // If the id references a line number greater than or equal to newLine, increment it
        if (entry.id >= newLine) {
            entry.id += 1;
        }
    });
}

function updateStandingsReferences(newLine) {
    data['standings'].forEach(entry => {
        // If the id references a line number greater than or equal to newLine, increment it
        if (entry.id >= newLine) {
            entry.id += 1;
        }
    });
}

function updateWeatherReferences(newLine) {
    data['weather'].forEach(entry => {
        // Update id references in the weather dataset
        if (entry.id >= newLine) {
            entry.id += 1;
        }
    });
}

function updateTaskReferences(newLine, amt) {
    data['tasks'].forEach(task => {

        task.id+=amt;
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

function updateTaskReferences(newLine, amt) {
    data['tasks'].forEach(task => {

        if(task.description=='UpdateTable'||task.description=='FillFromCompTableBackup'||task.description=='FillFromCompTablePosBackupSameLeague'||task.description=='FillFromCompTableBackupLeague'){
            if (task.param1 >= newLine) task.param1 += amt;
            if (task.param2 >= newLine) task.param2 += amt;
        }else{
            if (task.param1 >= newLine) task.param1 += amt;
        }

    });
}

function updateCompObj(newGroup, amt) {
    const newLine = newGroup.line;

    data['compobj'].forEach(obj => {
        if (obj.line > newLine || (obj.line === newLine && !obj.new)) {
            obj.line += amt;
        }
    });

    // Remove the 'new' tag from the newly added group
    delete newGroup.new;
}