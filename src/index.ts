import { Bank } from '@/controller/Bank';
import { Transport } from '@/controller/Transport';
import { Config } from '@/lib/config';
import { DawInterface } from '@/lib/DawInterface';

const dawInterface = new DawInterface()

const bank = new Bank({
    tracksCount: Config.TracksCount,
    client: dawInterface.getClient(),
})

const transport = new Transport({
    client: dawInterface.getClient(),
});

dawInterface.start();
dawInterface.onOpen(() => {
    transport.listen();
    bank.listen();
});

process.on('SIGTERM', () => {
    console.log('Bye bye!');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Bye bye!');
    process.exit(0);
});
