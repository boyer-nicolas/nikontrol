#include <Arduino.h>

const int faderCount = 8;
const int panPotCount = 8;

const int faderMuxSIG = 34; // Multiplexer output pin
const int panMuxSIG = 1;    // Multiplexer output pin

// Array to store potentiometer values
int panPotValues[8];
int faderValues[8];

#define SAMPLE_COUNT 10
#define THRESHOLD 2

const uint8_t faderControlPins[] = {
    19,
    21,
    22,
    23,
};

/**
 * @brief Initialize the Arduino board.
 *
 * This function is called once when the program starts. It is used to set up the
 * board and initialize the pins.
 *
 * In this case, we set the pin 11 as an output, which is used to control the
 * built-in LED.
 */
void setup()
{
    Serial.begin(115200);
    while (!Serial)
    {
        ; // Wait for serial port to connect
    }
    // Set pinMode for multiplexer signal pin
    pinMode(faderMuxSIG, INPUT);

    // Set pinMode for multiplexer control pins
    for (int i = 0; i < 4; ++i)
    {
        pinMode(faderControlPins[i], OUTPUT);
    }

    delay(1000);

    Serial.println("Setup complete");
}

void selectMuxChannel(int channel)
{
    for (int i = 0; i < 4; i++)
    {
        digitalWrite(faderControlPins[i], bitRead(channel, i));
    }
    delay(10); // Allow time for the multiplexer to switch
}

/**
 * @brief The main loop.
 *
 * This function is called repeatedly after the setup() function has been called.
 *
 * This function blinks the built-in LED on the board connected to pin 11.
 */
void loop()
{
    Serial.println("Loop started");

    for (int i = 0; i < faderCount; i++)
    {
        selectMuxChannel(i);
        int val = analogRead(faderMuxSIG);
        faderValues[i] = val;
        Serial.print("Fader ");
        Serial.print(i);
        Serial.print(" value: ");
        Serial.println(val);
    }

    Serial.println("--------------------");
    delay(1000);
}
