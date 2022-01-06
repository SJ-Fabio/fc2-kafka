let Kafka = require("node-rdkafka");

class kafkaServer {
  send(sMessage, messageId) {
    var producer = new Kafka.Producer({
      "metadata.broker.list": "nodekafka_kafka_1:9092",
      "delivery.timeout.ms": "0",
      acks: "1",
      dr_cb: true,
      "enable.idempotence": "false",
    });

    producer.connect();

    // Wait for the ready event before proceeding
    producer.on("ready", function () {
      try {
        producer.produce(
          // Topic to send the message to
          "TopicoTeste",
          // optionally we can manually specify a partition for the message
          // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
          null,
          // Message to send. Must be a buffer
          Buffer.from(sMessage),
          // for keyed messages, we also specify the key - note that this field is optional
          "KeyTeste1",
          // you can send a timestamp here. If your broker version supports it,
          // it will get added. Otherwise, we default to 0
          Date.now()
          // you can send an opaque token here, which gets passed along
          // to your delivery reports
        );
      } catch (err) {
        console.error("A problem occurred when sending our message");
        console.error(err);
      }
    });

    // Any errors we encounter, including connection errors
    producer.on("event.error", function (err) {
      console.error("Error from producer");
      console.error(err);
    });

    // We must either call .poll() manually after sending messages
    // or set the producer to poll on an interval (.setPollInterval).
    // Without this, we do not get delivery events and the queue
    // will eventually fill up.
    producer.setPollInterval(1);

    producer.on("delivery-report", function (err, report) {
      // Report of delivery statistics here:

      let sKey = report.key.toString();

      console.log(
        `Id: ${messageId} | Topico ${report.topic} | Partição ${report.partition} | Offset: ${report.offset} | Key: ${sKey}`
      );
    });
  }
}

for (let messageId = 0; messageId <= 10; messageId++) {
  let sMessage = `Teste de envio em massa com key iD ${messageId}`;
  let timeOut = messageId * 1000;
  let sId = messageId;

  setTimeout(() => {
    new kafkaServer().send(sMessage, sId);
  }, timeOut);
}
