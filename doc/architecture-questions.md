10 Mb very large for SPA. Not mobile-ready.
- Does it use a script loader?
- Is it minified and served gzipped?

Size of components in diagram do not reflect anything relevant?
 (e.g. AMQP is huge)
Directionality would help.

Distribution system is the gateway for devices to talk to system. It's a protocol adapter between device-specific protocol and AMQP (the "connection layers").

Rules and actions: workflows/event language?

uWsgi, flask, EVE (on top of flask, to create ReST services, makes ~DB structure based on JSON file).

How do you handle delivery guarantees with rabbitmq?
Downtime?

NodeRED - flow programming engine (nodejs) creates rules that run in a worker. They also use it to adapt protocols.

Mongo why not rethinkdb (designed for real time).

CL: one nodered instance per tenant. What real-world entity does a "tenant" represent in this system?

Docker: com feu la posta en producció? (kubernetes, swarm, etc...)
