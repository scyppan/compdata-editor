// Function to handle the creation of a new international competition
function createNewInternationalCompetition() {
    // Store the current state
    const expandedState = getExpandedState();

    // Find the last line number and add one
    let lastLineNumber = 0;
    data["compobj"].forEach(comp => {
        if (comp.line > lastLineNumber) {
            lastLineNumber = comp.line;
        }
    });
    const newLineNumber = lastLineNumber + 1;

    // Create a new international competition object
    const newCompetition = {
        line: newLineNumber,
        level: 3,
        shortname: "New Comp",
        longname: "New Competition",
        parent: 0
    };

    // Add the new competition to the data array
    data["compobj"].push(newCompetition);

    // Update the left panel hierarchy
    organizeCompetitions(data);

    // Restore the previous expanded state
    restoreExpandedState(expandedState);
}
