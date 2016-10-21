import json
import time
from unittest import TestCase
from uuid import uuid4
import pika

key = (
    'miimetiq.ds.writer.boolean.'
    '6-diesel_generator_schema.56090580e7e466125aa1c0a5.'
    'generator.power'
)


class TestClientSampleE2E(TestCase):

    def setUp(self):
        cpar = pika.ConnectionParameters(host='localhost', port=6772)
        conn = pika.BlockingConnection(cpar)
        self.ch = conn.channel()

    def _send(self, correlation_id):
        self.ch.basic_publish(
            'miimetiq', key, 'True',
            properties=pika.spec.BasicProperties(correlation_id=correlation_id)
        )

    def _receive(self, task_id):
        queue = task_id.replace('-', '')
        print(queue)
        meth, head, body = self.ch.basic_get(queue=queue, no_ack=True)
        parsed = json.loads(body.decode('ascii'))
        return parsed

    def test_sample_client_replies_correctly(self):
        task_id = '123-456-78'
        self._send(str(task_id))
        time.sleep(1)
        result = self._receive(task_id)
        self.assertEqual(result['status'], 'SUCCESS')
        self.assertEqual(result['task_id'], task_id)
