import pika


cpar = pika.ConnectionParameters(host='localhost', port=6772)
conn = pika.BlockingConnection(cpar)
ch = conn.channel()
ch.exchange_declare(exchange='miimetiq', type='topic')
ch.exchange_declare(exchange='celeryresults', type='topic')
