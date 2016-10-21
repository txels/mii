import json
import pika


cpar = pika.ConnectionParameters(host='localhost', port=6772)
conn = pika.BlockingConnection(cpar)
ch = conn.channel()

key = 'miimetiq.ds.writer.boolean.6-diesel_generator_schema.56090580e7e466125aa1c0a5.generator.power'

meth, head, body = ch.basic_get(queue='123456678', no_ack=True)
parsed = json.loads(body.decode('ascii'))
if parsed['status'] == 'SUCCESS' and parsed['task_id'] == '1234-56678':
    exit(0)
else:
    exit(-1)
