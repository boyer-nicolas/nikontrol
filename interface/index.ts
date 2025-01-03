import { CLI } from 'interface/engine/CommandLineInterface';

async function main() {
    await new CLI().registerCommands()
}

main()
