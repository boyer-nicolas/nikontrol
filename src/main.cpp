#include <Arduino.h>

const int potentiometerPin = A0; // Potentiometer connected to analog pin A0

/**
 * Initialize the serial communication to send data to the computer.
 *
 * @fn      setup
 * @brief   Initialize the serial communication
 */
void setup()
{
    Serial.begin(9600); // Initialize serial communication
}

/**
 * @fn      loop
 * @brief   Main application loop, it reads the potentiometer value and sends it over serial
 *
 * This function is called in an infinite loop by the Arduino framework.
 * It reads the value of the potentiometer connected to the analog pin A0,
 * and sends it over the serial connection to the computer.
 */
void loop()
{
    int potentiometerValue = analogRead(potentiometerPin); // Read the value
    Serial.println(potentiometerValue);                    // Send the value over serial
    delay(100);                                            // Short delay to avoid flooding the serial port
}
