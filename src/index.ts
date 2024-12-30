import { CLI } from '@/engine/CommandLineInterface';

async function main() {
    await new CLI().registerCommands()
}

main()
