## What does the code do?

The code sample looks like it could be one of two things, depending on whether it is intended to run in an IoT device, or off-device in application code:
- On-device: a skeleton for a device's actuator to switch one instrument's power on of off (missing the actual interfacing with the hardware).
- Off-device: this looks like it could be a skeleton for a reporter of a specific device type powering on or off.

I'd say that given the fact that the topic is `miimetiq.ds.writer.*`, one could infer that this means "writing to a device" (although if seen from the PoV of the device, this means "writing to the outside world"). So it's not obvious from the naming convention alone.

### On-device case
What I infer happens in the outside world is that application code (or another device) is sending a message to turn on/off the generator's power.

The device running the sample code gets that message, and replies with an OK result that it has supposedly done so. That reply is sent to a generic "task completion exchange" but uses a task id (aka correlation id) as a mechanism to identify the "calling request" [1].

[1] this could be intended to be read back by the caller (e.g. as some sort of async remote call) or some reporting tool.

### Off-device case
Things that I infer happend outside of this code: when a device is powered on or off, a message is sent to a queue.

Things that this code does (high level):
- it reports those state changes to stdout
- it sends some sort of custom response (currently just some sort of acknowledgement)

## How does the code work?

Specifics on how the code works:
- It creates a queue for consuming messages.
- It binds it to an exchange `miimetiq`, bound on topic `miimetiq.ds.writer.boolean.6-diesel_generator_schema.56090580e7e466125aa1c0a5.generator.power` that identifies and instrument's actuator or signal from a specific individual device.
- It listens to messages on that queue. For each message, callback is invoked.

## What do you think is the purpose of the “callback” function?

- It is called every time a new message arrives
- It prints what it has received (the routing key that identifies the device, and the body that seems to be power status)
- It generates an “OK” result and posts it to a results exchange, using the task ID it received as the routing.
- Messages include a property “correlation_id” (used to identify the "source call") which looks like some sort of uuid. That is normalized by removing the ‘-’ (to generate a valid queue name). That queue name is then used to post results to. Results are available for 1m (the expiry of that queue).


## Unclear Things

The client seems to connect with credentials that include the device model.
This seems to me like an accidental coupling of the client with the devices themselves. As I've understood it, this client code doesn't necessarily run within a device, but within a client application that is interested in listening to the device.

Maybe this is just something accidental.
