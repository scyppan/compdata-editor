document.getElementById('fileSelect').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const fileContent = e.target.result;
                data = JSON.parse(fileContent);
                organizeCompetitions(data);
                document.getElementById('leftPanel').classList.remove('hidden');
                showMainUI();
            } catch (error) {
                createMessage("Error parsing JSON file:", 'error');
                alert('Invalid JSON file.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please select a valid JSON file.');
    }
});

function displayFileContent(content) {
    const fileContentDiv = document.getElementById('fileContent');
    fileContentDiv.innerHTML = '<pre>' + JSON.stringify(JSON.parse(content), null, 2) + '</pre>';
}

function showMainUI() {
    document.getElementById('fileSelector').classList.add('hidden');
    document.getElementById('leftPanel').classList.add('visible');
    document.getElementById('mainPanel').classList.add('visible');
    showWindow(0);
}

function showWindow(level){
    
    if (!document.getElementById("level-0-content").classList.contains('hidden')) {
        document.getElementById("level-0-content").classList.add('hidden');
    }
    if (!document.getElementById("level-1-content").classList.contains('hidden')) {
        document.getElementById("level-1-content").classList.add('hidden');
    }
    if (!document.getElementById("level-2-content").classList.contains('hidden')) {
        document.getElementById("level-2-content").classList.add('hidden');
    }
    if (!document.getElementById("level-3-content").classList.contains('hidden')) {
        document.getElementById("level-3-content").classList.add('hidden');
    }
    if (!document.getElementById("level-4-content").classList.contains('hidden')) {
        document.getElementById("level-4-content").classList.add('hidden');
    }
    if (!document.getElementById("level-5-content").classList.contains('hidden')) {
        document.getElementById("level-5-content").classList.add('hidden');
    }
    if (!document.getElementById("level-6-content").classList.contains('hidden')) {
        document.getElementById("level-6-content").classList.add('hidden');
    }

    switch (level) {
        case 0: document.getElementById("level-0-content").classList.remove('hidden'); break;
        case 1: document.getElementById("level-1-content").classList.remove('hidden'); break;
        case 2: document.getElementById("level-2-content").classList.remove('hidden'); break;
        case 3: document.getElementById("level-3-content").classList.remove('hidden'); break;
        case 4: document.getElementById("level-4-content").classList.remove('hidden'); break;
        case 5: document.getElementById("level-5-content").classList.remove('hidden'); break;
        case 6: document.getElementById("level-6-content").classList.remove('hidden'); break;
        default: console.error("Invalid level: " + level); break;
    }
    
}