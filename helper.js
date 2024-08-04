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
