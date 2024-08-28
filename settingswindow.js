const textTags = [
    'comp_type', 'rule_bookings', 'rule_offsides', 'rule_injuries', 'match_stagetype',
    'match_matchsituation', 'match_endruleleague', 'match_endruleko1leg', 'match_endruleko2leg1',
    'match_endruleko2leg2', 'match_endrulefriendly', 'standings_sort', 'schedule_seasonstartmonth',
    'is_women_competition', 'rule_allowadditionalsub', 'advance_pointskeeprounding',
    'match_celebrationlevel', 'schedule_matchup_behavior', 'standings_use_shadow_table', 
    'schedule_push_jan_season_year', 'rule_fixedmatchesdates', 'match_canusefancards', 'schedule_year_real_version',
    'rule_bookings', 'rule_offsides', 'rule_injuries', 'rule_allowadditionalsub', 'schedule_internationaldependency'
];

const options = [
    'comp_type', 'rule_bookings', 'rule_offsides', 'rule_injuries', 'rule_numsubsbench', 
    'rule_numsubsmatch', 'rule_numsubmatchinterruptions', 'rule_suspension', 
    'rule_numyellowstored', 'rule_numgamesbanredmax', 'rule_numgamesbanredmin', 
    'rule_numgamesbandoubleyellowmax', 'rule_numgamesbandoubleyellowmin', 
    'rule_numgamesbanyellowsmax', 'rule_numgamesbanyellowsmin', 'standings_pointswin', 
    'standings_pointsdraw', 'standings_pointsloss', 'match_matchimportance', 
    'match_stagetype', 'match_matchsituation', 'nation_id', 'asset_id', 
    'match_endruleleague', 'match_endruleko1leg', 'match_endruleko2leg1', 
    'match_endruleko2leg2', 'match_endrulefriendly', 'info_prize_money', 
    'info_prize_money_drop', 'standings_sort', 'schedule_seasonstartmonth', 
    'schedule_year_start', 'schedule_year_offset', 'schedule_internationaldependency', 
    'is_women_competition', 'num_games', 'rule_allowadditionalsub', 'info_slot_champ', 
    'uefa_seeded_slots_special_teams', 'women_uefa_seeded_slots_special_teams', 
    'advance_random_draw_event', 'schedule_use_dates_comp', 'info_color_slot_adv_group', 
    'schedule_checkconflict', 'rule_fixedmatchesdates', 'match_canusefancards', 
    'advance_maxteamsassoc', 'schedule_stage_draw_date', 'schedule_matchup_behavior', 
    'info_cup_advgroup_slot', 'info_cup_ko_othercomp_slot', 'info_cup_ko_slot', 
    'advance_standingskeep', 'advance_does_not_adv_further', 'advance_maxteamsgroup', 
    'advance_maxteamsstageref', 'advance_randomdraw', 'match_stadium_for_year', 
    'match_stadium_for_year_value', 'advance_teamcompdependency', 'info_special_team_id', 
    'uefa_seeded_slots', 'schedule_forcecomp', 'info_color_slot_champ', 
    'info_color_slot_champ_cup', 'info_color_slot_uecl', 'advance_pointskeep', 
    'advance_pointskeeppercentage', 'advance_pointskeeprounding', 'advance_calccompavgs', 
    'info_color_slot_euro_league', 'women_uefa_seeded_slots', 'match_celebrationlevel', 
    'schedule_matchreplay', 'match_stadium', 'info_league_releg', 'info_slot_releg', 
    'info_color_slot_releg', 'info_league_promo', 'info_prize_money_promo', 
    'info_slot_promo', 'info_slot_promo_poss', 'info_color_slot_promo', 
    'info_color_slot_promo_poss', 'info_slot_releg_poss', 'info_color_slot_releg_poss', 
    'standings_use_shadow_table', 'schedule_refcomp', 'num_limited_games', 
    'schedule_year_real', 'schedule_year_real_version', 'advance_standingsrank', 
    'schedule_push_jan_season_year', 'conmebol_seeded_slots_special_teams', 
    'conmebol_seeded_slots'
];

function createSettingsDiv(competitionid) {
    const div = document.createElement('div');
    div.id = 'settings';
    div.classList.add('standard-div', 'level-content'); // Ensure it has 'level-content' class

    const header = document.createElement('h2');
    header.textContent = 'Settings';
    div.appendChild(header);

    // Fetch settings for the specified competitionid
    const settingsData = getDataForId('settings', competitionid);

    const table = document.createElement('table');
    table.classList.add('window-tables');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    div.appendChild(table);

    settingsData.forEach(setting => {
        addSettingRow(setting, tbody);
    });

    // Check if there are any unused options left before adding the "Create New Setting" button
    const usedTags = settingsData.map(setting => setting.tag);
    const availableOptions = options.filter(option => !usedTags.includes(option));

    if (availableOptions.length > 0) {
        // Create button for adding new settings
        const createButton = document.createElement('button');
        createButton.textContent = 'Create New Setting';
        createButton.addEventListener('click', function () {
            const randomIndex = Math.floor(Math.random() * availableOptions.length);
            const selectedOption = availableOptions.splice(randomIndex, 1)[0]; // Pick a random unselected option
            let newSetting = createNewSettingData(competitionid, selectedOption);
            addSettingRow(newSetting, tbody);

            // Disable the button if all options are used up
            if (availableOptions.length === 0) {
                createButton.disabled = true;
            }
        });
        div.appendChild(createButton);
    }

    return div;
}

function createNewSettingData(competitionid, defaultTag) {
    // Create the new setting entry with a provided default tag and value
    let newSetting = {
        id: competitionid,
        tag: defaultTag, // Use the provided default option
        value: textTags.includes(defaultTag) ? '' : 0 // Default to empty string or 0 depending on type
    };

    // Add the new setting to the data array
    data['settings'].push(newSetting);
    data['settings'].sort((a, b) => a.id - b.id);


    return newSetting;
}

function addSettingRow(setting, tbody) {
    const row = document.createElement('tr');
    row.dataset.id = setting.id; // Set data-id attribute
    row.dataset.tag = setting.tag; // Set data-tag attribute

    const tagCell = document.createElement('td');
    const valueCell = document.createElement('td');
    valueCell.classList.add('tablevalue');

    const select = document.createElement('select');
    select.classList.add('settingsselect');
    select.dataset.key = 'tag'; // Ensure this is set for duplicate checking

    // Populate the select options
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        if (option === setting.tag) optionElement.selected = true;
        select.appendChild(optionElement);
    });

    const input = document.createElement('input');
    input.type = textTags.includes(setting.tag) ? 'text' : 'number';
    input.value = setting.value !== null ? setting.value : (input.type === 'text' ? '' : 0);
    input.min = input.type === 'number' ? -1 : undefined;
    input.classList.add('tablevalue-input');

    // Event listener for tag change
    select.addEventListener('change', function () {
        //handleSettingTagChange(setting.id, setting.tag, select.value, select, input);
        setting.tag = select.value;  // Update the local variable to reflect the change
    });

    // Event listener for value change
    input.addEventListener('change', function () {
        
        if(input.value==''){
            deleteSetting(setting, select);
        }else{
            handleSettingValueChange(setting.id, setting.tag, input);
        }
    });

    tagCell.appendChild(select);
    valueCell.appendChild(input);
    row.appendChild(tagCell);
    row.appendChild(valueCell);
    tbody.appendChild(row);
}

/////////////current edits///////////////

function mapAndFilterMatchingEntries(id, tag) {

    const mappedEntries = data['settings'].map((entry, index) => ({ entry, index }));

    const filteredEntries = mappedEntries.filter(item => item.entry.id == id && item.entry.tag == tag);

    return filteredEntries;
}

// Helper function to find matching rows in the table
function findMatchingRows(tbody, tag) {
    const rows = tbody.querySelectorAll('tr');
    let matchingrows = [];

    rows.forEach((row) => {
        if (row.children[0].children[0].value == tag) {
            matchingrows.push(row);
        }
    });

    return matchingrows;
}

// Helper function to find the final matching index in matching rows
function findFinalMatchingIndex(matchingrows, element) {

    for (let i = 0; i < matchingrows.length; i++) {
        if (matchingrows[i] == element.parentElement.parentElement) {
            return i;
        }
    }
    return -1;
}

// Helper function to find matching indices in the data array
function findMatchingIndices(id, tag) {
    let matchingindices = [];
    data['settings'].forEach((entry, index) => { 
        if (entry.tag == tag && entry.id == id) {
            matchingindices.push(index);
        }
    });
    return matchingindices;
}

function handleSettingValueChange(id, tag, input) {

            const matchingEntries = mapAndFilterMatchingEntries(id, tag);
            let tbody = input.closest('tbody');
            const matchingrows = findMatchingRows(tbody, tag);
            let finalmatchingindex = findFinalMatchingIndex(matchingrows, input);

            if (finalmatchingindex === -1 || finalmatchingindex >= matchingEntries.length) {
                return;
            }

            let matchingentry = matchingEntries[finalmatchingindex].entry;

            if (matchingentry) {
                matchingentry.value = input.value;
            }        

}

function deleteSetting(setting, select) {
    const matchingEntries = mapAndFilterMatchingEntries(setting.id, setting.tag);
    let tbody = select.closest('tbody');
    const matchingrows = findMatchingRows(tbody, setting.tag);
    let finalmatchingindex = findFinalMatchingIndex(matchingrows, select);

    const row = select.parentElement.parentElement; 

    row.remove();

    const getnthmatchingindex = matchingEntries[finalmatchingindex].index;
    data['settings'].splice(getnthmatchingindex, 1);
    

}
