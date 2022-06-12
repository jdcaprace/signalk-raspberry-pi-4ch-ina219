
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

Note that you must connect GND when testing different power adpter, otherwise, the VBus voltage cannot be measured.

WARNING: the current range is [-3.2 A to 3.2 A] and voltage range [0-26 VDC].

## How to measure currents higher than 3A
Two options can be developped: (i) using an external shunt, (ii) using an non invasive current sensor.

### Using an external shunt
In order to apply this solution you will need to (1) remove the PCB shunts with a soldering iron, (2) buy an external shunt adapted to the maximum value of the current that you want to measure.

There is an excellent SignalK plugin [signalk-raspberry-pi-ina219hat] thay has been developped by Brian Scally that can be used in this case. You can also have a look on the other developments of Brian here: https://github.com/scallybmHome

### Using an indirect current sensor
In order to apply this solution you can use this plugin buying one or several non invasive current sensor depending of your needs (hall open loop current sensor).

The sugestion is to find sensors that has supply voltage of +5V and a rated output of 2.5+-0.625V with a frequency range of DC to 25KHz. In that way you can measure the current by measuring a voltage.

We suggest the use of the [YHDC](https://en.yhdc.com/product/Hall-split-core-current-sensor-21#c_product_list-14969874102643207-1) sensors:

* Model [HSTS016L](https://pt.aliexpress.com/item/32836805934.html) - With rated inputs from +-10A to +-200A
* Model [HST(S21)](https://pt.aliexpress.com/item/32656614775.html) - With rated inputs from +-50A to +-600A
* Model [HST(S)30](https://pt.aliexpress.com/item/32658308104.html) - With rated inputs from +-100A to +-1000A

## Troubleshooting
When you first start SK, you should see one of two things in the /var/log/syslog; ina219 initialization succeeded or ina219 initialization failed along with details of the failure.

If the 4 sensors are not found you can run `ls /dev/*i2c*` which should return `/dev/i2c-1`. If it doesnt return then make sure that the i2c bus is enabled using raspi-config.

You can also download the i2c-tools by running `sudo apt-get install -y i2c-tools`. Once those are installed you can run `i2cdetect -y 1`. You should see the 4 ina219 sensors detected at the following addresses 0x40, 0x41, 0x42, 0x43. If the sensors are not detected then go back and check the sensor wiring.

## Authors
* **Jean-David Caprace** - *Author of this plugin*
