/**
 * CLI argument parsing for pattern-runner.
 */

'use strict';

const USAGE = `
Usage: pattern-runner [mode] [options]

Modes:
  Product Research (default):
    --keyword, -k <keyword>   Starting keyword for product research
    --location, -l <location> Geographic market (default: US)

  Knowledge Q&A:
    --question, -q "..."      Ask a question about a knowledge base
    --knowledge-dir <path>    Knowledge base directory (default: .knowledge/techcorp/)

Options:
  --pattern, -p   <name>     Pattern file name or path
  --provider      <name>     Execution backend (default: simulated)
  --format, -f    <fmt>      Output format: table (default), json
  --verbose, -v              Detailed per-product / per-check results
  --memory                   Show run history for a keyword+location
  --clear-memory             Clear all saved run history
  --list-providers           List available execution providers
  --help, -h                 Show this help
  --list-patterns            List available pattern files

Examples:
  # Product research
  pattern-runner --keyword "Wireless Charging Pad" --location "US"
  pattern-runner -k "Yoga Mat" -l "DE" --verbose

  # Knowledge Q&A
  pattern-runner --question "What is the remote work policy?"
  pattern-runner -q "How do I deploy to production?" --verbose

  # Info
  pattern-runner --list-providers
  pattern-runner --list-patterns
  pattern-runner --memory
`;

function parseArgs(argv) {
  const args = {
    keyword: null,
    location: 'US',
    pattern: null,
    provider: 'simulated',
    format: 'table',
    verbose: false,
    help: false,
    listPatterns: false,
    listProviders: false,
    memory: false,
    clearMemory: false,
    question: null,
    knowledgeDir: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    switch (arg) {
      case '--keyword':
      case '-k':
        args.keyword = argv[++i];
        break;
      case '--location':
      case '-l':
        args.location = argv[++i];
        break;
      case '--pattern':
      case '-p':
        args.pattern = argv[++i];
        break;
      case '--provider':
        args.provider = argv[++i];
        break;
      case '--format':
      case '-f':
        args.format = argv[++i];
        break;
      case '--verbose':
      case '-v':
        args.verbose = true;
        break;
      case '--question':
      case '-q':
        args.question = argv[++i];
        args.provider = 'techcorp-knowledge';
        break;
      case '--knowledge-dir':
        args.knowledgeDir = argv[++i];
        break;
      case '--memory':
        args.memory = true;
        break;
      case '--clear-memory':
        args.clearMemory = true;
        break;
      case '--list-providers':
        args.listProviders = true;
        break;
      case '--help':
      case '-h':
        args.help = true;
        break;
      case '--list-patterns':
        args.listPatterns = true;
        break;
      default:
        if (arg.startsWith('--')) {
          console.error(`Unknown option: ${arg}`);
          console.log(USAGE);
          process.exit(1);
        }
    }
  }

  return args;
}

module.exports = { parseArgs, USAGE };
