function createWeatherDiv(id) {
    const div = document.createElement('div');
    div.id = 'weather';
    div.classList.add('standard-div', 'level-content'); // Ensure it has 'level-content' class

    const header = document.createElement('h2');
    header.textContent = 'Weather';
    div.appendChild(header);

    // Create a table for the weather data
    const table = document.createElement('table');
    table.classList.add('window-tables');
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Month', 'Dry', 'Rain', 'Snow', 'Ovrcst', 'Sunset', 'Night'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weatherData = getDataForId('weather', id);

    for (let i = 0; i < 12; i++) {
        const month = i + 1;
        const entry = weatherData.find(data => data.month === month) || {};
        const row = document.createElement('tr');
        row.dataset.id = entry.id || ''; // Set data-id attribute
        row.dataset.type = 'weather'; // Set data-type attribute

        const dataPairs = [
            { title: 'Month', value: months[i], readOnly: true },
            { title: 'chancedry', value: entry.chancedry || 0 },
            { title: 'chancerain', value: entry.chancerain || 0 },
            { title: 'chancesnow', value: entry.chancesnow || 0 },
            { title: 'chanceovercast', value: entry.chanceovercast || 0 },
            { title: 'sunset', value: entry.sunset || 0 },
            { title: 'nighttime', value: entry.nighttime || 0 }
        ];

        dataPairs.forEach(dataPair => {
            const cell = document.createElement('td');
            
            if (dataPair.title === 'Month') {
                cell.textContent = dataPair.value;
            } else {
                const input = document.createElement('input');
                input.type = 'number';
                input.value = dataPair.value;
                input.min = -1;
                input.classList.add('tablevalue-input');
                input.dataset.key = dataPair.title; // Set data-key attribute to the label
                input.dataset.context = 'weather'; // Set data-context attribute
                input.dataset.fieldType = 'standard'; // Set data-field-type attribute

                // Event listener for weather data changes
                input.addEventListener('change', function () {
                    updateWeatherData(entry.id, dataPair.title, input.value);
                    entry[dataPair.title] = parseInt(input.value, 10);  // Update the local variable to reflect the change
                });

                cell.appendChild(input);
            }
            
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    div.appendChild(table);

    return div;
}


function updateWeatherData(id, key, value) {
    // Find the relevant weather entry
    let entry = data['weather'].find(item => item.id == id);

    if (entry) {
        let parsedValue = parseInt(value, 10);

        if (isNaN(parsedValue)) {
            console.error(`Invalid number for ${key}: ${value}`);
            return;
        }

        // Update the entry's specific key with the parsed value
        switch (key) {
            case 'chancedry':
                entry.chancedry = parsedValue;  // Ensure chancedry is always an integer
                break;
            case 'chancerain':
                entry.chancerain = parsedValue;  // Ensure chancerain is always an integer
                break;
            case 'chancesnow':
                entry.chancesnow = parsedValue;  // Ensure chancesnow is always an integer
                break;
            case 'chanceovercast':
                entry.chanceovercast = parsedValue;  // Ensure chanceovercast is always an integer
                break;
            case 'sunset':
                entry.sunset = parsedValue;  // Ensure sunset is always an integer
                break;
            case 'nighttime':
                entry.nighttime = parsedValue;  // Ensure nighttime is always an integer
                break;
            default:
                console.error(`Unknown key: ${key}`);
                return;
        }
       
    } else {
        console.error(`Weather entry not found for id ${id}`);
    }
}
