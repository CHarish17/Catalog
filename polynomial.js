const fs = require('fs').promises;
const path = require('path');
const { processTestCase } = require('./shamirSecret');

/**
 * Read and parse a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<Object>} - Parsed JSON data
 */
async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(Error reading file ${filePath}: ${error.message});
    }
}

/**
 * Process all test cases in a directory
 * @param {string} testDir - Directory containing test case files
 */
async function processAllTestCases(testDir) {
    try {
        // Read all files in the test directory
        const files = await fs.readdir(testDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        // Process each test case
        const results = await Promise.all(
            jsonFiles.map(async (file) => {
                const filePath = path.join(testDir, file);
                const data = await readJsonFile(filePath);
                const secret = processTestCase(data);
                return { file, secret };
            })
        );

        // Print results
        console.log('\nResults:');
        console.log('--------');
        results.forEach(({ file, secret }) => {
            console.log(${file}: Secret = ${secret});
        });

    } catch (error) {
        console.error('Error processing test cases:', error.message);
        process.exit(1);
    }
}

// Get test directory from command line argument or use default
const testDir = process.argv[2] || './test-cases';

// Run the processor
processAllTestCases(testDir)
    .then(() => console.log('\nProcessing completed successfully.'))
    .catch(error => {
        console.error('Fatal error:', error.message);
        process.exit(1);
    });
