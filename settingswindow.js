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
    const settings = getDataForId('settings', competitionid);

    const table = document.createElement('table');
    table.classList.add('window-tables');
    const tbody = document.createElement('tbody');

    settings.forEach(setting => {
        const row = document.createElement('tr');
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
    
        // Event listener for tag change, without the duplicate check in the listener
        select.addEventListener('change', function () {
            handleSettingTagChange(setting.id, setting.tag, select.value, select, input);
            setting.tag = select.value;  // Update the local variable to reflect the change
        });

        // Event listener for value change
        input.addEventListener('change', function () {
            handleSettingValueChange(setting.id, setting.tag, input.value);
        });
    
        tagCell.appendChild(select);
        valueCell.appendChild(input);
        row.appendChild(tagCell);
        row.appendChild(valueCell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    div.appendChild(table);

    return div;
}

function handleSettingValueChange(id, tag, value){
    let setting = data['settings'].find(line=> line.id==id && line.tag==tag);
    setting.value=value;
}

function handleSettingTagChange(id, oldtag, newtag, select, input) {
    // Check for duplicate tags before proceeding
    if (!preventDupSetting(id, oldtag, newtag, select)) {
        return; // Exit if a duplicate is found
    }

    // Find the setting and update the tag
    let setting = data['settings'].find(line => line.id == id && line.tag == oldtag);
    if (setting) {
        setting.tag = newtag;

        // Check if the new tag requires a different input type
        const oldtagrequirestext = textTags.includes(oldtag);
        const newtagrequirestext = textTags.includes(newtag);

        if(oldtagrequirestext&&!newtagrequirestext){
            input.type = 'number';
            input.value = 0;  // Reset the input value if needed
            input.min = -1;    // Adjust the min value if applicable
        }

        if(!oldtagrequirestext&&newtagrequirestext){
            input.type = 'text';
            input.value = '';  // Reset the input value if needed
        }
    } else {
        createMessage(`Setting not found for ID: ${id} and tag: ${oldtag}`, 'error');
    }
}

function preventDupSetting(id, oldtag, newtag, select) {
    
    const isDuplicate = data['settings'].some(line => line.id == id && line.tag === newtag);

    if (isDuplicate) {
        createMessage("Duplicate setting tag", "error"); // Show error message
        select.value = oldtag;
        return false; // Indicate that the script should not continue
    }

    return true; // No duplicates found
}