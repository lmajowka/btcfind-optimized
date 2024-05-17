const CoinKey = require('coinkey');
const { parentPort, workerData } = require('worker_threads');

const { start, end, wallets } = workerData;

function generatePublic(privateKey) {
    const _key = new CoinKey(Buffer.from(privateKey, 'hex'));
    _key.compressed = true;
    return _key.publicAddress;
}

(async () => {
    const increment = BigInt(1);
    const walletSet = new Set(wallets);

    let key = BigInt(start);
    while (key <= BigInt(end)) {
        //console.log(1)
        //console.log(2)
        //console.log(start, end, key <= BigInt(end))
        
        let pkey = key.toString(16).padStart(64, '0');
        //console.log(4)
        let public = generatePublic(pkey);
        //console.log(walletSet.has(public))
        if (walletSet.has(public)) {
            console.log(pkey)
            parentPort.postMessage(`Found matching address: ${public} with private key: ${pkey}`);
            return;
        }

        key += increment;
    }

    parentPort.postMessage('Completed without finding a match');
})();
