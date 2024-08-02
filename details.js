function displayDetails(competition) {
    const level = competition.level;
    const contentDivId = `level-${level}-content`; console.log(contentDivId);
    const contentDiv = document.getElementById(contentDivId);
    if (contentDiv) {
        // Hide and clear all content divs
        for (let i = 0; i <= 5; i++) {
            const div = document.getElementById(`level-${i}-content`);
            if (div) {
                div.style.display = 'none';
                div.innerHTML = '';
            }
        }
        // Display the selected content div
        contentDiv.style.display = 'block';
        contentDiv.innerHTML = `<pre>${JSON.stringify(competition, null, 2)}</pre>`;
    } else {
        console.error(`No element found for ${contentDivId}`);
    }
}