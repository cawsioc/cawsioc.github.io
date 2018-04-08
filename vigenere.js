// globals ====================================================================
var ptLookup = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

// "shifter" function
// return a caesar shifted upper-case alphabet
var shifter = function (shift) {
    var ctLookup = [];
    // create ciphertext lookup array   
    var ctConstructor = ptLookup.slice(shift, ptLookup.length);
    for (var i = 0; i < shift; i++) {
        ctConstructor.push(ptLookup[i]);
    }
    // set ciphertext lookup array to upper case
    for (var u = 0; u < ctConstructor.length; u ++) {
        ctLookup.push(ctConstructor[u].toUpperCase());
    }
    return ctLookup;
};

// "indexKeyword" function
// remove repeated and invalid characters from a keyword
// return list of the index of each character in the keyword
var indexKeyword = function (keyword) {
    var lowerKeyword = [];
    for (var lki = 0; lki < keyword.length; lki ++) {
        lowerKeyword.push(keyword[lki].toLowerCase());
    } 
    var uniqueKeyword = [];
    for (var uki = 0; uki < lowerKeyword.length; uki ++) {
        if ((lowerKeyword[uki] >= "a") && (lowerKeyword[uki] <= "z")) {
            if (uniqueKeyword.indexOf(lowerKeyword[uki]) === -1) {
                uniqueKeyword.push(lowerKeyword[uki]);
            }
        }
    }
    var keywordIndices = [];
    for (var uki = 0; uki < uniqueKeyword.length; uki ++) {
        keywordIndices.push(ptLookup.indexOf(uniqueKeyword[uki]));
    }
    return keywordIndices;
};

// "vigenere" function
// return the keyword encrypted or decrypted string of a message using vigenere method
// orders ciphertext alphabets as found in the keyword, not alphabetically
var vigenere = function (operation, keyword, message) {
    // put/sanitize message into right format
    var inputText = [];
    if (operation === "encrypt") {
        for (var mi = 0; mi < message.length; mi ++) {
            if (((message[mi] >= "a") && (message[mi] <= "z")) || ((message[mi] >= "A") && (message[mi] <= "Z"))) {
                inputText.push(message[mi].toLowerCase());
            }
        }
    }
    if (operation === "decrypt") {
        for (var ci = 0; ci < message.length; ci ++) {
            if ((message[ci] >= "A") && (message[ci] <= "Z")) {
                inputText.push(message[ci]);
            }
        }        
    }
    
    console.log("InputText:" + " " + inputText);
    
    // get keyword length - also serves as modulus for picking which alphabet to use
    var keywordIndices = indexKeyword(keyword);
    var keyLen = keywordIndices.length;
    console.log("Keyword / Length:" + " " + keywordIndices + " / " + keyLen);
    
    // encryption
    var outputText = [];
    if (operation === "encrypt") {
        for (iTi = 0; iTi < inputText.length; iTi ++) {
            var cta = shifter(keywordIndices[iTi % keyLen]);
            var cti = ptLookup.indexOf(inputText[iTi]);
            var ctc = cta[cti];
            outputText.push(ctc);
        }
    }
    
    // decryption
    if (operation === "decrypt") {
        for (iTi = 0; iTi < inputText.length; iTi ++) {
            var cta = shifter(keywordIndices[iTi % keyLen]);
            var pti = cta.indexOf(inputText[iTi]);
            var ptc = ptLookup[pti];
            outputText.push(ptc);
        }
    }
    
    // format output
    var outputString = "";
    for (var o = 0; o < outputText.length; o ++) {
        outputString = outputString + outputText[o];
    }
    console.log("OutputText:" + " " + outputText);
    return outputString;
};



// webui functions ============================================================

// "encrypt" returns the ciphertext of a vigenere encrypted plaintext
encrypt = function() {
	var plaintext = document.getElementById("txboxin").value;
	var keyword = document.getElementById("ek").value;
	var ciphertext = vigenere("encrypt", keyword, plaintext);
	document.getElementById("txboxout").value = ciphertext;
};

// "decrypt" returns the plaintext of a vigenere encrypted ciphertext
decrypt = function() {
    var dciphertext = document.getElementById("rxboxin").value;
	var keyword = document.getElementById("dk").value;
    var dplaintext = vigenere("decrypt", keyword, dciphertext);
    document.getElementById("rxboxout").value = dplaintext;
};