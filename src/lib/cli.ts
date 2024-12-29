import { Bank } from "@/controller/Bank";
import { Transport } from "@/controller/Transport";
import { Config } from "@/lib/config";
import { DawInterface } from "@/lib/DawInterface";
import { Server } from "@/lib/Server";
import { delay } from '@/lib/utils';
import { program } from "commander";

export class CLI {
    dawInterface: DawInterface;
    bank: Bank;
    transport: Transport;
    server: Server;

    constructor() {
        program
            .name(Config.ProgramName)
            .description(Config.ProgramDescription)
            .version("0.0.1");

        this.server = new Server();

        this.dawInterface = this.server.dawInterface;
        this.bank = this.server.bank;
        this.transport = this.server.transport;

        this.server.start()

        process.on('SIGTERM', () => {
            console.log('Bye bye!');
            if (this.dawInterface.started) {
                this.server.stop()
            }
            process.exit(0);
        });

        process.on('SIGINT', () => {
            console.log('Bye bye!');
            if (this.dawInterface.started) {
                this.server.stop()
            }
            process.exit(0);
        });
    }

    /**
     * Ensure the server has started, wait for it if not until timeout (5000ms).
     * 
     * This function is used as a middleware to ensure that the server has successfully connected to the DAW
     * before any command is processed. If the connection fails, an error is thrown.
     * 
     * @returns {Promise<void>} - A promise that resolves when the server is ready.
     */
    private async checkServer(): Promise<void> {
        let timeout = 5000;

        if (!this.dawInterface.connected() && timeout > 0) {
            console.log('Waiting for DAW connection...');
        }

        while (!this.dawInterface.connected() && timeout > 0) {
            process.stdout.write('.');
            timeout -= 100
            await delay(100)
        }

        if (!this.dawInterface.connected()) {
            console.log()
            console.error('❌ DAW connection failed');
            process.exit(1);
        }

        console.log()
        console.log('✅ DAW connection established');
    }

    /**
     * Registers all the commands for the CLI.
     *
     * @returns {void}
     */
    public async registerCommands(): Promise<void> {
        try {
            await this.checkServer();
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }

        program.command("server")
            .description("Start the server")
            .action(() => {
                if (!this.dawInterface.started) {
                    console.error('❌ DAW connection failed');
                }

                console.log('✅ Server started');
            });

        program
            .command("record")
            .description("Start recording on the DAW")
            .action(() => {
                this.transport.setDawRecording();
            });

        program
            .command("play")
            .description("Start playing on the DAW")
            .action(() => {
                this.transport.setDawPlaying();
            });

        program
            .command("pause")
            .description("Pause playback on the DAW")
            .action(() => {
                this.transport.setDawPaused();
            });

        program
            .command("stop")
            .description("Stop playback on the DAW")
            .action(() => {
                this.transport.setDawStopped();
            });

        program
            .command("metronome")
            .description("Toggle the metronome on or off")
            .argument("<bool>", "Toggle the metronome on or off")
            .action((state: boolean) => {
                this.transport.setDawMetronome(state);
            });

        program
            .command("repeat")
            .description("Toggle repeat on or off")
            .argument("<bool>", "Toggle repeat on or off")
            .action((state: boolean) => {
                this.transport.setDawRepeat(state);
            });

        program
            .command("bank")
            .description("Select a bank")
            .option("--next", "Select the next bank")
            .option("--prev", "Select the previous bank")
            .option("--id <id>", "Select the bank with the given id")
            .action((options) => {
                if (!options.next && !options.prev && !options.id) {
                    throw new Error("One of --next, --prev or --id must be specified");
                }

                if (options.next && options.prev) {
                    throw new Error("Only one of --next or --prev can be specified");
                }

                if (options.next && options.id) {
                    throw new Error("Only one of --next or --id can be specified");
                }

                if (options.prev && options.id) {
                    throw new Error("Only one of --prev or --id can be specified");
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
