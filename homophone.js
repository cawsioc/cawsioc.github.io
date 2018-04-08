var homophone = function (selector, inputText, t1, t2, t3) {

    // 1 - clean up input
    if (selector === "encrypt") {
        var cleanText = [];
        var char = "";
        for (var i = 0; i < inputText.length; i ++) {
            char = inputText[i].toLowerCase();
            if ((char >= "a") && (char <= "z")) {
                cleanText.push(char);
            }
        }
        console.log("cleaned plaintext");
    }
    if (selector === "decrypt") {
        var cleanText = [];
        var char = "";
        for (var i = 0; i < inputText.length; i += 2) {
            char = inputText[i] + inputText[i + 1];
            if ((char >= "00") && (char <= "99")) {
                cleanText.push(char);
            }
        }
        console.log("chunked ciphertext:");
    }
    console.log(cleanText);

    // 2 - transpose homophone100 to hide letter order
    var homophone100 = "aaaaaaabbcccddddeeeeeeeeeefffgghhhhhhiiiiiijkkllllmmmnnnnnnoooooooppqrrrrrssssssttttttttuuuvvwwwxyyz";
    
    var homoscytaled = scytale("encrypt", homophone100, t1);
    homoscytaled = scytale("encrypt", homoscytaled, t2);
    homoscytaled = scytale("encrypt", homoscytaled, t3);

    var lower100 = homoscytaled.toLowerCase();
    console.log("homophone100 transposed:");
    console.log(lower100);

    // 2 - build plaintext table
    var table = [];
    for (var letter = 0; letter < 26; letter ++) {
        table[letter] = [];
    }

    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 100; i ++) {
        var tmp = alphabet.indexOf(lower100[i]);
        var iS = i.toString();
        if (iS.length !== 2) {
            iS = "0" + iS;
        }
        table[tmp].push(iS);
    }
    console.log("plaintext lookup table:");
    console.log(table);

    // 3 - encryption
    if (selector === "encrypt") {
        var outputText = [];
        for (var inputIndex = 0; inputIndex < cleanText.length; inputIndex ++) {
            var pt = alphabet.indexOf(cleanText[inputIndex]);
            var ct = table[pt].pop();
            outputText.push(ct);
            table[pt].unshift(ct);
        }
    }

    // 4 - decryption
    if (selector === "decrypt") {
        var outputText = [];
        for (var inputIndex = 0; inputIndex < cleanText.length; inputIndex ++) {
            for (var tableIndex = 0; tableIndex < table.length; tableIndex ++) {
                if (table[tableIndex].indexOf(cleanText[inputIndex]) !== -1) {
                    outputText.push(alphabet[tableIndex]);
                }
            }
        }
    }
    console.log("output:")
    console.log(outputText);

    // 5 - format output
    var outputString = "";
    for (var o = 0; o < outputText.length; o ++) {
        outputString = outputString + outputText[o];
    }
    return outputString;
}


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
    var t1 = parseInt(document.getElementById("es1").value);
    var t2 = parseInt(document.getElementById("es2").value);
    var t3 = parseInt(document.getElementById("es3").value);
    var ciphertext = homophone("encrypt", plaintext, t1, t2, t3);
    document.getElementById("txboxout").value = ciphertext;
};



// transposes the ciphertext in dct element on a scytale with sides in element
// ds and outputs plaintext in dpt element
decrypt = function() {
    var dciphertext = document.getElementById("rxboxin").value;
    var t1 = parseInt(document.getElementById("ds1").value);
    var t2 = parseInt(document.getElementById("ds2").value);
    var t3 = parseInt(document.getElementById("ds3").value);
    var dplaintext = homophone("decrypt", dciphertext, t1, t2, t3);
    document.getElementById("rxboxout").value = dplaintext;
};