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

function getCompetitionsList(parent) {
    const competitionsList = document.createElement('ul');
    data["compobj"].forEach(comp => {
        if (comp.level === 3 && comp.parent === parent) { // Ensure it's a level 3 child of the specified parent
            const listItem = document.createElement('li');
            listItem.textContent = replaceNames(comp.longname && comp.longname.trim() ? comp.longname.trim() : (comp.shortname ? comp.shortname.trim() : "Unnamed Competition"), data["compobj"]);
            competitionsList.appendChild(listItem);
        }
    });
    return competitionsList;
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