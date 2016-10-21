# Problem statement

Imagine that we want to create a Node.JS library to abstract common RabbitMQ actions with MIIMETIQ, common features are: publish, subscribe and RPC (Remote Procedure Calls) calls (be creative). Understand that RPC calls tries to have the RPC functionality using AMQP architecture.


## Define the packages and contracts of your solution

Library should be a high-level abstraction to map common device operations (that will ultimately be using rabbitMQ as a transport).

The main packages could be those described in the following sections.

### Device Domain

These are the main models that constitute the IoT domain of devices:
- Device: represents a physical (or maybe even virtual) device in the network. Fields: model, id, instruments
- Instrument: a specific instrument within a device. Fields: signals it can emit, operations it can perform (aka capabilities)
- Signal: a source of discrete values, that typically represent something in the real world (e.g. the measurement of a sensor). Fields: name, dataType (bool, int, string...)
- Operation: some action that can be performed by a device (e.g. turn something on/off, mechanical movement, etc). Fields: name, parameters.

### Base Connection layer

This models the lower level abstractions for connecting to things:
- Broker, Routing: for sending messages
- Tenant: for isolation of authentication and permissions

### Discovery

This is about finding devices in our network, and querying for status and capabilities.
- Find available devices.
- Check for device capabilities: what signals they provide, and which operations they can perform.

E.g. request capabilities from a device would be the equivalent of HTTP OPTIONS for the Miimetiq world. Send a message to a device, get called back with the devices capabilities (that follows a standardised format).


### Activity

Actions to be performed:
- Subscribe: to a device, to a device's signal, to a signal on all devices...
- Request a device to execute one of its advertised operations (e.g. turn lights off) - with or without response data
- As a device, publish a signal (e.g. temperature has gone above or below given thresholds).


## Program at least two features of your proposal


## Don’t forget testing
