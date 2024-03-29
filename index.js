/*
 * Copyright 2022 Jean-David Caprace <jd.caprace@gmail.com>
 *
 * Add the MIT license
 */

const ina219 = require('ina219-async');

module.exports = function (app) {
  let timer = null
  let plugin = {}

  plugin.id = 'signalk-raspberry-pi-4ch-ina219'
  plugin.name = 'Raspberry-Pi 4 channels ina219'
  plugin.description = '4 channels ina219 i2c current/voltage/power sensor on Raspberry-Pi'

  plugin.schema = {
    type: 'object',
    properties: {
      rate: {
        title: "Sample Rate (in seconds)",
        type: 'number',
        default: 5
      },
      i2c_bus: {
        type: 'integer',
        title: 'I2C bus number',
        default: 1
      },
      IN1_pathvoltage: {
        type: 'string',
        title: 'SignalK Path of IN1 voltage',
        description: 'This is used to build the path in Signal K for the IN1 voltage sensor data',
        default: 'electrical.batteries.battery01.voltage' //Units: V (Volt)
		    //https://signalk.org/specification/1.5.0/doc/vesselsBranch.html
      },
      IN1_voltagemultiplier: {
        type: 'number',
        title: 'IN1 voltage multiplier',
        decription: 'Parameter that is going to multiply the IN1 voltage (default: 1). Use value different of 1 for external hall open loop current sensor.',
        default: 1,
      },
      IN1_reportcurrent: {
        type: 'boolean',
        title: 'Also send the IN1 current data to Signalk',
        default: true
      },
      IN1_pathcurrent: {
        type: 'string',
        title: 'SignalK Path of IN1 current',
        description: 'This is used to build the path in Signal K for the IN1 current sensor data',
        default: 'electrical.batteries.battery01.current' //Units: A (Ampere)
		    //https://signalk.org/specification/1.5.0/doc/vesselsBranch.html
      },
      IN1_i2c_address: {
        type: 'string',
        title: 'I2C address of IN1',
        default: '0x40',
      },
      IN2_pathvoltage: {
        type: 'string',
        title: 'SignalK Path of IN2 voltage',
        description: 'This is used to build the path in Signal K for the IN2 voltage sensor data',
        default: 'electrical.batteries.battery02.voltage' //Units: V (Volt)
		    //https://signalk.org/specification/1.5.0/doc/vesselsBranch.html
      },
      IN2_voltagemultiplier: {
        type: 'number',
        title: 'IN2 voltage multiplier',
        decription: 'Parameter that is going to multiply the IN2 voltage (default: 1). Use value different of 1 for external hall open loop current sensor.',
        default: 1,
      },
      IN2_reportcurrent: {
        type: 'boolean',
        title: 'Also send the IN2 current data to Signalk',
        default: true
      },
      IN2_pathcurrent: {
        type: 'string',
        title: 'SignalK Path of IN2 current',
        description: 'This is used to build the path in Signal K for the IN2 current sensor data',
        default: 'electrical.batteries.battery02.current' //Units: A (Ampere)
		    //https://signalk.org/specification/1.5.0/doc/vesselsBranch.html
      },
      IN2_i2c_address: {
        type: 'string',
        title: 'I2C address of IN2',
        default: '0x41',
      },
      IN3_pathvoltage: {
        type: 'string',
        title: 'SignalK Path of IN3 voltage',
        description: 'This is used to build the path in Signal K for the IN3 voltage sensor data',
        default: 'electrical.batteries.battery03.voltage' //Units: V (Volt)
		    //https://signalk.org/specification/1.5.0/doc/vesselsBranch.html
      },
      IN3_voltagemultiplier: {
        type: 'number',
        title: 'IN3 voltage multiplier',
        decription: 'Parameter that is going to multiply the IN3 voltage (default: 1). Use value different of 1 for external hall open loop current sensor.',
        default: 1,
      },
      IN3_reportcurrent: {
        type: 'boolean',
        title: 'Also send the IN3 current data to Signalk',
        default: true
      },
      IN3_pathcurrent: {
        type: 'string',
        title: 'SignalK Path of IN3 current',
        description: 'This is used to build the path in Signal K for the IN3 current sensor data',
        default: 'electrical.batteries.battery03.current' //Units: A (Ampere)
		    //https://signalk.org/specification/1.5.0/doc/vesselsBranch.html
      },
      IN3_i2c_address: {
        type: 'string',
        title: 'I2C address of IN3',
        default: '0x42',
      },
      IN4_pathvoltage: {
        type: 'string',
        title: 'SignalK Path of IN4 voltage',
        description: 'This is used to build the path in Signal K for the IN4 voltage sensor data',
        default: 'electrical.batteries.battery04.voltage' //Units: V (Volt)
		    //https://signalk.org/specification/1.5.0/doc/vesselsBranch.html
      },
      IN4_voltagemultiplier: {
        type: 'number',
        title: 'IN4 voltage multiplier',
        decription: 'Parameter that is going to multiply the IN4 voltage (default: 1). Use value different of 1 for external hall open loop current sensor.',
        default: 1,
      },
      IN4_reportcurrent: {
        type: 'boolean',
        title: 'Also send the IN4 current data to Signalk',
        default: true
      },
      IN4_pathcurrent: {
        type: 'string',
        title: 'SignalK Path of IN4 current',
        description: 'This is used to build the path in Signal K for the IN4 current sensor data',
        default: 'electrical.batteries.battery04.current' //Units: A (Ampere)
		    //https://signalk.org/specification/1.5.0/doc/vesselsBranch.html
      },
      IN4_i2c_address: {
        type: 'string',
        title: 'I2C address of IN4',
        default: '0x43',
      },
    }
  }

  plugin.start = function (options) {

    function createDeltaMessageIN1 (voltage, current) {
      var values = [
        {
          'path': options.IN1_pathvoltage,
          'value': voltage
        }
      ];
    
    // Report current if desired
    if (options.IN1_reportcurrent == true) {
      values.push(
        {
          'path': options.IN1_pathcurrent,
          'value': current
        });
      }
      
      return {
        'context': 'vessels.' + app.selfId,
        'updates': [
          {
            'source': {
              'label': plugin.id
            },
            'timestamp': (new Date()).toISOString(),
            'values': values
          }
        ]
      }
    }

    function createDeltaMessageIN2 (voltage, current) {
      var values = [
        {
          'path': options.IN2_pathvoltage,
          'value': voltage
        }
      ];
    
    // Report current if desired
    if (options.IN2_reportcurrent == true) {
      values.push(
        {
          'path': options.IN2_pathcurrent,
          'value': current
        });
      }
      
      return {
        'context': 'vessels.' + app.selfId,
        'updates': [
          {
            'source': {
              'label': plugin.id
            },
            'timestamp': (new Date()).toISOString(),
            'values': values
          }
        ]
      }
    }

    function createDeltaMessageIN3 (voltage, current) {
      var values = [
        {
          'path': options.IN3_pathvoltage,
          'value': voltage
        }
      ];
    
    // Report current if desired
    if (options.IN3_reportcurrent == true) {
      values.push(
        {
          'path': options.IN3_pathcurrent,
          'value': current
        });
      }
      
      return {
        'context': 'vessels.' + app.selfId,
        'updates': [
          {
            'source': {
              'label': plugin.id
            },
            'timestamp': (new Date()).toISOString(),
            'values': values
          }
        ]
      }
    }

    function createDeltaMessageIN4 (voltage, current) {
      var values = [
        {
          'path': options.IN4_pathvoltage,
          'value': voltage
        }
      ];
    
    // Report current if desired
    if (options.IN4_reportcurrent == true) {
      values.push(
        {
          'path': options.IN4_pathcurrent,
          'value': current
        });
      }
      
      return {
        'context': 'vessels.' + app.selfId,
        'updates': [
          {
            'source': {
              'label': plugin.id
            },
            'timestamp': (new Date()).toISOString(),
            'values': values
          }
        ]
      }
    }

	  // Read ina219 sensor data -- 4 channels
    // TODO - When working, to be modified fo N channels (do it more pretty :-) )
    async function readina219() {
		  const sensorIN1 = ina219(Number(options.IN1_i2c_address), options.i2c_bus);
      const sensorIN2 = ina219(Number(options.IN2_i2c_address), options.i2c_bus);
      const sensorIN3 = ina219(Number(options.IN3_i2c_address), options.i2c_bus);
      const sensorIN4 = ina219(Number(options.IN4_i2c_address), options.i2c_bus);
            
      await sensorIN1.calibrate32V2A();
      await sensorIN2.calibrate32V2A();
      await sensorIN3.calibrate32V2A();
      await sensorIN4.calibrate32V2A();

		  const busvoltageIN1 = await sensorIN1.getBusVoltage_V();
      app.debug("IN1 Bus voltage (V): " + busvoltageIN1);
      const shuntvoltageIN1 = await sensorIN1.getShuntVoltage_mV();
      app.debug("IN1 Shunt voltage (mV): " + shuntvoltageIN1);
      const shuntcurrentIN1 = await sensorIN1.getCurrent_mA();
      app.debug("IN1 Current (mA): " + shuntcurrentIN1);
      // Change units to be compatible with SignalK
      shuntcurrentIN1A = shuntcurrentIN1 / 1000;
      app.debug("IN1 Load Current (A): " + shuntcurrentIN1A);
      loadvoltageIN1V = (busvoltageIN1 + (shuntvoltageIN1 / 1000))*options.IN1_voltagemultiplier;
      app.debug("IN1 Load voltage (V): " + loadvoltageIN1V);

		  const busvoltageIN2 = await sensorIN2.getBusVoltage_V();
      app.debug("IN2 Bus voltage (V): " + busvoltageIN2);
      const shuntvoltageIN2 = await sensorIN2.getShuntVoltage_mV();
      app.debug("IN2 Shunt voltage (mV): " + shuntvoltageIN2);
      const shuntcurrentIN2 = await sensorIN2.getCurrent_mA();
      app.debug("IN2 Current (mA): " + shuntcurrentIN2);
      // Change units to be compatible with SignalK
      shuntcurrentIN2A = shuntcurrentIN2 / 1000;
      app.debug("IN2 Load Current (A): " + shuntcurrentIN2A);
      loadvoltageIN2V = (busvoltageIN2 + (shuntvoltageIN2 / 1000))*options.IN2_voltagemultiplier;
      app.debug("IN2 Load voltage (V): " + loadvoltageIN2V);

      const busvoltageIN3 = await sensorIN3.getBusVoltage_V();
      app.debug("IN3 Bus voltage (V): " + busvoltageIN3);
      const shuntvoltageIN3 = await sensorIN3.getShuntVoltage_mV();
      app.debug("IN3 Shunt voltage (mV): " + shuntvoltageIN3);
      const shuntcurrentIN3 = await sensorIN3.getCurrent_mA();
      app.debug("IN3 Current (mA): " + shuntcurrentIN3);
      // Change units to be compatible with SignalK
      shuntcurrentIN3A = shuntcurrentIN3 / 1000;
      app.debug("IN3 Load Current (A): " + shuntcurrentIN3A);
      loadvoltageIN3V = (busvoltageIN3 + (shuntvoltageIN3 / 1000))*options.IN3_voltagemultiplier;
      app.debug("IN3 Load voltage (V): " + loadvoltageIN3V);

      const busvoltageIN4 = await sensorIN4.getBusVoltage_V();
      app.debug("IN4 Bus voltage (V): " + busvoltageIN4);
      const shuntvoltageIN4 = await sensorIN4.getShuntVoltage_mV();
      app.debug("IN4 Shunt voltage (mV): " + shuntvoltageIN4);
      const shuntcurrentIN4 = await sensorIN4.getCurrent_mA();
      app.debug("IN4 Current (mA): " + shuntcurrentIN4);
      // Change units to be compatible with SignalK
      shuntcurrentIN4A = shuntcurrentIN4 / 1000;
      app.debug("IN4 Load Current (A): " + shuntcurrentIN4A);
      loadvoltageIN4V = (busvoltageIN4 + (shuntvoltageIN4 / 1000))*options.IN4_voltagemultiplier;
      app.debug("IN4 Load voltage (V): " + loadvoltageIN4V);

        //app.debug(`data = ${JSON.stringify(data, null, 2)}`);
		    //app.debug(data)
        
        // create message
        var deltaIN1 = createDeltaMessageIN1(loadvoltageIN1V, shuntcurrentIN1A)
        var deltaIN2 = createDeltaMessageIN2(loadvoltageIN2V, shuntcurrentIN2A)
        var deltaIN3 = createDeltaMessageIN3(loadvoltageIN3V, shuntcurrentIN3A)
        var deltaIN4 = createDeltaMessageIN4(loadvoltageIN4V, shuntcurrentIN4A)
        
        // send data
        app.handleMessage(plugin.id, deltaIN1)
        app.handleMessage(plugin.id, deltaIN2)	
        app.handleMessage(plugin.id, deltaIN3)	
        app.handleMessage(plugin.id, deltaIN4)			
	
        //close sensor
        //await sensor.close()

      .catch((err) => {
      app.debug(`ina219 read error: ${err}`);
      });
    }

    //readina219();
    
    timer = setInterval(readina219, options.rate * 1000);
  }

  plugin.stop = function () {
    if(timer){
      clearInterval(timer);
      timeout = null;
    }
  }

  return plugin
}