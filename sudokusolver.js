var GRID = [];
var VALUES = [1,2,3,4,5,6,7,8,9];
var INPUTS = [];
var MESSAGE = "";
var STEPS = [];
var RHEADERS = [0,9,18,27,36,45,54,63,72];
var CHEADERS = [0,1,2,3,4,5,6,7,8];
var SHEADERS = [0,3,6,27,30,33,54,57,60];

initGrid = function() {
    for(var i = 0; i < 81; i ++) {
        var cell = {};
        cell.position = i;
        cell.done = false;
        cell.values = [1,2,3,4,5,6,7,8,9];
        cell.row = Math.floor(i / 9);
        cell.column = i % 9;
        cell.supercell = Math.floor(cell.column / 3) + (3 * Math.floor(cell.row / 3));
        GRID.push(cell);
    }
};

printAllCells = function() {
    for (var i = 0; i < 81; i++) {
        console.log(GRID[i]);
    }
};

allCellsInSame = function(selector, cell) {
    var cells = [];
    for (var i = 0; i < 81; i ++) {
        if (selector === 0) {
            if (GRID[i].row === cell.row) {
                cells.push(GRID[i]);
            }
        }
        else if (selector === 1) {
            if (GRID[i].column === cell.column) {
                cells.push(GRID[i]);
            }
        }
        else if (selector === 2) {
            if (GRID[i].supercell === cell.supercell) {
                cells.push(GRID[i]);
            }
        }
    }
    return cells;
};

printFinishedCells = function() {
    for (var i = 0; i < 81; i += 9) {
        var row = allCellsInSame(0, GRID[i]);
        var outputString = "";
        for (var cell = 0; cell < 9; cell ++) {
            if (row[cell].done) {
                outputString = outputString + row[cell].values[0];
            }
            else {
                outputString = outputString + "_";
            }
            outputString += " ";
        }
        console.log(outputString);
    }
};

countCellsDone = function() {
    var count = 0;
    for (var i = 0; i < 81; i ++) {
        if (GRID[i].done) {
            count += 1;
        }
    }
    return count;
};

// returns true if a reduction of values occurred
cleanAfterPlacing = function(cell, value) {

    // add all related cells to list, remove duplicates, and cell itself

    var cleanRow = allCellsInSame(0, cell);
    cleanRow.splice(cleanRow.indexOf(cell), 1);

    var cleanCol = allCellsInSame(1, cell);
    for (var cc = 0; cc < 9; cc ++) {
        cleanRow.push(cleanCol[cc]);
    }
    cleanRow.splice(cleanRow.indexOf(cell), 1);
    
    var relatedCells = [];
    for (var i = 0; i < 81; i ++) {
        if (((GRID[i].row === cell.row) || (GRID[i].column === cell.column) || (GRID[i].supercell === cell.supercell)) && GRID[i].position !== cell.position) {
            relatedCells.push(GRID[i]);
        }
    }

    for (var relatedCell = 0; relatedCell < relatedCells.length; relatedCell++ ) {
        var changed = scrubValue(relatedCells[relatedCell], value);
    }
    return changed;
};

// returns true if anything was scrubbed from the cell
scrubValue = function(cell, value) {
    var scrubbed = false;
    if (cell.done !== true) {
        var newValues = [];
        var preScrubLen = cell.values.length;
        for (var existingValue = 0; existingValue < cell.values.length; existingValue ++) {
            if (cell.values[existingValue] !== value) {
                newValues.push(cell.values[existingValue]);
            }
        }
        var postScrubLen = newValues.length;
        GRID[cell.position].values = newValues;
    }
    if (preScrubLen > postScrubLen) {
    	scrubbed = true;
    }
    return scrubbed;
};

// always returns true since progress was made
placeDefiniteValue = function(cell, value) {
    cell.done = true;
    cell.values = [value];
    cleanAfterPlacing(cell, value);
    return true;
};

// level 1 function - locates cell containing only 1 possible value
// if found, it places the found value and returns true

onlyOneValueLeft = function() {
    for (var i = 0; i < 81; i ++) {
        if ((GRID[i].done === false) && (GRID[i].values.length === 1)) {
            MESSAGE += "Cell " + i + " has " + GRID[i].values[0] + " as it's only possible value.";
            var progress = placeDefiniteValue(GRID[i], GRID[i].values[0]);
        	if (progress) {
        		return true;
        	}
       	}
    }
    return false;
};

// level 2 function - looks for the last occurrence of a unsolved value
// in a row, column, or supercell. if found, it places that value
// removes the value from other unsolved related cells and returns true

lastInstanceOfValueIn = function() {
    var freqs = [];
    var relatedCells =[];
    var headers = [];
    for (var i = 0; i < 3; i ++) {
        if (i === 0) {
            headers = RHEADERS;
            selector = 0;
        }
        else if (i === 1) {
            headers = CHEADERS;
            selector = 1;
        }
        else if (i === 2) {
            headers = SHEADERS;
            selector = 2;
        }
        for (var j = 0; j < 9; j ++) {
            relatedCells = allCellsInSame(selector, GRID[headers[j]]);

            var counts = frequencies(relatedCells);

            for (var countFreq = 0; countFreq < 9; countFreq ++) {
                if (counts[countFreq] === 1) {
                    // only one non-done instance of this number, find it and place
                    for (var cellIndex = 0; cellIndex < 9; cellIndex ++) {
                        var valueTest = relatedCells[cellIndex].values;
                        for (var valueIndex = 0; valueIndex < relatedCells[cellIndex].values.length; valueIndex ++) {
                            if (valueTest[valueIndex] === countFreq + 1) {
                                if (relatedCells[cellIndex].done === false) {
                                    var msg = "";
                                    if (selector === 0) {
                                        msg += "row";
                                    }
                                    if (selector === 1) {
                                        msg += "column";
                                    }
                                    if (selector === 2) {
                                        msg += "supercell";
                                    }
                                    MESSAGE += "Cell " + relatedCells[cellIndex].position + " contains the last instance of value " + (countFreq + 1) + " in that cell's " + msg + ".";
                                    placeDefiniteValue(relatedCells[cellIndex], countFreq + 1);
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
};

frequencies = function(cells) {
    var counts = [];
    for (var value = 1; value < 10; value ++) {
    	var count = 0;
    	for (var pcell = 0; pcell < cells.length; pcell ++) {
    		if (cells[pcell].values.indexOf(value) > -1) {
    		      count += 1;
    		}
    	}
    	counts.push(count);
    }
    return counts;
};

// function that searches for 2 lots of 2 values in a row/column/supercell
// returns true is cell value refinement is possible based on above occurrence
iiValues = function() {

	for (var rcs = 0; rcs < 3; rcs ++) {
		if (rcs === 0) {
			// process rows
			var headers = RHEADERS;
			var selector = rcs;
		}
		else if (rcs === 1) {
			// process columns
			var headers = CHEADERS;
			var selector = rcs;
		}
		else if (rcs === 2) {
			// process supercells
			var headers = SHEADERS;
			var selector = rcs;
		}
		for (var header = 0; header < 9; header ++) {
            var otherCells = allCellsInSame(selector, GRID[headers[header]]);

            var interestingCells = [];

            for (var otherCell = 0; otherCell < 9; otherCell ++) {
                if (otherCells[otherCell].done !== true) {
                    interestingCells.push(otherCells[otherCell]);
                }
            }
            var frequencyOfValues = frequencies(interestingCells);

            var worthwhile = 0;
            for (var aValue = 0; aValue < 9; aValue ++) {
                if (frequencyOfValues[aValue] >= 2) {
                    worthwhile += 1;
                }
            }


            if (worthwhile >= 2) {

                // pick 2 values from interesting values to work with
                var currentValues = [];
                for (var valueA = 0; valueA < 9; valueA ++) {
                    if (frequencyOfValues[valueA] >= 2) {
                        currentValues.push(valueA + 1);

                        for (var valueB = valueA + 1; valueB < 9; valueB ++) {
                            if (frequencyOfValues[valueB] >= 2) {
                                currentValues.push(valueB + 1);

                                // make list of cells that currentValues occur in together (with or without others)
                                var inList = [];
                                // outlist useful?

                                for (var interestingCell = 0; interestingCell < interestingCells.length; interestingCell ++) {
                                    if (interestingCells[interestingCell].values.indexOf(currentValues[0]) > -1) {
                                        if (interestingCells[interestingCell].values.indexOf(currentValues[1]) > -1) {
                                            inList.push(interestingCells[interestingCell]);
                                        }
                                    }
                                }

                                // section to find pairs "hidden" amongst other values

                                if (inList.length === 2) {
                                    // check frequencies were both 2
                                    if (frequencyOfValues[currentValues[0] - 1] === 2) {
                                        if (frequencyOfValues[currentValues[1] -1] === 2) {

                                            var notInList = [];
                                            for (var ic = 0; ic < interestingCells.length; ic ++) {
                                                if (interestingCells[ic].position !== inList[0].position) {
                                                    if (interestingCells[ic].position !== inList[1].position) {
                                                        notInList.push(interestingCells[ic]);
                                                    }
                                                }
                                            }

                                            var scrubbed = 0;
                                            for (var ilc = 0; ilc < inList.length; ilc ++) {
                                                var scrubbers = [];
                                                for (var ilv = 0; ilv < inList[ilc].values.length; ilv ++) {
                                                    if (inList[ilc].values[ilv] !== currentValues[0]) {
                                                        if (inList[ilc].values[ilv] !== currentValues[1]) {
                                                            scrubbers.push(inList[ilc].values[ilv]);
                                                        }
                                                    }
                                                }

                                                for (var sv = 0; sv < scrubbers.length; sv ++) {
                                                    if (scrubValue(inList[ilc], scrubbers[sv])) {
                                                        scrubbed += 1;
                                                    }
                                                }

                                                    
                                            }

                                            for (var nilc = 0; nilc < notInList.length; nilc ++) {
                                                var scrubbers = currentValues;
                                                for (var sv = 0; sv < scrubbers.length; sv ++) {
                                                    if (scrubValue(notInList[nilc], scrubbers[sv])) {
                                                        scrubbed += 1;
                                                    }
                                                }
                                            }
                                            
                                            if (scrubbed > 0) {
                                                var msg = "";
                                                if (selector === 0) {
                                                    msg += "row";
                                                }
                                                if (selector === 1) {
                                                    msg += "column";
                                                }
                                                if (selector === 2) {
                                                    msg += "supercell";
                                                }                                                
                                                MESSAGE += "Refined possible values in " + msg + " " + header + " based on the occurrence of the values " + currentValues[0] + " and " + currentValues[1] + ".";
                                                return true;
                                            }
                                        }
                                    }
                                }

                                // this function working perfectly to this point i.e. =2 ok

                                // the below section hasn't been tested as no problem has required it !!!!!!!!!!!!!!!!!!!!!!!!!!!

                                // section to find pairs occuring multiple times but also on their own twice

                                if (inList.length > 2) {

                                    // make list of cells that contain only 2 values
                                    var doubleCells = [];
                                    for (var poss2 = 0; poss2 < interestingCells.length; poss2 ++) {
                                        if (interestingCells[poss2].values.length === 2) {
                                            doubleCells.push(interestingCells[poss2]);
                                        }
                                    }

                                    // check the doubleCells against the currentValues
                                    var inPair = [];
                                    for (var cell2 = 0; cell2 < doubleCells.length; cell2 ++) {
                                        if (doubleCells[cell2].values.indexOf(currentValues[0]) > -1) {
                                            if (doubleCells[cell2].values.indexOf(currentValues[1]) > -1) {
                                                // this cell contained only both the current values
                                                inPair.push(doubleCells[cell2]);
                                            }
                                        }
                                    }

                                    if (inPair.length === 2) {
                                        // make list of interesting cells minus the notinpair cells
                                        var notInPair = [];

                                        for (var ic = 0; ic < interestingCells.length; ic ++) {
                                            if (interestingCells[ic].position !== inPair[0].position) {
                                                if (interestingCells[ic].position !== inPair[1].position) {
                                                    notInPair.push(interestingCells[ic]);
                                                }
                                            }
                                        }

                                        for (var nilc = 0; nilc < notInList.length; nilc ++) {
                                            var scrubbers = currentValues;
                                            for (var sv = 0; sv < scrubbers.length; sv ++) {
                                                if (scrubValue(notInList[nilc], scrubbers[sv])) {
                                                    scrubbed += 1;
                                                }
                                            }
                                        }
                                        
                                        if (scrubbed > 0) {
                                            var msg = "";
                                            if (selector === 0) {
                                                msg += "row";
                                            }
                                            if (selector === 1) {
                                                msg += "column";
                                            }
                                            if (selector === 2) {
                                                msg += "supercell";
                                            }                                                
                                            MESSAGE += "Refined possible values in " + msg + " " + header + " based on the occurrence of the values " + currentValues[0] + " and " + currentValues[1] + ".";
                                            return true;
                                        }
                                    }
                                }
                                currentValues.pop();
                            }
                        }
                        currentValues.pop();
                    }
                }                
            }
        }
	}
    return false;
};

// function that searches for 3 lots of 3 values in a row/column/supercell
// returns true is cell value refinement is possible based on above occurrence

iiiValues = function() {

    // this function completely untested as no puzzle has called for it !!!!!!!!!

    for (var rcs = 0; rcs < 3; rcs ++) {
        if (rcs === 0) {
            // process rows
            var headers = RHEADERS;
            var selector = rcs;
        }
        else if (rcs === 1) {
            // process columns
            var headers = CHEADERS;
            var selector = rcs;
        }
        else if (rcs === 2) {
            // process supercells
            var headers = SHEADERS;
            var selector = rcs;
        }
        for (var header = 0; header < 9; header ++) {
            var otherCells = allCellsInSame(selector, GRID[headers[header]]);

            var interestingCells = [];

            for (var otherCell = 0; otherCell < 9; otherCell ++) {
                if (otherCells[otherCell].done !== true) {
                    interestingCells.push(otherCells[otherCell]);
                }
            }
            var frequencyOfValues = frequencies(interestingCells);

            var worthwhile = 0;
            for (var aValue = 0; aValue < 9; aValue ++) {
                if (frequencyOfValues[aValue] >= 3) {
                    worthwhile += 1;
                }
            }

            if (worthwhile >= 3) {
                // pick 3 values from interesting values to work with
                var currentValues = [];
                for (var valueA = 0; valueA < 9; valueA ++) {
                    if (frequencyOfValues[valueA] >= 3) {
                        currentValues.push(valueA + 1);

                        for (var valueB = valueA + 1; valueB < 9; valueB ++) {
                            if (frequencyOfValues[valueB] >= 3) {
                                currentValues.push(valueB + 1);

                                // new
                                for (var valueC = valueB + 1; valueC < 9; valueC ++) {
                                    if (frequencyOfValues[valueC] >= 3) {
                                        currentValues.push(valueC + 1);

                                        // make list of cells that currentValues occur in together (with or without others)
                                        var inList = [];
                                        // outlist useful?

                                        for (var interestingCell = 0; interestingCell < interestingCells.length; interestingCell ++) {
                                            if (interestingCells[interestingCell].values.indexOf(currentValues[0]) > -1) {
                                                if (interestingCells[interestingCell].values.indexOf(currentValues[1]) > -1) {
                                                    if (interestingCells[interestingCell].values.indexOf(currentValues[2]) > -1) {
                                                        inList.push(interestingCells[interestingCell]);                                                        
                                                    }

                                                }
                                            }
                                        }

                                        // section to find triples "hidden" amongst other values

                                        if (inList.length === 3) {
                                            // check frequencies were all 3
                                            if (frequencyOfValues[currentValues[0] - 1] === 3) {
                                                if (frequencyOfValues[currentValues[1] -1] === 3) {
                                                    if (frequencyOfValues[currentValues[2] -1] === 3) {

                                                        var notInList = [];
                                                        for (var ic = 0; ic < interestingCells.length; ic ++) {
                                                            if (interestingCells[ic].position !== inList[0].position) {
                                                                if (interestingCells[ic].position !== inList[1].position) {
                                                                    if (interestingCells[ic].position !== inList[2].position) {
                                                                        notInList.push(interestingCells[ic]);
                                                                    }
                                                                }
                                                            }
                                                        }

                                                        var scrubbed = 0;
                                                        for (var ilc = 0; ilc < inList.length; ilc ++) {
                                                            var scrubbers = [];
                                                            for (var ilv = 0; ilv < inList[ilc].values.length; ilv ++) {
                                                                if (inList[ilc].values[ilv] !== currentValues[0]) {
                                                                    if (inList[ilc].values[ilv] !== currentValues[1]) {
                                                                        if (inList[ilc].values[ilv] !== currentValues[2]) {
                                                                            scrubbers.push(inList[ilc].values[ilv]);
                                                                        }
                                                                    }
                                                                }
                                                            }

                                                            for (var sv = 0; sv < scrubbers.length; sv ++) {
                                                                if (scrubValue(inList[ilc], scrubbers[sv])) {
                                                                    scrubbed += 1;
                                                                }
                                                            }

                                                                
                                                        }

                                                        for (var nilc = 0; nilc < notInList.length; nilc ++) {
                                                            var scrubbers = currentValues;
                                                            for (var sv = 0; sv < scrubbers.length; sv ++) {
                                                                if (scrubValue(notInList[nilc], scrubbers[sv])) {
                                                                    scrubbed += 1;
                                                                }
                                                            }
                                                        }
                                                        
                                                        if (scrubbed > 0) {
                                                            var msg = "";
                                                            if (selector === 0) {
                                                                msg += "row";
                                                            }
                                                            if (selector === 1) {
                                                                msg += "column";
                                                            }
                                                            if (selector === 2) {
                                                                msg += "supercell";
                                                            }                                                
                                                            MESSAGE += "Refined possible values in " + msg + " " + header + " based on the occurrence of the values " + currentValues[0] + ", " + currentValues[1] + " and " + currentValues[2] + ".";
                                                            return true;
                                                        }

                                                    }

                                                }
                                            }
                                        }

                                        // section to find triples occuring multiple times but also on their own thrice

                                        if (inList.length > 3) {

                                            // make list of cells that contain only 3 values
                                            var tripleCells = [];
                                            for (var poss3 = 0; poss3 < interestingCells.length; poss3 ++) {
                                                if (interestingCells[poss3].values.length === 3) {
                                                    tripleCells.push(interestingCells[poss3]);
                                                }
                                            }

                                            // check the tripleCells against the currentValues
                                            var inTri =[];//inPair = [];
                                            for (var cell3 = 0; cell3 < tripleCells.length; cell3 ++) {
                                                if (tripleCells[cell3].values.indexOf(currentValues[0]) > -1) {
                                                    if (tripleCells[cell3].values.indexOf(currentValues[1]) > -1) {
                                                        if (tripleCells[cell3].values.indexOf(currentValues[2]) > -1) {
                                                            // this cell contained only the current values
                                                            inTri.push(tripleCells[cell3]);
                                                        }
                                                    }
                                                }
                                            }

                                            if (inTri.length === 3) {
                                                // make list of interesting cells minus the notintri cells

                                                var notInTri = [];

                                                for (var ic = 0; ic < interestingCells.length; ic ++) {
                                                    if (interestingCells[ic].position !== inTri[0].position) {
                                                        if (interestingCells[ic].position !== inTri[1].position) {
                                                            if (interestingCells[ic].position !== inTri[2].position) {
                                                                notInTri.push(interestingCells[ic]);
                                                            }
                                                        }
                                                    }
                                                }

                                                for (var nilc = 0; nilc < notInList.length; nilc ++) {
                                                    var scrubbers = currentValues;
                                                    for (var sv = 0; sv < scrubbers.length; sv ++) {
                                                        if (scrubValue(notInList[nilc], scrubbers[sv])) {
                                                            scrubbed += 1;
                                                        }
                                                    }
                                                }
                                                
                                                if (scrubbed > 0) {
                                                    var msg = "";
                                                    if (selector === 0) {
                                                        msg += "row";
                                                    }
                                                    if (selector === 1) {
                                                        msg += "column";
                                                    }
                                                    if (selector === 2) {
                                                        msg += "supercell";
                                                    }                                                
                                                    MESSAGE += "Refined possible values in " + msg + " " + header + " based on the occurrence of the values " + currentValues[0] + ", " + currentValues[1] + " and " + currentValues[2] + ".";
                                                    return true;
                                                }
                                            }
                                        }                                                
                                        currentValues.pop();
                                    }
                                }
                                currentValues.pop();
                            }
                        }
                        currentValues.pop();
                    }
                }                
            }
        }
    }
    return false;
};

// wrapper to process the variants of level 3 function (iiValues and iiiValues)

iWrapper = function() {
    if (iiValues()) {
        return true;
    }
    else {
        return iiiValues();
    }
};

// level 4 function - checks unsolved cells in supercells for a remaining value
// that only occurs in the same row or column. if it does the value is removed
// from that same row or column where it extends outside the supercell into others
// warning - very lazy and longwinded coding, could be done a lot better!

supercellExtensions = function() {

    var progress = false;
    var relatedCells =[];
    var headers = SHEADERS;

    for (var i = 0; i < 9; i ++) {
        relatedCells = allCellsInSame(2, GRID[headers[i]]);

    // find non-definite values in related cells
        var nonDefs = [1,2,3,4,5,6,7,8,9];
        for (var c = 0; c < 9; c ++) {
            if (relatedCells[c].done === true) {
                var iValue = nonDefs.indexOf(relatedCells[c].values[0]);
                if (iValue > -1) {
                    nonDefs.splice(iValue, 1);
                }
            }
        }

    // count number of occurrences for each non definite
        for (var n = 0; n < nonDefs.length; n ++) {
            var ndCells = [];
            for (var c = 0; c < 9; c ++) {
                var cVals = relatedCells[c].values;
                if (cVals.indexOf(nonDefs[n]) > -1) {
                    ndCells.push(relatedCells[c]);
                }
            }

            var changedanything = false;

            // look for 2 occurrences in same supercell mini row or mini column
            if (ndCells.length === 2) {
                if (ndCells[0].row === ndCells[1].row) {
                    //console.log("found 2 nds in a supercell internal row " + ndCells[0].position + " " + ndCells[1].position + " " + nonDefs[n]);
                    // shared row so extend row out of supercell
                    var fullRow = allCellsInSame(0, ndCells[0]);
                    var extendedRow = [];
                    for (z = 0; z < 9; z ++) {
                        if (fullRow[z].supercell !== ndCells[0].supercell) {
                            extendedRow.push(fullRow[z]);
                        }
                    }
                    //console.log(extendedRow);

                    // scrub value from cell in extended row if present in values
                    // must include changedanything flag to avoid reworking same cells in each cycle
                    for (k = 0; k < 6; k ++) {
                        var workCell = extendedRow[k];
                        if (workCell.values.indexOf(nonDefs[n]) > -1) {
                            changedanything = true;
                            //console.log("before " + workCell.values + " cell " + workCell.position);
                            scrubValue(workCell, nonDefs[n]);
                            //console.log("after " + workCell.values + " cell " + workCell.position);
                        }
                    }
                    if (changedanything) {
                        MESSAGE += "Refined possible values in row " + ndCells[0].row + " based on where " + nonDefs[n] + " occurs in supercell " + i + ".";
                        console.log("L4, returning true for 2 in row " + ndCells[0].row);
                        return true;
                    }
                }

                if (ndCells[0].column === ndCells[1].column) {
                    //console.log("found 2 nds in a supercell internal column " + ndCells[0].position + " " + ndCells[1].position + " " + nonDefs[n]);
                    //share column, extend and clean
                    var fullColumn = allCellsInSame(1, ndCells[0]);
                    var extendedColumn = [];
                    for (z = 0; z < 9; z ++) {
                        if (fullColumn[z].supercell !== ndCells[0].supercell) {
                            extendedColumn.push(fullColumn[z]);
                        }
                    }
                    
                    // scrub value from cell in extended column if present in values
                    // must include changedanything flag to avoid reworking same cells in each cycle
                    for (k = 0; k < 6; k ++) {
                        var workCell = extendedColumn[k];
                        if (workCell.values.indexOf(nonDefs[n]) > -1) {
                            changedanything = true;
                            //console.log("before " + workCell.values + " cell " + workCell.position);
                            scrubValue(workCell, nonDefs[n]);
                            //console.log("after " + workCell.values + " cell " + workCell.position);
                        }
                    }
                    if (changedanything) {
                        MESSAGE += "Refined possible values in column " + ndCells[0].column + " based on where " + nonDefs[n] + " occurs in supercell " + i + ".";
                        console.log("L4, returning true for 2 in column " + ndCells[0].column);
                        return true;
                    }
                }
            }

            // look for 3 occurrences in same supercell mini row or mini column
            if (ndCells.length === 3) {
                if ((ndCells[0].row === ndCells[1].row) && (ndCells[0].row === ndCells[2].row) && (ndCells[1].row === ndCells[2].row)) {
                    //console.log("found 3 nds in a supercell internal row " + ndCells[0].position + " " + ndCells[1].position + " " + ndCells[2].position + " " + nonDefs[n]);
                    // share row, extend and clean
                    var fullRow = allCellsInSame(0, ndCells[0]);
                    var extendedRow = [];
                    for (z = 0; z < 9; z ++) {
                        if (fullRow[z].supercell !== ndCells[0].supercell) {
                            extendedRow.push(fullRow[z]);
                        }
                    }
                    //console.log(extendedRow);

                    // scrub value from cell in extended row if present in values
                    // must include changedanything flag to avoid reworking same cells in each cycle
                    for (k = 0; k < 6; k ++) {
                        var workCell = extendedRow[k];
                        if (workCell.values.indexOf(nonDefs[n]) > -1) {
                            changedanything = true;
                            //console.log("before " + workCell.values + " cell " + workCell.position);
                            scrubValue(workCell, nonDefs[n]);
                            //console.log("after " + workCell.values + " cell " + workCell.position);
                        }
                    }
                    if (changedanything) {
                        MESSAGE += "Refined possible values in row " + ndCells[0].row + " based on where " + nonDefs[n] + " occurs in supercell " + i + ".";
                        console.log("L4, returning true for 3 in row " + ndCells[0].row);
                        return true;
                    }
                }
                if ((ndCells[0].column === ndCells[1].column) && (ndCells[0].column === ndCells[1].column) && (ndCells[1].column === ndCells[2].column)) {
                    //console.log("found 3 nds in a supercell internal column " + ndCells[0].position + " " + ndCells[1].position + " " + ndCells[2].position  + " " + nonDefs[n]);
                    //share column, extend and clean
                    var fullColumn = allCellsInSame(1, ndCells[0]);
                    var extendedColumn = [];
                    for (z = 0; z < 9; z ++) {
                        if (fullColumn[z].supercell !== ndCells[0].supercell) {
                            extendedColumn.push(fullColumn[z]);
                        }
                    }
                    //console.log(extendedColumn);
                    
                    // scrub value from cell in extended column if present in values
                    // must include changedanything flag to avoid reworking same cells in each cycle
                    for (k = 0; k < 6; k ++) {
                        var workCell = extendedColumn[k];
                        if (workCell.values.indexOf(nonDefs[n]) > -1) {
                            changedanything = true;
                            //console.log("before " + workCell.values + " cell " + workCell.position);
                            scrubValue(workCell, nonDefs[n]);
                            //console.log("after " + workCell.values + " cell " + workCell.position);
                        }
                    }
                    if (changedanything) {
                        MESSAGE += "Refined possible values in column " + ndCells[0].column + " based on where " + nonDefs[n] + " occurs in supercell " + i + ".";
                        console.log("L4, returning true for 3 in column " + ndCells[0].column);
                        return true;
                    }
                }
            }
        }
    }
    console.log("L4, returning false");
    return false;
};

// level 5 function - produces a 3x3 pattern per supercell big row or column
// uses 3x3 occurrence patterns in 2 supercells to refine possible values in 
// the 3rd supercell and scrubs those values in the subrow/col of the third
// warning - very lazy and longwinded coding, could be done a lot better!

patternMatcher = function() {
    // work supercell rows, then columns
    for (var scDir = 0; scDir < 2; scDir ++) {
        console.log("direction " + scDir);
        if (scDir === 0) {
            var dirText = "row";
        }
        if (scDir === 1) {
            var dirText = "column";
        }
        // work the three supercell units within the above
        for (var scUnit = 0; scUnit < 3; scUnit ++) {
            // generate the low level row/column header array positions to work with
            if (scDir === 0) {
                var cellUnit1 = allCellsInSame(0, GRID[RHEADERS[0 + (scUnit * 3)]]);
                var cellUnit2 = allCellsInSame(0, GRID[RHEADERS[1 + (scUnit * 3)]]);
                var cellUnit3 = allCellsInSame(0, GRID[RHEADERS[2 + (scUnit * 3)]]);
            }
            else if (scDir === 1) {
                var cellUnit1 = allCellsInSame(1, GRID[CHEADERS[0 + (scUnit * 3)]]);
                var cellUnit2 = allCellsInSame(1, GRID[CHEADERS[1 + (scUnit * 3)]]);
                var cellUnit3 = allCellsInSame(1, GRID[CHEADERS[2 + (scUnit * 3)]]);
            }

            // slice cellUnits into 1st three, 2nd three and 3rd three from each set of related cells
            var sliced = [cellUnit1.slice(0,3), cellUnit2.slice(0,3), cellUnit3.slice(0,3), cellUnit1.slice(3,6), cellUnit2.slice(3,6), cellUnit3.slice(3,6), cellUnit1.slice(6,9), cellUnit2.slice(6,9), cellUnit3.slice(6,9)];

            // flag presence of values in slices
            // test each value
            for (var testValue = 1; testValue < 10; testValue ++) {
                var presence = [];
                // get each block of 3 from slices
                for (var cellUnit = 0; cellUnit < 9; cellUnit ++) {
                    var present = 0;
                    // get each cell from each block of 3
                    for (var testCell = 0; testCell < 3; testCell ++) {
                        var tCell = sliced[cellUnit][testCell];
                        if (tCell.values.indexOf(testValue) > -1) {
                            present += 1;
                        }
                    }
                    if (present >= 1) {
                        presence.push(1);
                    } 
                    else {
                        presence.push(0);
                    }
                }

                // condense presence to pattern code the lazy way
                var patternCodes = [];
                patternCodes.push((presence[0] * 4) + (presence[1] * 2) + (presence[2] * 1));
                patternCodes.push((presence[3] * 4) + (presence[4] * 2) + (presence[5] * 1));
                patternCodes.push((presence[6] * 4) + (presence[7] * 2) + (presence[8] * 1));
                console.log(patternCodes);

                // look for useful patterns
                var progress = false;

                // double 3s
                if ((patternCodes[0] === 3) && (patternCodes[1] === 3) && (patternCodes[2] === 5)) {       
                    console.log("335 scrub testValue from sliced[8] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[8][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }
                }
                if ((patternCodes[0] === 3) && (patternCodes[1] === 5) && (patternCodes[2] === 3)) {       
                    console.log("353 scrub testValue from sliced[5] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[5][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }
                }
                if ((patternCodes[0] === 5) && (patternCodes[1] === 3) && (patternCodes[2] === 3)) {       
                    console.log("533 scrub testValue from sliced[2] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[2][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }
                }
                if ((patternCodes[0] === 3) && (patternCodes[1] === 3) && (patternCodes[2] === 6)) {       
                    console.log("336 scrub testValue from sliced[7] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[7][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }
                }
                if ((patternCodes[0] === 3) && (patternCodes[1] === 6) && (patternCodes[2] === 3)) {       
                    console.log("363 scrub testValue from sliced[4] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[4][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                    
                }
                if ((patternCodes[0] === 6) && (patternCodes[1] === 3) && (patternCodes[2] === 3)) {       
                    console.log("633 scrub testValue from sliced[1] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[1][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                    
                }
                if ((patternCodes[0] === 3) && (patternCodes[1] === 3) && (patternCodes[2] === 7)) {       
                    console.log("337 scrub testValue from sliced[7] & [8] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[7][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[8][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                  
                }
                if ((patternCodes[0] === 3) && (patternCodes[1] === 7) && (patternCodes[2] === 3)) {       
                    console.log("373 scrub testValue from sliced[4] & [5] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[4][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[5][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                    
                }
                if ((patternCodes[0] === 7) && (patternCodes[1] === 3) && (patternCodes[2] === 3)) {       
                    console.log("733 scrub testValue from sliced[1] & [2] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[1][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[2][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                    
                }

                // double 5s
                if ((patternCodes[0] === 5) && (patternCodes[3] === 5) && (patternCodes[2] === 3)) {       
                    console.log("553 scrub testValue from sliced[8] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[8][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 5) && (patternCodes[1] === 3) && (patternCodes[2] === 5)) {       
                    console.log("535 scrub testValue from sliced[5] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[5][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 3) && (patternCodes[1] === 5) && (patternCodes[2] === 5)) {       
                    console.log("355 scrub testValue from sliced[2] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[2][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 5) && (patternCodes[1] === 5) && (patternCodes[2] === 6)) {       
                    console.log("556 scrub testValue from sliced[6] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[6][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 5) && (patternCodes[1] === 6) && (patternCodes[2] === 5)) {       
                    console.log("565 scrub testValue from sliced[3] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[3][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 6) && (patternCodes[1] === 5) && (patternCodes[2] === 5)) {       
                    console.log("655 scrub testValue from sliced[0] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[0][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 5) && (patternCodes[1] === 5) && (patternCodes[2] === 7)) {       
                    console.log("557 scrub testValue from sliced[6] & [8] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[6][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[8][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                       
                }
                if ((patternCodes[0] === 5) && (patternCodes[1] === 7) && (patternCodes[2] === 5)) {       
                    console.log("575 scrub testValue from sliced[3] & [5] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[3][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[5][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                       
                }
                if ((patternCodes[0] === 7) && (patternCodes[1] === 5) && (patternCodes[2] === 5)) {       
                    console.log("755 scrub testValue from sliced[0] & [2] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[0][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[2][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                       
                }

                // double 6s
                if ((patternCodes[0] === 6) && (patternCodes[3] === 6) && (patternCodes[2] === 3)) {       
                    console.log("663 scrub testValue from sliced[7] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[7][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 6) && (patternCodes[1] === 3) && (patternCodes[2] === 6)) {       
                    console.log("636 scrub testValue from sliced[4] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[4][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 3) && (patternCodes[1] === 6) && (patternCodes[2] === 6)) {       
                    console.log("366 scrub testValue from sliced[1] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[1][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 6) && (patternCodes[1] === 6) && (patternCodes[2] === 5)) {       
                    console.log("665 scrub testValue from sliced[6] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[6][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 6) && (patternCodes[1] === 5) && (patternCodes[2] === 6)) {       
                    console.log("656 scrub testValue from sliced[3] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[3][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 5) && (patternCodes[1] === 6) && (patternCodes[2] === 6)) {       
                    console.log("566 scrub testValue from sliced[0] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[0][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                      
                }
                if ((patternCodes[0] === 6) && (patternCodes[1] === 6) && (patternCodes[2] === 7)) {       
                    console.log("667 scrub testValue from sliced[6] & [7] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[6][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[7][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                       
                }
                if ((patternCodes[0] === 6) && (patternCodes[1] === 7) && (patternCodes[2] === 6)) {       
                    console.log("676 scrub testValue from sliced[3] & [4] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[3][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[4][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                       
                }
                if ((patternCodes[0] === 7) && (patternCodes[1] === 6) && (patternCodes[2] === 6)) {       
                    console.log("766 scrub testValue from sliced[0] & [1] " + testValue);       
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[0][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[1][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }
                }

                // single 125s
                if (((patternCodes[0] === 1) && (patternCodes[1] === 2) && (patternCodes[2] === 5)) || ((patternCodes[0] === 2) && (patternCodes[1] === 1) && (patternCodes[2] === 5))) {
                    console.log("125/215 scrub testValue from sliced[8] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[8][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }
                if (((patternCodes[0] === 1) && (patternCodes[1] === 5) && (patternCodes[2] === 2)) || ((patternCodes[0] === 2) && (patternCodes[1] === 5) && (patternCodes[2] === 1))) {
                    console.log("152/251 scrub testValue from sliced[5] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[5][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }
                if (((patternCodes[0] === 5) && (patternCodes[1] === 2) && (patternCodes[2] === 1)) || ((patternCodes[0] === 5) && (patternCodes[1] === 1) && (patternCodes[2] === 2))) {
                    console.log("521/512 scrub testValue from sliced[2] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[2][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }

                // single 126s
                if (((patternCodes[0] === 1) && (patternCodes[1] === 2) && (patternCodes[2] === 6)) || ((patternCodes[0] === 2) && (patternCodes[1] === 1) && (patternCodes[2] === 6))) {                
                    console.log("126/216 scrub testValue from sliced[7] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[7][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }
                if (((patternCodes[0] === 1) && (patternCodes[1] === 6) && (patternCodes[2] === 2)) || ((patternCodes[0] === 2) && (patternCodes[1] === 6) && (patternCodes[2] === 1))) {
                    console.log("162/261 scrub testValue from sliced[4] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[4][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }
                if (((patternCodes[0] === 6) && (patternCodes[1] === 2) && (patternCodes[2] === 1)) || ((patternCodes[0] === 6) && (patternCodes[1] === 1) && (patternCodes[2] === 2))) {
                    console.log("621/612 scrub testValue from sliced[1] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[1][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }

                // single 127s
                if (((patternCodes[0] === 1) && (patternCodes[1] === 2) && (patternCodes[2] === 7)) || ((patternCodes[0] === 2) && (patternCodes[1] === 1) && (patternCodes[2] === 7))) {
                    console.log("127/217 scrub testValue from sliced[7] & [8] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[7][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[8][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                  
                }
                if (((patternCodes[0] === 1) && (patternCodes[1] === 7) && (patternCodes[2] === 2)) || ((patternCodes[0] === 2) && (patternCodes[1] === 7) && (patternCodes[2] === 1))) {
                    console.log("172/271 scrub testValue from sliced[4] & [5] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[4][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[5][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                    
                }
                if (((patternCodes[0] === 7) && (patternCodes[1] === 2) && (patternCodes[2] === 1)) || ((patternCodes[0] === 7) && (patternCodes[1] === 1) && (patternCodes[2] === 2))) {
                    console.log("721/712 scrub testValue from sliced[1] & [2] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[1][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[2][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                    
                }

                // single 243s
                if (((patternCodes[0] === 2) && (patternCodes[1] === 4) && (patternCodes[2] === 3)) || ((patternCodes[0] === 4) && (patternCodes[1] === 2) && (patternCodes[2] === 3))) {                
                    console.log("243/423 scrub testValue from sliced[7] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[7][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }
                if (((patternCodes[0] === 2) && (patternCodes[1] === 3) && (patternCodes[2] === 4)) || ((patternCodes[0] === 4) && (patternCodes[1] === 3) && (patternCodes[2] === 2))) {
                    console.log("234/432 scrub testValue from sliced[4] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[4][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }
                if (((patternCodes[0] === 3) && (patternCodes[1] === 2) && (patternCodes[2] === 4)) || ((patternCodes[0] === 3) && (patternCodes[1] === 4) && (patternCodes[2] === 2))) {
                    console.log("324/342 scrub testValue from sliced[1] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[1][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }

                // single 245s
                if (((patternCodes[0] === 2) && (patternCodes[1] === 4) && (patternCodes[2] === 5)) || ((patternCodes[0] === 4) && (patternCodes[1] === 2) && (patternCodes[2] === 5))) {
                    console.log("245/425 scrub testValue from sliced[6] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[6][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }
                if (((patternCodes[0] === 2) && (patternCodes[1] === 5) && (patternCodes[2] === 4)) || ((patternCodes[0] === 4) && (patternCodes[1] === 5) && (patternCodes[2] === 2))) {
                    console.log("254/452 scrub testValue from sliced[3] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[3][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }                
                if (((patternCodes[0] === 5) && (patternCodes[1] === 2) && (patternCodes[2] === 4)) || ((patternCodes[0] === 5) && (patternCodes[1] === 4) && (patternCodes[2] === 2))) {
                    console.log("524/542 scrub testValue from sliced[0] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[0][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }

                // single 247s
                if (((patternCodes[0] === 2) && (patternCodes[1] === 4) && (patternCodes[2] === 7)) || ((patternCodes[0] === 4) && (patternCodes[1] === 2) && (patternCodes[2] === 7))) {
                    console.log("247/427 scrub testValue from sliced[6] & [7] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[6][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[7][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                       
                }
                if (((patternCodes[0] === 2) && (patternCodes[1] === 7) && (patternCodes[2] === 4)) || ((patternCodes[0] === 4) && (patternCodes[1] === 7) && (patternCodes[2] === 2))) {
                    console.log("274/472 scrub testValue from sliced[3] & [4] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[3][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[4][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                       
                }
                if (((patternCodes[0] === 7) && (patternCodes[1] === 2) && (patternCodes[2] === 4)) || ((patternCodes[0] === 7) && (patternCodes[1] === 4) && (patternCodes[2] === 2))) {
                    console.log("724/742 scrub testValue from sliced[0] & [1] " + testValue);       
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[0][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[1][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }
                }

                // single 143s
                if (((patternCodes[0] === 1) && (patternCodes[1] === 4) && (patternCodes[2] === 3)) || ((patternCodes[0] === 4) && (patternCodes[1] === 1) && (patternCodes[2] === 3))) {
                    console.log("143/413 scrub testValue from sliced[8] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[8][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }
                if (((patternCodes[0] === 1) && (patternCodes[1] === 3) && (patternCodes[2] === 4)) || ((patternCodes[0] === 4) && (patternCodes[1] === 3) && (patternCodes[2] === 1))) {
                    console.log("134/431 scrub testValue from sliced[5] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[5][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }
                if (((patternCodes[0] === 3) && (patternCodes[1] === 1) && (patternCodes[2] === 4)) || ((patternCodes[0] === 3) && (patternCodes[1] === 4) && (patternCodes[2] === 1))) {
                    console.log("314/341 scrub testValue from sliced[2] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[2][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }  

                // single 146s
                if (((patternCodes[0] === 1) && (patternCodes[1] === 4) && (patternCodes[2] === 6)) || ((patternCodes[0] === 4) && (patternCodes[1] === 1) && (patternCodes[2] === 6))) {
                    console.log("146/416 scrub testValue from sliced[6] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[6][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }
                if (((patternCodes[0] === 1) && (patternCodes[1] === 6) && (patternCodes[2] === 4)) || ((patternCodes[0] === 4) && (patternCodes[1] === 6) && (patternCodes[2] === 1))) {
                    console.log("164/461 scrub testValue from sliced[3] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[3][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }                
                if (((patternCodes[0] === 6) && (patternCodes[1] === 1) && (patternCodes[2] === 4)) || ((patternCodes[0] === 6) && (patternCodes[1] === 4) && (patternCodes[2] === 1))) {
                    console.log("614/641 scrub testValue from sliced[0] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[0][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }  
                }                

                // single 147s
                if (((patternCodes[0] === 1) && (patternCodes[1] === 4) && (patternCodes[2] === 7)) || ((patternCodes[0] === 4) && (patternCodes[1] === 1) && (patternCodes[2] === 7))) {
                    console.log("147/417 scrub testValue from sliced[6] & [8] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[6][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[8][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                       
                }
                if (((patternCodes[0] === 1) && (patternCodes[1] === 7) && (patternCodes[2] === 4)) || ((patternCodes[0] === 4) && (patternCodes[1] === 7) && (patternCodes[2] === 1))) {
                    console.log("174/471 scrub testValue from sliced[3] & [5] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[3][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[5][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                       
                }
                if (((patternCodes[0] === 7) && (patternCodes[1] === 1) && (patternCodes[2] === 4)) || ((patternCodes[0] === 7) && (patternCodes[1] === 4) && (patternCodes[2] === 1))) {                                                
                    console.log("714/741 scrub testValue from sliced[0] & [2] " + testValue);
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[0][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    for (var scrubee = 0; scrubee < 3; scrubee ++) {
                        if (scrubValue(GRID[sliced[2][scrubee].position], testValue)) {
                            progress = true;
                        }
                    }
                    if (progress) {
                        MESSAGE += "Refined possible squares for value " + testValue + " in supercell " + dirText + " " + scUnit + " based on it's pattern of occurrence.";
                        return progress;
                    }                       
                }
            }
        }
    }
};



// WebUI functions ------------------------------------------------------------

// read input values entered on input grid

readInput = function() {
    INPUTS = [];
    for (var i = 0; i < 81; i ++) {
        var cellID = "i" + String(i);
        var cellInput = parseInt(document.getElementById(cellID).value);
        if ((cellInput > 0) && (cellInput < 10)) {
            INPUTS.push(cellInput);
        }
        else {
            INPUTS.push(0);
        }
    }
    for (var i = 0; i < 81; i ++) {
        if (INPUTS[i] !== 0) {
            placeDefiniteValue(GRID[i], INPUTS[i]);
        }
    }
    updateOutputGrid();
};

// populate output grid with the values of "done" cells

updateOutputGrid = function() {
    for (var i = 0; i < 81; i ++) {
        var cellID = "o" + String(i);
        if (GRID[i].done) {
            document.getElementById(cellID).innerHTML = GRID[i].values[0];
        }
    }
};

// run the solving functions until the next successful placement of a value
// return false if stuck

giveClue = function() {
    INPUTS = [];
    for (var i = 0; i < 81; i ++) {
        var cellID = "i" + String(i);
        var cellInput = parseInt(document.getElementById(cellID).value);
        if ((cellInput > 0) && (cellInput < 10)) {
            INPUTS.push(cellInput);
        }
        else {
            INPUTS.push(0);
        }
    }
    for (var i = 0; i < 81; i ++) {
        if (INPUTS[i] !== 0) {
            placeDefiniteValue(GRID[i], INPUTS[i]);
        }
    }
    updateOutputGrid();


    var stuck = false;
    var progress = false;

    console.log('in giveClue', stuck, progress)

    // level 1 solver
    progress = onlyOneValueLeft();
    if (progress) {
        console.log(MESSAGE);
        updateOutputGrid();
        STEPS.push(1);
    }
    else {
        // level 2 solver
        progress = lastInstanceOfValueIn();
        if (progress) {
            console.log(MESSAGE);
            updateOutputGrid();
            STEPS.push(2);
        }
        else {
            // level 3 solver
            progress = iWrapper();
            if (progress) {
                console.log(MESSAGE);
                STEPS.push(3);
            }
            else {
                // level 4 solver
                progress = supercellExtensions();
                if (progress) {
                    console.log(MESSAGE);
                    STEPS.push(4);
                }
                else {
                    // level 5 solver
                    progress = patternMatcher();
                    if (progress) {
                        console.log(MESSAGE);
                        STEPS.push(5);
                    }
                }
            }
        }
    }
    console.log(printFinishedCells());

    if (countCellsDone() == 81) {
        console.log('Puzzle solved.')
    }

    return stuck;
};

// run the solving functions until the puzzle is complete

solveIt = function() {
    INPUTS = [];
    for (var i = 0; i < 81; i ++) {
        var cellID = "i" + String(i);
        var cellInput = parseInt(document.getElementById(cellID).value);
        if ((cellInput > 0) && (cellInput < 10)) {
            INPUTS.push(cellInput);
        }
        else {
            INPUTS.push(0);
        }
    }
    for (var i = 0; i < 81; i ++) {
        if (INPUTS[i] !== 0) {
            placeDefiniteValue(GRID[i], INPUTS[i]);
        }
    }
    updateOutputGrid();
    
    while (countCellsDone() < 81) {
        var stuck = giveClue();
    }
    console.log(printFinishedCells());
    console.log(STEPS);
    console.log('Puzzle solved')
};

// startup stuff needed prior to user interactions ----------------------------

initGrid();
