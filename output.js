async function download() {
    const zip = new JSZip();

    // Add each data export as a file in the ZIP
    zip.file('compobj.txt', compobjToTxt(data['compobj']));
    zip.file('compids.txt', compidsToTxt(data['compobj']));
    zip.file('advancement.txt', advancementToTxt(data['advancement']));
    zip.file('objectives.txt', objectivesToTxt(data['objectives']));
    zip.file('schedule.txt', scheduleToTxt(data['schedule']));
    zip.file('settings.txt', settingsToTxt(data['settings']));
    zip.file('standings.txt', standingsToTxt(data['standings']));
    zip.file('tasks.txt', tasksToTxt(data['tasks']));
    zip.file('weather.txt', weatherToTxt(data['weather']));
    zip.file('initteams.txt', initteamsToTxt(data['initteams']));

    // Generate JSON data blob
    const jsonDataBlob = await generateJsonDataBlob();

    // Define filename with timestamp
    const now = new Date();
    const datetimeString = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    const jsonFileName = `scyppan-${datetimeString}-compdata.json`;

    // Add JSON data to ZIP with the specified filename
    zip.file(jsonFileName, jsonDataBlob);

    // Generate the ZIP file and trigger the download
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `scyppan-${datetimeString}-compdata.zip`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportCompobjData() {
    const dataStr = compobjToTxt(data['compobj']); // Convert compobj data to CSV format
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8;' }); // Create a Blob for a text file with UTF-8 encoding
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'compobj.txt'; // Set the file name with .txt extension
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportCompidsData() {
    const dataStr = compidsToTxt(data['compobj']); 
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8;' }); 
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'compids.txt'; 
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function compobjToTxt(compobjArray) {
    return compobjArray
        .filter(entry => !Object.values(entry).includes(null)) // Filter out rows with any null values
        .map(entry => `${entry.line},${entry.level},${entry.shortname},${entry.longname},${entry.parent}`)
        .join('\n') + '\n';
}

function compidsToTxt(compobjArray) {
    return compobjArray
        .filter(entry => entry.level === 3) // Filter only those with level 3
        .map(entry => entry.line) // Extract the 'line' value
        .join('\n') + '\n'; // Join them with new lines
}

function exportAdvancementData() {
    const dataStr = advancementToTxt(data['advancement']); 
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8;' }); 
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'advancement_data.txt'; 
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function advancementToTxt(advancementArray) {
    return advancementArray
        .filter(entry => !Object.values(entry).includes(null)) // Filter out rows with any null values
        .map(entry => `${entry.groupid},${entry.slot},${entry.pushtocompetition},${entry.pushtoposition}`)
        .join('\n') + '\n';
}

function exportObjectivesData() {
    const dataStr = objectivesToTxt(data['objectives']); 
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8;' }); 
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'objectives_data.txt'; 
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function objectivesToTxt(objectivesArray) {
    return objectivesArray
        .filter(entry => !Object.values(entry).includes(null)) // Filter out rows with any null values
        .map(entry => `${entry.id},${entry.objective},${entry.value}`)
        .join('\n') + '\n';
}

function exportScheduleData() {
    const dataStr = scheduleToTxt(data['schedule']); 
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8;' }); 
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'schedule_data.txt'; 
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function scheduleToTxt(scheduleArray) {
    return scheduleArray
        .filter(entry => !Object.values(entry).includes(null)) // Filter out rows with any null values
        .map(entry => `${entry.id},${entry.day},${entry.round},${entry.min},${entry.max},${entry.time}`)
        .join('\n') + '\n';
}

function exportSettingsData() {
    const dataStr = settingsToTxt(data['settings']); 
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8;' }); 
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'settings_data.txt'; 
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function settingsToTxt(settingsArray) {
    return settingsArray
        .filter(entry => !Object.values(entry).includes(null)) // Filter out rows with any null values
        .map(entry => `${entry.id},${entry.tag},${entry.value}`)
        .join('\n') + '\n';
}

function exportStandingsData() {
    const dataStr = standingsToTxt(data['standings']); 
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8;' }); 
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'standings_data.txt'; 
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function standingsToTxt(standingsArray) {
    return standingsArray
        .filter(entry => !Object.values(entry).includes(null)) // Filter out rows with any null values
        .map(entry => `${entry.id},${entry.position}`)
        .join('\n') + '\n';
}

function exportTasksData() {
    const dataStr = tasksToTxt(data['tasks']);
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tasks_data.txt';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function tasksToTxt(tasksArray) {
    return tasksArray
        .filter(entry => !Object.values(entry).includes(null)) // Filter out rows with any null values
        .map(entry => `${entry.id},${entry.when},${entry.description},${entry.param1},${entry.param2},${entry.param3},${entry.param4}`)
        .join('\n') + '\n';
}

function exportWeatherData() {
    const dataStr = weatherToTxt(data['weather']);
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'weather_data.txt';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function weatherToTxt(weatherArray) {
    return weatherArray
        .filter(entry => !Object.values(entry).includes(null)) // Filter out rows with any null values
        .map(entry => `${entry.id},${entry.month},${entry.chancedry},${entry.chancerain},${entry.chancesnow},${entry.chanceovercast},${entry.unknown},${entry.sunset},${entry.nighttime}`)
        .join('\n') + '\n';
}

function exportInitTeamsData() {
    const dataStr = initTeamsToTxt(data['initteams']);
    const blob = new Blob([dataStr], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'initteams_data.txt';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function initteamsToTxt(initTeamsArray) {
    return initTeamsArray
        .filter(entry => !Object.values(entry).includes(null)) // Filter out rows with any null values
        .map(entry => `${entry.id},${entry.finishpos},${entry.teamid}`)
        .join('\n') + '\n';
}

async function generateJsonDataBlob() {
    const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== null)
    );

    const jsonData = JSON.stringify(filteredData, null, 2); // Convert filtered data to JSON string
    return new Blob([jsonData], { type: 'application/json' }); // Return the blob
}
