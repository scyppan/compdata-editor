document.getElementById('fileSelect').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = e.target.result;
            data = JSON.parse(fileContent);
            loadAndDisplayHierarchy(data);
            document.getElementById('leftPanel').classList.remove('hidden');
            showMainUI();
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
}
