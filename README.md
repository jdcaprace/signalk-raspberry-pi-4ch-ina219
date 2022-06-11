
# signalk-raspberry-pi-4ch-ina219
This is a 4 channels ina219 current shunt and power monitor sensor information for SignalK (SK).

Reports 4 channels with Current [-3.2 A to 3.2 A], Voltage [0-26 VDC], and Power.

This plugin can be downloaded via the SignalK application.

## Getting Started
You will need a raspberry pi with SignalK installed along with a current/power monitor HAT based on ina219 sensor.

### The current/power monitor HAT
Personally I am using the Waveshare current/power monitor HAT found at the following link on Amazon.

The model used: https://www.amazon.com/Waveshare-Current-Power-Monitor-HAT/dp/B083TQ58N2/

This is the Waveshare 4-channels current and power monitor HAT designed for Raspberry Pi. Via the I2C interface, it is easy to monitor each channel's current, voltage, and power consumption, as well as the voltage between both sides of the sampling resistor.

![ina219](../main/Pictures/waveshare_ina219.png)

Learn more on the wiki of the module: https://www.waveshare.com/wiki/Current/Power_Monitor_HAT

The datasheet of the ina219 can be found here: https://www.ti.com/lit/ds/symlink/ina219.pdf

### Connecting the Sensor
All you need to start is connecting the 4 pins (3.3V Power - VCC), (I2C - SDA), (I2C - SCL) and (Ground - GND) to your Raspberry Pi. The simpler way to perform this task is to plug the HAT on top of your Raspberry Pi.

The GPIO of the raspberry Pi is detailed here: https://docs.microsoft.com/pt-br/windows/iot-core/learn-about-hardware/pinmappings/pinmappingsrpi

You need to make sure Raspberry Pi is turned off while doing this!

In order to use the sensor, the i2c bus must be enabled on your rasbperry pi. This can be accomplished using "sudo raspi-config".

This module can be used to test currents and voltages of four channels, they are (IN1+ IN1-), (IN2+ IN2-), (IN3+ IN3-) and (IN4+ IN4-).

INx+ is the current input, and INx- is the current output. Module measure the differential voltage of the sample resistor connected between INx+ and INx-, with the voltage we can measure the working current.

The module supports measuring bidirectional current, so users can invert the input and output.

WARNING: the current range is [-3.2 A to 3.2 A] and voltage range [0-26 VDC].

Note that you must connect GND when testing different power adpter, otherwise, the VBus voltage cannot be measured.

## Troubleshooting
When you first start SK, you should see one of two things in the /var/log/syslog; ina219 initialization succeeded or ina219 initialization failed along with details of the failure.

If the 4 sensors are not found you can run `ls /dev/*i2c*` which should return `/dev/i2c-1`. If it doesnt return then make sure that the i2c bus is enabled using raspi-config.

You can also download the i2c-tools by running `sudo apt-get install -y i2c-tools`. Once those are installed you can run `i2cdetect -y 1`. You should see the 4 ina219 sensors detected at the following addresses 0x40, 0x41, 0x42, 0x43. If the sensors are not detected then go back and check the sensor wiring.

## Authors
* **Jean-David Caprace** - *Author of this plugin*
