// cipher functions ===========================================================

// returns a polybius square substitution cipher encryption/decryption
var polybiusCipher = function (selector, message, keyword) {
    var pA = ["a","b","c","d","e","f","g","h","i","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

    // clean keyword, swap j for i, remove repeated letters
    var cleanKey = [];
    var char = "";
    for (var i = 0; i < keyword.length; i ++) {
        char = keyword[i].toLowerCase();
        if (char === "j") {
            char = "i";
        }
        if ((char >= "a") && (char <= "z")) {
            if (cleanKey.indexOf(char) === -1) {
                cleanKey.push(char);
            }
        }
    }
    console.log(cleanKey);
    
    // construct ciphertext alphabet
    var cA = [];
    for (var i = 0; i < cleanKey.length; i ++) {
        cA[i] = cleanKey[i].toUpperCase();
    }
    for (var i = 0; i < pA.length; i ++) {
        char = pA[i].toUpperCase();
        if (cA.indexOf(char) === -1) {
            cA.push(char);
        }
    }
    console.log(cA);

    // construct square for display
    //var psq = "";
    //for (var c = 0; c < 5; c ++) {
    //    for (var r = 0; r < 5; r ++) {
    //        psq += cA[(c * 5) + r] + " ";
    //    }
    //    psq += "\n";
    //}
    //console.log(psq);
    
    var output = "";

    // encrypt - clean message, swap j for i, get digraphs for message chars
    if (selector === "encrypt") {
        var cleanMessage = [];
        var char = "";
        for (var i = 0; i < message.length; i ++) {
            char = message[i].toLowerCase();
            if (char === "j") {
                char = "i";
            }
            if ((char >= "a") && (char <= "z")) {
                cleanMessage.push(char);
            }
        }
        console.log(cleanMessage);

        var oA = [];
        for (var i = 0; i < cleanMessage.length; i ++) {
            var p = cA.indexOf(cleanMessage[i].toUpperCase());
            var pD = Math.floor(p / 5) + 1;
            var pM = (p % 5) + 1;
            var pS = pM.toString() + pD.toString();
            oA.push(pS);
        }
    }
    
    // decrypt - clean ciphertext, get plaintext for digraph
    if (selector === "decrypt") {   
        var cleanMessage = [];
        for (var i = 0; i < message.length; i ++) {
            if ((message[i] >= "1") && (message[i] <= "5")) {
                cleanMessage.push(message[i]);
            }
        }
        if ((cleanMessage.length % 2) === 1) {
            cleanMessage.push("1");
        }
        console.log(cleanMessage.length);
        
        var di = "";
        var ptis = [];
        for (var i = 0; i < cleanMessage.length; i += 2) {
            di = cleanMessage[i].toString() + cleanMessage[i + 1].toString();
            var col = parseInt(di[0]);
            var row = parseInt(di[1]);
            var p = ((row - 1) * 5) + col - 1;
            ptis.push(p);
        }
        
        var oA = [];
        for (var i = 0; i < ptis.length; i ++) {
            oA.push(cA[ptis[i]].toLowerCase());
        }
    }

    for (var i = 0; i < oA.length; i ++) {
        output = output + oA[i];
    }
    console.log(output);

    var returns = [];
    returns.push(output);
    returns.push(cA.slice(0,1) + " " + cA.slice(1,2) + " " + cA.slice(2,3) + " " + cA.slice(3,4) + " " + cA.slice(4,5));
    returns.push(cA.slice(5,6) + " " + cA.slice(6,7) + " " + cA.slice(7,8) + " " + cA.slice(8,9) + " " + cA.slice(9,10));
    returns.push(cA.slice(10,11) + " " + cA.slice(11,12) + " " + cA.slice(12,13) + " " + cA.slice(13,14) + " " + cA.slice(14,15));
    returns.push(cA.slice(15,16) + " " + cA.slice(16,17) + " " + cA.slice(17,18) + " " + cA.slice(18,19) + " " + cA.slice(19,20));
    returns.push(cA.slice(20,21) + " " + cA.slice(21,22) + " " + cA.slice(22,23) + " " + cA.slice(23,24) + " " + cA.slice(24,25));

    return returns;
};



// webui functions ============================================================

encrypt = function() {
    var plaintext = document.getElementById("txboxin").value;
    var keyword = document.getElementById("ek").value;
    var returns = polybiusCipher("encrypt", plaintext, keyword);
    document.getElementById("epsqr1").innerHTML = returns[1];
    document.getElementById("epsqr2").innerHTML = returns[2];
    document.getElementById("epsqr3").innerHTML = returns[3];
    document.getElementById("epsqr4").innerHTML = returns[4];
    document.getElementById("epsqr5").innerHTML = returns[5];
    document.getElementById("txboxout").value = returns[0];
};

decrypt = function() {
    var dciphertext = document.getElementById("rxboxin").value;
    var keyword = document.getElementById("dk").value;
    var returns = polybiusCipher("decrypt", dciphertext, keyword);
    document.getElementById("dpsqr1").innerHTML = returns[1];
    document.getElementById("dpsqr2").innerHTML = returns[2];
    document.getElementById("dpsqr3").innerHTML = returns[3];
    document.getElementById("dpsqr4").innerHTML = returns[4];
    document.getElementById("dpsqr5").innerHTML = returns[5];
    document.getElementById("rxboxout").value = returns[0];
};
