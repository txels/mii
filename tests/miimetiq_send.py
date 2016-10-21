import pika


cpar = pika.ConnectionParameters(host='localhost', port=6772)
conn = pika.BlockingConnection(cpar)
ch = conn.channel()

key = 'miimetiq.ds.writer.boolean.6-diesel_generator_schema.56090580e7e466125aa1c0a5.generator.power'

ch.basic_publish(
    'miimetiq', key, 'True',
    properties=pika.spec.BasicProperties(correlation_id='1234-56678')
)
