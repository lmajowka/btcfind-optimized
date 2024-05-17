const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const min = 0x2a90675934c000000;
const max = 0x3ffffffffffffffff;
const numThreads = 4; // Number of parallel threads
const wallets = ['13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so'];

const startTime = Date.now()

// Function to create worker threads
function createWorker(start, end) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
            workerData: { start, end, wallets }
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

// Main function to distribute the range among workers
async function main() {
    const range = Math.floor((max - min) / numThreads);
    const promises = [];
    for (let i = 0; i < numThreads; i++) {
        const start = min + i * range;
        const end = (i === numThreads - 1) ? max : start + range - 1;
        promises.push(createWorker(start, end));
    }

    try {
        await Promise.all(promises);
        console.log('All workers completed successfully');
        console.log('Tempo: ', (Date.now() - startTime)/1000)
    } catch (error) {
        console.error(error);
    }
}

if (isMainThread) {
    main();
} else {
    require('./worker');
}
