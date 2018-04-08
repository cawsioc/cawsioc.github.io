// returns the encryption or decryption for a scytale transposition cipher
var scytale = function (selector, inputText, sides) {
    
    // 1 - clean up inputText
    var cleanText = [];
    var char = "";
    for (var i = 0; i < inputText.length; i ++) {
        char = inputText[i].toLowerCase();
        if ((char >= "a") && (char <= "z")) {
            cleanText.push(char);
        }
    }
    
    // 2 - calculate dimensions
    var shortLine = Math.floor(cleanText.length/sides);
    var longLine = shortLine + 1;
    var trailingChars = cleanText.length % sides;
    
    // 3 - write input text into array
    var charArray = [];
    var inputTextIndex = 0;
    var lineLen = 0;
    var dim1 = 0;
    var dim2 = 0;
    
    // 3a - encrypt > fill line lengths then sides
    if (selector === "encrypt") {
        for (dim1 = 0; dim1 < sides; dim1 ++) {
            lineLen = 0;
            charArray[dim1] = [];
            if (dim1 < trailingChars) {
                lineLen = longLine;
            }
            else {
                lineLen = shortLine;
            }
            for (dim2 = 0; dim2 < lineLen; dim2 ++) {
                charArray[dim1][dim2] = cleanText[inputTextIndex];
                inputTextIndex ++;
            }
        }
    }
    
    // 3b - decrypt > fill sides then line lengths
    if (selector === "decrypt") {
        if (trailingChars !== 0) {
            lineLen = longLine;
        }
        else {
            lineLen = shortLine;
        }
        for (dim2 = 0; dim2 < lineLen; dim2 ++) {
            charArray[dim2] = [];
            for (dim1 = 0; dim1 < sides; dim1 ++) {
                charArray[dim2][dim1] = cleanText[inputTextIndex];
                inputTextIndex ++;
            }
        }
    }
    console.log("scytale table:");
    console.log(charArray);

    // 4 - create output text
    var output = [];
    inputTextIndex = 0;
    
    // 4a - encrypt
    if (selector === "encrypt") {
        while (inputTextIndex < cleanText.length) {
            if (trailingChars !== 0) {
                lineLen = longLine;
            }
            for (dim2 = 0; dim2 < longLine; dim2 ++) {
                for (dim1 = 0; dim1 < sides; dim1 ++) {
                    if (inputTextIndex < cleanText.length) {
                        output.push(charArray[dim1][dim2].toUpperCase());
                        inputTextIndex ++;
                    }
                }
            }
        }
    }
    
    // 4b - decrypt
    if (selector === "decrypt") {
        while (inputTextIndex < cleanText.length) {
            if (trailingChars !== 0) {
                lineLen = longLine;
            }
            for (dim1 = 0; dim1 < sides; dim1 ++) {
                for (dim2 = 0; dim2 < lineLen; dim2 ++) {
                    if (inputTextIndex < cleanText.length) {
                        char = charArray[dim2][dim1];
                        if ((char >= "a") && (char <= "z")) {
                            output.push(char);
                            inputTextIndex ++;
                        }
                    }
                }
            }
        }
    }

    // 5 - format output
    var outputString = "";
    for (var o = 0; o < output.length; o ++) {
        outputString = outputString + output[o];
    }
    return outputString;
};



// webui functions ============================================================

// transposes the plaintext in ept element on a scytale with sides in element
// es and outputs ciphertext in ect element
encrypt = function() {
    var plaintext = document.getElementById("txboxin").value;
    var sides = parseInt(document.getElementById("es").value);
    var ciphertext = scytale("encrypt", plaintext, sides);
    document.getElementById("txboxout").value = ciphertext;
};



// transposes the ciphertext in dct element on a scytale with sides in element
// ds and outputs plaintext in dpt element
decrypt = function() {
    var dciphertext = document.getElementById("rxboxin").value;
    var sides = parseInt(document.getElementById("ds").value);
    var dplaintext = scytale("decrypt", dciphertext, sides);
    document.getElementById("rxboxout").value = dplaintext;
};