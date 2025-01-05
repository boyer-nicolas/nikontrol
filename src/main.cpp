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

int readMux(int controlPins[], int channel)
{
    // loop through the 4 sig
    for (int i = 0; i < 4; i++)
    {
        digitalWrite(controlPins[i], bitRead(channel, i));
    }

    // read the value at the SIG pin
    int val = analogRead(A0);

    // return the value
    return val;
}

void loop()
{
    // Read faders
    for (int i = 0; i < faderCount; i++)
    {
        Serial.print("Fader ");
        Serial.print(i);
        Serial.print("value is : ");
        Serial.println(readMux(faderControlPins, i));
        delay(100);
    }

    // Read pan pots
    for (int i = 0; i < panPotCount; i++)
    {
        Serial.print("Pan Pot ");
        Serial.print(i);
        Serial.print("value is : ");
        Serial.println(readMux(panPotControlPins, i));
        delay(100);
    }
}
