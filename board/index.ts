import { Board, Led, Sensor } from 'johnny-five';

const board = new Board();

// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", () => {
    console.log("Ready!");

    const slider = new Sensor("A0");
    const led = new Led(11);
    led.blink(500);

    slider.on("data", () => {
        led.brightness(slider.scaleTo([0, 255]));
    });
});
