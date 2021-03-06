function Start() {
    document.getElementById("qr_add").innerHTML = "";
    document.getElementById("qr_bip38").innerHTML = "";
    document.getElementById("qr_pk").innerHTML = "";
    document.getElementById("qr_bip38FromInput").innerHTML = "";
    generate_BTC();
}


function generate_BTC() {
    var pass = autoPassword.value;
    var mnemonic = new Mnemonic("english");
    var phrase = mnemonic.generate(256);
    var seed = mnemonic.toSeed(phrase);
    var bip32RootKey = bitcoinjs.bitcoin.HDNode.fromSeedHex(seed);
    var account = bip32RootKey.derivePath("m/44'/0'/0'");
    var key = account.derivePath("0/0").keyPair;
    var addresses = buidl.getDetails(key.toWIF());


    document.getElementById("t_seed").innerHTML = "Seed Phrase:<br>" + phrase;

    document.getElementById("t_add").innerHTML = "Address:<br>" + addresses.p2pkh;
    new QRCode(document.getElementById("qr_add")).makeCode(addresses.p2pkh);

    document.getElementById("t_pk").innerHTML = "Private Key:<br>" + addresses.pk;
    new QRCode(document.getElementById("qr_pk")).makeCode(addresses.pk);

    if (pass != "") {
        var bip38 = buidl.bip38Encrypt(addresses.pk, pass);
        document.getElementById("t_bip38pk").innerHTML = "Private Key BIP38 Format:<br>" + bip38.pk;
        new QRCode(document.getElementById("qr_bip38")).makeCode(bip38.pk);
        document.getElementById("t_password").innerHTML = "Your Password:<br>" + pass;
    }
}


function decryptBip38(i_add, i_pass) {
    document.getElementById("t_decryptedBip38").innerHTML = "";
    var valid = 1;
    try {
        var bip38Dec = buidl.bip38Decrypt(i_add, i_pass);
    } catch {
        document.getElementById("t_decryptedBip38").innerHTML = "<span style='color: red;'>Decryption failed. (wrong password?)</span>";
        valid = 0
    }
    if (valid == 1) {
        document.getElementById("t_decryptedBip38").innerHTML = "Decrypted BIP38 private key address:<br>" + bip38Dec.addr;
    }
}

function encryptBip38(i_add, i_pass) {
    document.getElementById("t_bip38FromInput").innerHTML = "";
    document.getElementById("qr_bip38FromInput").innerHTML = "";
    var valid = 1;
    try {
        var bip38 = buidl.bip38Encrypt(i_add, i_pass);
    } catch {
        document.getElementById("t_bip38FromInput").innerHTML = "<span style='color: red;'>Encryption failed.</span>";
        valid = 0
    }
    if (valid == 1) {
        document.getElementById("t_bip38FromInput").innerHTML = "Encrypted bip38 private key address:<br>" + bip38.pk;
        new QRCode(document.getElementById("qr_bip38FromInput")).makeCode(bip38.pk);
    }
}
