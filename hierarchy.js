let hierarchy = [];
let allCompetitions = {};

function createNewInternationalCompetition(data) {
    let newId = getNextAvailableId(data['compobj.txt']);
    let newCompetition = {
        id: newId,
        shortName: "New Competition",
        fullName: "New International Competition",
        level: 1,
        parent: "0",
        children: []
    };

    // Add the new competition to the hierarchy and data
    data['compobj.txt'] += `\n${newId},1,New Competition,New International Competition,0`;
    data.hierarchy['0'].children.push(newCompetition);

    // Update IDs for all subsequent competitions
    updateIds(data);

    // Refresh the display
    displayHierarchy(data);
}

function updateIds(data) {
    let lines = data['compobj.txt'].split('\r\n');
    let idMapping = {};

    lines = lines.map((line, index) => {
        let fields = line.split(',');
        let oldId = fields[0];
        let newId = index.toString();
        idMapping[oldId] = newId;
        fields[0] = newId;
        if (fields[4] in idMapping) {
            fields[4] = idMapping[fields[4]];
        }
        return fields.join(',');
    });

    data['compobj.txt'] = lines.join('\r\n');
}