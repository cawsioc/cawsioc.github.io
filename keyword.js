// cipher functions ===========================================================

// returns a keyword substitution cipher encryption/decryption
var keywordCipher = function (selector, message, keyword) {
    var ptLookup = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var ctLookup = [];

    // 1 - create ciphertext lookup array
    // 1a - remove repeated letters from keyword
    var lowerKeyword = [];
    for (var lki=0; lki < keyword.length; lki++) {
        lowerKeyword.push(keyword[lki].toLowerCase());
    }
    console.log(lowerKeyword);
    var uniqueKeyword = [];
    for (var uki=0; uki < lowerKeyword.length; uki++) {
        if ((lowerKeyword[uki] >= "a") && (lowerKeyword[uki] <= "z")) {
            if (uniqueKeyword.indexOf(lowerKeyword[uki]) === -1) {
                uniqueKeyword.push(lowerKeyword[uki]);
            }
        }
    }
    console.log(uniqueKeyword);
    // 1b - append rest of alphabet
    var ctaConstructor = uniqueKeyword;
    for (var pti = 0; pti < 26; pti ++) {
        if (ctaConstructor.indexOf(ptLookup[pti]) === -1) {
            ctaConstructor.push(ptLookup[pti]);
        }
    }
    console.log(ctaConstructor);
    // 1c - set ciphertext alphabet to upper case
    for (var ctai = 0; ctai < 26; ctai ++) {
        ctLookup.push(ctaConstructor[ctai].toUpperCase());
    }
    console.log(ctLookup);

    // 2 - encrypt/decrypt message
    var output = "";
    for (var char = 0; char < message.length; char ++) {
        var msgChar = message.charAt(char);
        if (selector === "encrypt") {
            msgChar = msgChar.toLowerCase();
            if ((msgChar >= "a") && (msgChar <= "z")) {
                var lookupIndex = ptLookup.indexOf(msgChar);
                var outputChar = ctLookup[lookupIndex];
                output += outputChar;
            }            
        }
        if (selector === "decrypt") {
            msgChar = msgChar.toUpperCase();
            if ((msgChar >= "A") && (msgChar <= "Z")) {
                var lookupIndex = ctLookup.indexOf(msgChar);
                var outputChar = ptLookup[lookupIndex];
                output += outputChar;
            }
        }
    }
    return output;
};

 

// webui functions ============================================================

// encrypts the plaintext in ept element with keyword in element ek and outputs
// alphabets in cta/pta and ciphertext in ect element
encrypt = function() {
    var plaintext = document.getElementById("txboxin").value;
    console.log(plaintext);
    var keyword = document.getElementById("ek").value;
    console.log(keyword);
    document.getElementById("pta").value = "abcdefghijklmnopqrstuvwxyz";
    document.getElementById("cta").value = keywordCipher("encrypt", "abcdefghijklmnopqrstuvwxyz", keyword);
    var ciphertext = keywordCipher("encrypt", plaintext, keyword);
    document.getElementById("txboxout").value = ciphertext;
};



// decrypts the ciphertext in dct element with keyword in element dk and outputs
// alphabets in dcta/dpta and plaintext in dpt element
decrypt = function() {
    var dciphertext = document.getElementById("rxboxin").value;
    var keyword = document.getElementById("dk").value;
    document.getElementById("dcta").value = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    document.getElementById("dpta").value = keywordCipher("decrypt", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", keyword);
    var dplaintext = keywordCipher("decrypt", dciphertext, keyword);
    document.getElementById("rxboxout").value = dplaintext;
};
