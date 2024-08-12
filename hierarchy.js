
let hierarchy = [];

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

function buildHierarchy(data) {
    const map = {};
    data["compobj"].forEach(comp => {
        map[comp.line] = comp;
    });

    return Object.values(map)
        .filter(comp => comp.parent === -1)
        .map(comp => {
            return {
                ...comp,
                getChildren: () => getChildrenByParent(comp.line)
            };
        });
}

function getChildrenByParent(parentId) {
    return data["compobj"].filter(comp => comp.parent === parentId);
}
