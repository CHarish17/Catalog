/**
 * Decode a value from given base to decimal
 * @param {string} base - The base of the number system
 * @param {string} value - The value to decode
 * @returns {number} - Decoded decimal value
 */
function decodeValue(base, value) {
    return parseInt(value, parseInt(base));
}

/**
 * Parse JSON data and extract points (x, y) and required values n, k
 * @param {Object} data - Input JSON data
 * @returns {Object} - Object containing points array and n, k values
 */
function readPointsFromJson(data) {
    const n = data.keys.n;
    const k = data.keys.k;
    
    const points = [];
    for (const key in data) {
        if (key !== 'keys') {
            const x = parseInt(key);
            const y = decodeValue(data[key].base, data[key].value);
            points.push([x, y]);
        }
    }
    
    return { points, n, k };
}

/**
 * Find the constant term (secret) using Lagrange interpolation
 * @param {number[][]} points - Array of [x, y] points
 * @param {number} k - Minimum number of points needed
 * @returns {number} - The secret (constant term)
 */
function findSecretLagrange(points, k) {
    // We only need k points for interpolation
    points = points.slice(0, k);
    
    function lagrangeBasis(j, x, points) {
        let basis = 1;
        const [xj] = points[j];
        
        for (let i = 0; i < points.length; i++) {
            if (i !== j) {
                const [xi] = points[i];
                basis *= (x - xi) / (xj - xi);
            }
        }
        
        return basis;
    }
    
    // To find the constant term, we need to evaluate at x = 0
    const x = 0;
    let result = 0;
    
    for (let j = 0; j < points.length; j++) {
        const [, yj] = points[j];
        result += yj * lagrangeBasis(j, x, points);
    }
    
    return Math.round(result);
}

/**
 * Process a single test case and return the secret
 * @param {Object} data - Input JSON object
 * @returns {number} - The secret
 */
function processTestCase(data) {
    try {
        const { points, n, k } = readPointsFromJson(data);
        
        // Validate input
        if (points.length < k) {
            throw new Error(Insufficient points provided. Need ${k} points but got ${points.length});
        }
        
        return findSecretLagrange(points, k);
    } catch (error) {
        throw new Error(Error processing test case: ${error.message});
    }
}

module.exports = {
    processTestCase
};
