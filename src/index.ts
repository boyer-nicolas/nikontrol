import { CLI } from '@/lib/CommandLineInterface';

async function main() {
    await new CLI().registerCommands()
}

main()
