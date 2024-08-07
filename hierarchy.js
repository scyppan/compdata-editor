
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
        comp.children = [];
    });

    data["compobj"].forEach(comp => {
        if (comp.parent !== -1 && map[comp.parent]) {
            map[comp.parent].children.push(comp);
        }
    });

    return Object.values(map).filter(comp => comp.parent === -1);
}
