const Kafka = require("node-rdkafka");

var consumer = new Kafka.KafkaConsumer(
  {
    "group.id": "nodeApp-Group",
    "client.id": "nodeApp-Consumer",
    "metadata.broker.list": "nodekafka_kafka_1:9092",
    "auto.offset.reset": "earliest",
  },
  {}
);

// Flowing mode
consumer.connect();

consumer
  .on("ready", function () {
    consumer.subscribe(["TopicoTeste"]);

    consumer.consume();
  })
  .on("data", function (data) {
    // Output the actual message contents
    console.log(
      data.offset,
      data.key.toString(),
      data.topic,
      data.partition,
      data.value.toString()
    );
  });
