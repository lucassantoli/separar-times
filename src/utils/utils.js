function compareStrength(a, b) { // for sorting players and selections
    return a.strength - b.strength;
}

function teamStrength(players) {
    return players.reduce(function(total, player) {return total + player.strength;}, 0);
}

function selectionStrength(players, selection) {
    return players.reduce(function(total, player, index) {return total + player.strength * selection[index];}, 0);
}

function nextPermutation(selection) { // reverse-lexicographical next permutation of a bit array
    var max = true, pos = selection.length, set = 1;
    while (pos-- && (max || !selection[pos])) if (selection[pos]) ++set; else max = false;
    if (pos < 0) return false;
    selection[pos] = 0;
    while (++pos < selection.length) selection[pos] = set-- > 0 ? 1 : 0;
    return true;
}

function swapPlayers(wTeam, sTeam, wSelect, sSelect) {
    for (var i = 0, j = 0; i < wSelect.length; i++) {
        if (wSelect[i]) {
            while (!sSelect[j]) ++j;
            var temp = wTeam[i];
            wTeam[i] = sTeam[j];
            sTeam[j++] = temp;
        }
    }
}

export function equalTeams(players) {
    // SORT PLAYERS FROM WEAKEST TO STRONGEST
    players.sort(compareStrength);
    // INITIAL DISTRIBUTION OF PLAYERS INTO WEAKER AND STRONGER TEAM (ALTERNATING)
    var wTeam = [], sTeam = [];
    for (var i = players.length % 2; i < players.length; i += 2) {
        wTeam.push(players[i]);
        sTeam.push(players[i + 1]);
    }
    var teamSize = wTeam.length;
    // CALCULATE INITIAL STRENGTH DIFFERENCE
    var initDiff = teamStrength(sTeam) - teamStrength(wTeam);
    var bestDiff = initDiff;
    var wBestSel = [], sBestSel = [];
    // CHECK SELECTIONS OF EVERY SIZE
    for (var selSize = 1; selSize < teamSize && bestDiff > 1; selSize++) {
        var wSelections = [], sSelections = [], selection = [];
        // CREATE INITIAL SELECTION BIT-ARRAY FOR WEAKER TEAM (SKIP PLAYER 1)
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < teamSize; i++)
            selection[i] = (i > 0 && i <= selSize) ? 1 : 0;
        // STORE ALL SELECTIONS FROM WEAKER TEAM AND THEIR STRENGTH
        do wSelections.push({selection: selection.slice(), strength: selectionStrength(wTeam, selection)});
        while (nextPermutation(selection));
        // SORT SELECTIONS FROM WEAKEST TO STRONGEST
        wSelections.sort(compareStrength);
        // CREATE INITIAL SELECTION BIT-ARRAY FOR STRONGER TEAM
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < teamSize; i++)
            selection[i] = (i < selSize) ? 1 : 0;
        // STORE ALL SELECTIONS FROM STRONGER TEAM AND THEIR STRENGTH
        do sSelections.push({selection: selection.slice(), strength: selectionStrength(sTeam, selection)});
        while (nextPermutation(selection));
        // SORT SELECTIONS FROM WEAKEST TO STRONGEST
        sSelections.sort(compareStrength);
        // ITERATE OVER SELECTIONS FROM BOTH TEAMS
        var wPos = 0, sPos = 0;
        while (wPos < wSelections.length && sPos < sSelections.length) {
            // CALCULATE STRENGTH DIFFERENCE IF THESE SELECTIONS WERE SWAPPED
            var wStrength = wSelections[wPos].strength, sStrength = sSelections[sPos].strength;
            var diff = Math.abs(initDiff - 2 * (sStrength - wStrength));
            // SET NEW BEST STRENGTH DIFFERENCE IF SMALLER THAN CURRENT BEST
            if (diff < bestDiff) {
                bestDiff = diff;
                wBestSel = wSelections[wPos].selection.slice();
                sBestSel = sSelections[sPos].selection.slice();
                // STOP SEARCHING IF PERFECT SOLUTION FOUND (DIFFERENCE 0 OR 1)
                if (bestDiff < 2) break;
            }
            // ADVANCE TO NEXT SELECTION FROM WEAKER OR STRONGER TEAM
            if (2 * (sStrength - wStrength) > initDiff) ++wPos; else ++sPos;
        }
    }
    // PERFORM SWAP OF BEST PAIR OF SELECTIONS FROM EACH TEAM
    swapPlayers(wTeam, sTeam, wBestSel, sBestSel);
    return {teams: [wTeam, sTeam], strengths: [teamStrength(wTeam), teamStrength(sTeam)]};
}

