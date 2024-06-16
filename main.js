const crypto = require('crypto');
const bs58check = require('bs58check');

// Função para gerar uma chave privada aleatória
function generatePrivateKey() {
    return crypto.randomBytes(32);
}

// Função para calcular o SHA-256 seguido do RIPEMD-160
function sha256ripemd160(buffer) {
    const sha256 = crypto.createHash('sha256').update(buffer).digest();
    return crypto.createHash('ripemd160').update(sha256).digest();
}

// Função para derivar a chave pública a partir da chave privada usando secp256k1
function derivePublicKey(privateKey) {
    const { publicKey } = crypto.createECDH('secp256k1');
    publicKey.setPrivateKey(privateKey);
    return publicKey.getPublicKey();
}

// Função para gerar um endereço Bitcoin a partir de uma chave pública
function generateBitcoinAddress(publicKey) {
    const publicKeyHash = sha256ripemd160(publicKey);
    const versionedPayload = Buffer.concat([Buffer.from([0x00]), publicKeyHash]);
    return bs58check.encode(versionedPayload);
}

// Gerar chave privada, chave pública e endereço Bitcoin
const privateKey = generatePrivateKey();
const publicKey = derivePublicKey(privateKey);
const bitcoinAddress = generateBitcoinAddress(publicKey);

// Exibir resultados
console.log('Chave Privada:', privateKey.toString('hex'));
console.log('Chave Pública:', publicKey.toString('hex'));
console.log('Endereço Bitcoin:', bitcoinAddress);
