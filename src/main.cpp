#include <Arduino.h>

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
    pinMode(11, OUTPUT);
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
    digitalWrite(11, HIGH);
    delay(1000);
    digitalWrite(11, LOW);
    delay(1000);
}
