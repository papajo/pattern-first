/**
 * CLI argument parsing for pattern-runner.
 */

'use strict';

const USAGE = `
Usage: pattern-runner --keyword <keyword> [options]

Required:
  --keyword, -k   Starting keyword for product research

Options:
  --location, -l  Geographic market (default: US)
  --pattern, -p   Pattern name or path (default: pattern-schema-test-results.json)
  --format, -f    Output format: table (default), json
  --verbose, -v   Detailed per-product check results
  --help, -h      Show this help
  --list-patterns List available pattern files

Examples:
  pattern-runner --keyword "Wireless Charging Pad" --location "US"
  pattern-runner -k "Yoga Mat" -l "DE" --verbose
  pattern-runner -k "Coffee Maker" --format json
`;

function parseArgs(argv) {
  const args = {
    keyword: null,
    location: 'US',
    pattern: null,
    format: 'table',
    verbose: false,
    help: false,
    listPatterns: false,
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
      case '--format':
      case '-f':
        args.format = argv[++i];
        break;
      case '--verbose':
      case '-v':
        args.verbose = true;
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
