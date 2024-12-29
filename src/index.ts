
import { CLI } from '@/lib/CLI';

async function main() {
    await new CLI().registerCommands()
}

main()
