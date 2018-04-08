// "freq" function
// returns list of items found in input ordered as highest to lowest frequency
// assumes input is already santized e.g. all same case
// takes element size of 1 to 3, 0 = analyze only identical pairs
var freq = function (input) {
    
    // switch everything to upper case
    var upperInput = [];
    for (var i = 0; i < input.length; i ++) {
        if ((input[i] >= "a") && (input[i] <= "z")) {
            upperInput.push(input[i].toUpperCase());
        }
        else if ((input[i] >= "A") && (input[i] <= "Z")) {
            upperInput.push(input[i]);
        }
    }

    // chunk input into unit sized elements
    var data1 = [];
    var data2 = [];
    var data3 = [];
    
    data1 = upperInput;
    for (var i = 0; i < upperInput.length - 1; i ++) {
        data2[i] = upperInput[i] + upperInput[i+1];
    }
    for (var i = 0; i < upperInput.length - 2; i ++) {
        data3[i] = upperInput[i] + upperInput[i+1] + upperInput[i+2];
    }
    console.log(data1);
    console.log(data2);
    console.log(data3);
    
    // build list of unique values and associated count list
    var uniItems = [];
    var uniItemCount = [];
    var biItems = [];
    var biItemCount = [];
    var triItems = [];
    var triItemCount = [];
    var itemCount = 0;

    for (i = 0; i < data1.length; i ++) {
        if (uniItems.indexOf(data1[i]) === -1) {
            uniItems.push(data1[i]);
            uniItemCount.push(1);
        }
        else {
            uniItemCount[uniItems.indexOf(data1[i])] ++;
        }
    }
    
    // sort unigram list high to low (swap sorter)
    var sorted = false;
    while (sorted === false) {
        for (var i = 0; i < uniItemCount.length - 1; i ++) {
            if (uniItemCount[i] < uniItemCount[i+1]) {
                sorted = false;
                var tmpCount = uniItemCount[i];
                var tmpItem = uniItems[i];
                uniItemCount[i] = uniItemCount[i+1];
                uniItems[i] = uniItems[i+1];
                uniItemCount[i+1] = tmpCount;
                uniItems[i+1] = tmpItem;
            }
            else if (i === 0) {
                sorted = true;
            }
        }
    }
    console.log(uniItems);

    // convert unigram counts into %ages
    var uniItemTotal = 0;
    for (var i = 0; i < uniItemCount.length; i ++) {
        uniItemTotal = uniItemTotal + uniItemCount[i];
    }
    
    for (var i = 0; i < uniItemCount.length; i ++) {
        uniItemCount[i] = (uniItemCount[i] / uniItemTotal) * 100;
        if (uniItemCount[i] > 1) {
            uniItemCount[i] = uniItemCount[i].toPrecision(3);
        }
        else {
            uniItemCount[i] = uniItemCount[i].toFixed(2);
        }
    }
    console.log(uniItemCount);

    // construct unigram output string
    var uniString = "";
    for (i = 0; i < uniItems.length; i ++) {
        uniString = uniString + uniItems[i] + " (" + uniItemCount[i] + "%) ";
    }

    // bigrams
    for (i = 0; i < data2.length; i ++) {
        if (biItems.indexOf(data2[i]) === -1) {
            biItems.push(data2[i]);
            biItemCount.push(1);
        }
        else {
            biItemCount[biItems.indexOf(data2[i])] ++;
        }
    }
    
    // sort bigram list high to low (swap sorter)
    var sorted = false;
    while (sorted === false) {
        for (var i = 0; i < biItemCount.length - 1; i ++) {
            if (biItemCount[i] < biItemCount[i+1]) {
                sorted = false;
                var tmpCount = biItemCount[i];
                var tmpItem = biItems[i];
                biItemCount[i] = biItemCount[i+1];
                biItems[i] = biItems[i+1];
                biItemCount[i+1] = tmpCount;
                biItems[i+1] = tmpItem;
            }
            else if (i === 0) {
                sorted = true;
            }
        }
    }
    console.log(biItems);

    // extract identical pairs
    var pairs = [];
    for (var i = 0; i < biItems.length; i ++) {
        var pair = biItems[i];
        if (pair[0] === pair[1]) {
            pairs.push(pair);
        }
    }
    console.log(pairs);

    // construct bigram output string
    var biString = "";
    for (var i = 0; i < biItems.length; i ++) {
        biString = biString + biItems[i] + " ";
    }

    // construct bigram identical pairs output string
    var biPairString = "";
        for (var i = 0; i < pairs.length; i ++) {
        biPairString = biPairString + pairs[i] + " ";
    }

    // trigrams
    for (i = 0; i < data3.length; i ++) {
        if (triItems.indexOf(data3[i]) === -1) {
            triItems.push(data3[i]);
            triItemCount.push(1);
        }
        else {
            triItemCount[triItems.indexOf(data3[i])] ++;
        }
    }
    
    // sort trigram list high to low (swap sorter)
    var sorted = false;
    while (sorted === false) {
        for (var i = 0; i < triItemCount.length - 1; i ++) {
            if (triItemCount[i] < triItemCount[i+1]) {
                sorted = false;
                var tmpCount = triItemCount[i];
                var tmpItem = triItems[i];
                triItemCount[i] = triItemCount[i+1];
                triItems[i] = triItems[i+1];
                triItemCount[i+1] = tmpCount;
                triItems[i+1] = tmpItem;
            }
            else if (i === 0) {
                sorted = true;
            }
        }
    }
    console.log(triItems);

    // construct trigram output string
    var triString = "";
    for (var i = 0; i < triItems.length; i ++) {
        triString = triString + triItems[i] + " ";
    }

    var output = [];
    output[1] = uniString;
    output[2] = biString;
    output[0] = biPairString;
    output[3] = triString;
    return output;
};



// webui functions ============================================================

// transposes the plaintext in ept element on a scytale with sides in element
// es and outputs ciphertext in ect element
analyze = function() {
    var textIn = document.getElementById("txboxin").value;
    var freqData = freq(textIn);
    document.getElementById("gramP").value = freqData[0];
    document.getElementById("gram1").value = freqData[1];
    document.getElementById("gram2").value = freqData[2];
    document.getElementById("gram3").value = freqData[3];
};