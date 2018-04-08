// cipher functions ===========================================================

// returns the ciphertext of a caesar shifted plaintext for given shift (1-25)
var caesarShiftEncrypt = function (plaintext, shift) {
    var ptLookup = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
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
// create ciphertext mesaage
    var ciphertext = "";
    for (var char = 0; char < plaintext.length; char ++) {
        var ptChar = plaintext.charAt(char);
        ptChar = ptChar.toLowerCase();
        if ((ptChar >= "a") && (ptChar <= "z")) {
            var lookupIndex = ptLookup.indexOf(ptChar);
            var ctChar = ctLookup[lookupIndex];
            ciphertext += ctChar;
        }
    }
    return ciphertext;
};

 

// returns the plaintext of a caesar shifted ciphertext where the shift is known
var caesarShiftDecrypt = function (ciphertext, shift) {
    var ctLookup = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    var ptLookup = [];
// create plaintext lookup array
    var ptConstructor = ctLookup.slice(ctLookup.length - shift, ctLookup.length);
    for (var i = 0; i < (ctLookup.length - shift); i ++) {
        ptConstructor.push(ctLookup[i]);
    }
// set plaintext lookup array to lower case
    for (var u = 0; u < ptConstructor.length; u ++) {
        ptLookup.push(ptConstructor[u].toLowerCase());
    }   
// create plaintext message
    var plaintext = "";
    for (var char = 0; char < ciphertext.length; char ++) {
        var ctChar = ciphertext.charAt(char);
        ctChar = ctChar.toUpperCase();
        if ((ctChar >= "A") && (ctChar <= "Z")) {
            var lookupIndex = ctLookup.indexOf(ctChar);
            var ptChar = ptLookup[lookupIndex];
            plaintext += ptChar;
        }
    }
    return plaintext;
};

 

// webui functions ============================================================

// encrypts the plaintext in ept element with shift in element es and outputs
// alphabets in cta/pta and ciphertext in ect element
encrypt = function() {
    var plaintext = document.getElementById("txboxin").value;
    var shift = parseInt(document.getElementById("es").value);
    document.getElementById("pta").value = "abcdefghijklmnopqrstuvwxyz";
    document.getElementById("cta").value = caesarShiftEncrypt("abcdefghijklmnopqrstuvwxyz", shift);
    var ciphertext = caesarShiftEncrypt(plaintext, shift);
    document.getElementById("txboxout").value = ciphertext;
};



// decrypts the ciphertext in dct element with shift in element ds and outputs
// alphabets in dcta/dpta and plaintext in dpt element
decrypt = function() {
    var dciphertext = document.getElementById("rxboxin").value;
    var shift = parseInt(document.getElementById("ds").value);
    document.getElementById("dcta").value = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    document.getElementById("dpta").value = caesarShiftDecrypt("ABCDEFGHIJKLMNOPQRSTUVWXYZ", shift);
    var dplaintext = caesarShiftDecrypt(dciphertext, shift);
    document.getElementById("rxboxout").value = dplaintext;
};
