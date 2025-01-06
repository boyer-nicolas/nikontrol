#include <Arduino.h>

int s0 = 2;
int s1 = 3;
int s2 = 4;
int s3 = 5;

int s4 = 8;
int s5 = 9;
int s6 = 10;
int s7 = 11;

int faderCount = 8;
int panPotCount = 8;

int faderControlPins[] = {s0, s1, s2, s3};
int panPotControlPins[] = {s4, s5, s6, s7};

void setup()
{
    pinMode(s0, OUTPUT);
    pinMode(s1, OUTPUT);
    pinMode(s2, OUTPUT);
    pinMode(s3, OUTPUT);
    pinMode(s4, OUTPUT);
    pinMode(s5, OUTPUT);
    pinMode(s6, OUTPUT);
    pinMode(s7, OUTPUT);

    digitalWrite(s0, LOW);
    digitalWrite(s1, LOW);
    digitalWrite(s2, LOW);
    digitalWrite(s3, LOW);
    digitalWrite(s4, LOW);
    digitalWrite(s5, LOW);
    digitalWrite(s6, LOW);
    digitalWrite(s7, LOW);

    Serial.begin(9600);
}

int readMux(int controlPins[], int channel, byte analogChannel)
{
    // loop through the 4 sig
    for (int i = 0; i < 4; i++)
    {
        digitalWrite(controlPins[i], bitRead(channel, i));
    }

    // read the value at the SIG pin
    int val = analogRead(analogChannel);

    // return the value
    return val;
}

void writeMux(int controlPins[], int channel, int value, byte analogChannel)
{
    // loop through the 4 control pins
    for (int i = 0; i < 4; i++)
    {
        digitalWrite(controlPins[i], bitRead(channel, i));
    }

    // write the value to the SIG pin
    digitalWrite(analogChannel, value);
}

void loop()
{
    // Read faders
    for (int i = 0; i < faderCount; i++)
    {
        int val = readMux(faderControlPins, i, A0);
        if (val > 0)
        {
            Serial.print("Fader ");
            Serial.print(i);
            Serial.print("value is : ");
            Serial.println(val);
        }

        delay(100);
    }

    // Read pan pots
    for (int i = 0; i < panPotCount; i++)
    {
        int val = readMux(panPotControlPins, i, A1);
        if (val > 0)
        {
            Serial.print("Pan Pot ");
            Serial.print(i);
            Serial.print("value is : ");
            Serial.println(val);
        }

        delay(100);
    }
}
