const PlagiarismEngine = require('./core/engine');
const NGramStrategy = require('./strategies/ngram');
const CosineStrategy = require('./strategies/cosine');

// Initialize Engine
const engine = new PlagiarismEngine();
engine.addStrategy(new NGramStrategy(3));
engine.addStrategy(new CosineStrategy());

// Example Usage
const testInput = "The quick brown fox jumps over the lazy dog. Plagiarism is the act of taking someone else's work or ideas and passing them off as one's own.";
const comparisonSources = [
    "The quick brown fox jumps over the lazy dog in the forest.",
    "Plagiarism involves taking some other person's work or idea and passing it off as yours.",
    "This is a completely unrelated sentence that should have zero score."
];

async function runDemo() {
    console.log("--- Plagiarism Analysis Demo ---");
    console.log("Input:", testInput);

    const report = await engine.analyze(testInput, comparisonSources);

    console.log("\n--- Final Report ---");
    console.log(JSON.stringify(report, null, 2));
}

runDemo();
