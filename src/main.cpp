#include <Arduino.h>

const int faderCount = 8;
const int panPotCount = 8;

const uint8_t faderControlPins[] = {0, 1, 2, 3};
const uint8_t panPotControlPins[] = {4, 5, 6, 7};

#define SAMPLE_COUNT 10
#define THRESHOLD 2

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
    pinMode(A0, INPUT);
    pinMode(A1, INPUT);

    pinMode(11, OUTPUT);
    Serial.begin(9600);
}

/**
 * @brief Reads the value of a fader connected to a CD4051 multiplexer.
 *
 * @param channel The channel number to read (0-indexed).
 * @return The value of the fader (0-1023).
 *
 * Connects control pins of the CD4051 multiplexer to select the specified
 * channel, waits for a short time to allow the multiplexer to settle, and then
 * reads the value of the fader connected to the selected channel.
 */
float readFaderMux(int channel)
{
    for (int i = 0; i < 4; i++)
    {
        digitalWrite(faderControlPins[i], channel >> i & 1);
    }
    delay(10);
    return analogRead(A0);
}

/**
 * @brief Reads the value of a pan pot connected to a CD4051 multiplexer.
 *
 * @param channel The channel number to read (0-indexed).
 * @return The value of the pan pot (0-1023).
 *
 * Connects control pins of the CD4051 multiplexer to select the specified
 * channel, waits for a short time to allow the multiplexer to settle, and then
 * reads the value of the pan pot connected to the selected channel.
 */
float readPanPotMux(int channel)
{
    for (int i = 0; i < 4; i++)
    {
        digitalWrite(panPotControlPins[i], channel >> i & 1);
    }
    delay(10);
    return analogRead(A0);
}

/**
 * @brief Checks if a fader is connected by reading its value multiple times
 *        and calculating the range of the values. If the range is above a certain
 *        threshold, the fader is considered connected.
 *
 * Reads the value of the fader connected to the specified channel multiple times
 * and calculates the range of the values. If the range is above THRESHOLD, the
 * fader is considered connected.
 *
 * @param channel The channel number of the fader to check (0-indexed).
 * @return true if the fader is connected, false otherwise.
 */
bool isFaderConnected(int channel)
{
    int minValue = 1023;
    int maxValue = 0;

    Serial.print("Channel ");
    Serial.print(channel);
    Serial.print(" readings: ");

    for (int i = 0; i < SAMPLE_COUNT; i++)
    {
        int value = readFaderMux(channel);
        Serial.print(value);
        Serial.print(" ");
        minValue = min(minValue, value);
        maxValue = max(maxValue, value);
        delay(5); // Short delay between readings
    }

    int range = maxValue - minValue;

    Serial.print("| Range: ");
    Serial.print(range);
    Serial.print(" | Decision: ");
    Serial.println(range > THRESHOLD ? "Connected" : "Disconnected");

    return range > THRESHOLD;
}

/**
 * @brief Checks if a pan pot is connected by reading its value multiple times
 *        and calculating the range of the values. If the range is above a certain
 *        threshold, the pan pot is considered connected.
 *
 * @param channel The channel number of the pan pot to check.
 *
 * @return True if the pan pot is connected, false otherwise.
 */
bool isPanPotConnected(int channel)
{
    int minValue = 1023;
    int maxValue = 0;

    Serial.print("Channel ");
    Serial.print(channel);
    Serial.print(" readings: ");

    for (int i = 0; i < SAMPLE_COUNT; i++)
    {
        int value = readPanPotMux(channel);
        Serial.print(value);
        Serial.print(" ");
        minValue = min(minValue, value);
        maxValue = max(maxValue, value);
        delay(5); // Short delay between readings
    }

    int range = maxValue - minValue;

    Serial.print("| Range: ");
    Serial.print(range);
    Serial.print(" | Decision: ");
    Serial.println(range > THRESHOLD ? "Connected" : "Disconnected");

    return range > THRESHOLD;
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
    for (int i = 0; i < faderCount; i++)
    {
        float faderValue = readFaderMux(i);
        bool connected = isFaderConnected(i);

        Serial.print("Fader ");
        Serial.print(i + 1);
        Serial.print(": ");
        Serial.print(faderValue);
        Serial.print(" (");
        Serial.print(connected ? "Connected" : "Disconnected");
        Serial.println(")");
        Serial.flush();
    }

    for (int i = 0; i < panPotCount; i++)
    {
        float faderValue = readPanPotMux(i);
        bool connected = isPanPotConnected(i);

        Serial.print("Pan Pot ");
        Serial.print(i + 1);
        Serial.print(": ");
        Serial.print(faderValue);
        Serial.print(" (");
        Serial.print(connected ? "Connected" : "Disconnected");
        Serial.println(")");
        Serial.flush();
    }

    Serial.println("--------------------");

    // Improve simulation performance
    delay(3000);
}
