function getNextAvailableId(compobj) {
    const lines = compobj.split('\r\n');
    let maxId = 0;
    lines.forEach(line => {
        const fields = line.split(',');
        const id = parseInt(fields[0]);
        if (id > maxId) {
            maxId = id;
        }
    });
    return (maxId + 1).toString();
}

function getCompetitionNameById(id) {
    // Assuming compobj data is stored in data["compobj"]
    const competition = data["compobj"].find(comp => comp.line === id);
    
    if (competition) {
        return competition.longname && competition.longname.trim() ? competition.longname.trim() : competition.shortname.trim();
    }

    return "Competition";
}

function getNationNameById(id) {
    // Assuming nation data is stored in data["nationobj"]
    const defaultname = data["compobj"].find(nat => nat.line === id);
    return replaceNames(defaultname.longname);
}

function getTrophyNameById(id) {
    // Assuming trophy data is stored in data["trophyobj"]
    const trophy = data["compobj"].find(troph => troph.line === id);
    
    if (trophy) {
        const trophyName = trophy.longname && trophy.longname.trim() ? trophy.longname.trim() : trophy.shortname.trim();
        return replaceNames(trophyName);
    }

    return "Trophy";
}

function getRoundData(id) {
    // Assuming competition data is stored in data["compobj"]
    const competition = data["compobj"].find(comp => comp.line === id);
    
    if (competition) {
        if (competition.longname && competition.longname.trim()) {
            return competition.longname.trim();
        } else if (competition.shortname && competition.shortname.trim()) {
            return competition.shortname.trim();
        }
    }

    return "Round";
}

function getDataForId(type, id) {
    // Assuming all data arrays are stored in the data object
    if (!data[type]) {
        console.error(`Data type ${type} not found`);
        return [];
    }

    // Default key to filter by
    let key = 'id'; 

    // Special case for 'schedule'
    if (type === 'advancement') {
        key = 'groupid';
    }

    return data[type].filter(entry => entry[key] === id);
}

function findLastCompOfLvl(lvl, parent){

    let lastCompOfLevel = -1;
    data['compobj'].forEach(comp => {
        if (comp.level === lvl && comp.parent==parent) {
            lastCompOfLevel = comp.line;
        }
    });

    return lastCompOfLevel;
}

function findInsertionPoint(startLine, stopLevel) {

    for (let i = 0; i < data['compobj'].length; i++) {
        const comp = data['compobj'][i];
        
        if (comp.line > startLine && (comp.level <= stopLevel || comp.level==6 )) {
            return comp.line;
        }
    }

    return findLastValidLine(); 
}

function findIntlInsertionPoint(startLine){
    for (let i = 0; i < data['compobj'].length; i++) {
        const comp = data['compobj'][i];
        
        if (comp.line > startLine && comp.level ==3) {
            
            return comp.line;
        }
    }

    return findLastValidLine(); 
}

function findLastValidLine() {
    let lastValidLine = -1;

    data['compobj'].forEach(comp => {
        if (comp.line !== null) {
            lastValidLine = comp.line;
        }
    });

    return lastValidLine;
}