import { Bank } from '@/controller/Bank';
import { Transport } from '@/controller/Transport';
import { Config } from '@/lib/config';
import { DawInterface } from '@/lib/DawInterface';
import { server } from '@/lib/server';
import { program } from 'commander';

export class CLI {
    dawInterface: DawInterface | null = null;
    bank: Bank | null = null;
    transport: Transport | null = null;

    constructor() {
        program
            .name(Config.ProgramName)
            .description(Config.ProgramDescription)
            .version('0.0.1');
    }

    registerCommands() {
        program.command('server')
            .description('Start the OSC server')
            .action(() => {
                const { dawInterface, bank, transport } = server();
                this.dawInterface = dawInterface;
                this.bank = bank;
                this.transport = transport;


            });

        program.command('record')
            .description('Start recording on the DAW')
            .action(() => {
                if (!this.transport) {
                    throw new Error('Transport not initialized');
                }

                this.transport.setDawRecording();
            });

        program.command('play')
            .description('Start playing on the DAW')
            .action(() => {
                if (!this.transport) {
                    throw new Error('Transport not initialized');
                }
                this.transport.setDawPlaying();
            });

        program.command('pause')
            .description('Pause playback on the DAW')
            .action(() => {
                if (!this.transport) {
                    throw new Error('Transport not initialized');
                }
                this.transport.setDawPaused();
            });

        program.command('stop')
            .description('Stop playback on the DAW')
            .action(() => {
                if (!this.transport) {
                    throw new Error('Transport not initialized');
                }
                this.transport.setDawStopped();
            });

        program.command('metronome')
            .description('Toggle the metronome on or off')
            .argument('<bool>', 'Toggle the metronome on or off')
            .action((state: boolean) => {
                if (!this.transport) {
                    throw new Error('Transport not initialized');
                }
                this.transport.setDawMetronome(state);
            });

        program.command('repeat')
            .description('Toggle repeat on or off')
            .argument('<bool>', 'Toggle repeat on or off')
            .action((state: boolean) => {
                if (!this.transport) {
                    throw new Error('Transport not initialized');
                }
                this.transport.setDawRepeat(state);
            });


        program.command('bank')
            .description('Select a bank')
            .option('--next', 'Select the next bank')
            .option('--prev', 'Select the previous bank')
            .option('--id <id>', 'Select the bank with the given id')
            .action((options) => {
                if (!this.bank) {
                    throw new Error('Bank not initialized');
                }

                if (!options.next && !options.prev && !options.id) {
                    throw new Error('One of --next, --prev or --id must be specified');
                }

                if (options.next && options.prev) {
                    throw new Error('Only one of --next or --prev can be specified');
                }

                if (options.next && options.id) {
                    throw new Error('Only one of --next or --id can be specified');
                }

                if (options.prev && options.id) {
                    throw new Error('Only one of --prev or --id can be specified');
                }

                if (options.next) {
                    this.bank.next();
                    return;
                }

                if (options.prev) {
                    this.bank.prev();
                    return;
                }

                if (options.id) {
                    this.bank.select(options.id);
                }
            });

        program.parse();
    }
}
