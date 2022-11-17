## ADR 1.0
### Title: **Selecting the Message Broker**
---
* **Issue**: KTERN needs to process a huge number of events in real-time while implementing the application in a microservice architecture. So, the problem is to select a message broker that will be able to handle high-volume, low-latency message processing.

* **Decision**: 
    - **Kafka** for handling high volume, high throughput, and low latency processing.
    - **RabbitMQ** for long-running tasks when reliable background jobs need to be run.  
* **Status**: Decided. Open to revisiting if/when new tooling becomes available.

* **Assumptions**: Although the three message brokers have support for all major languages including Python, Java, C/C++, Clojure, .NET, PHP, Ruby, and JavaScript, this decision is proposed assuming that the primary language would be JavaScript. PoCs were implemented using JavaScript with the below-mentioned requirements.
    -   Node Version: `16.17.0`
    -   Docker version: `20.10.20, build 9fdeb9c`
    -   RabbitMQ Image: `rabbitmq:3.8-management-alpine`
    -   RabbitMQ Version: `3.8.34`
    -   Kafka Image: `bitnami/kafka`
    -   Kafka version: `3.8.34`
    -   Zookeeper Image: `bitnami/zookeeper`
    -   Zookeeper Version: `3.8.0`
    -   Redis Image: `redis`
    -   Redis Version: `7.0.5`


* **Constraints**: Right now, the KTERN engineering team needs a Message broker that could handle both Event streaming and batch processing. At the same time, it should be capable of covering all the possible edge cases. Also, the chosen tool needs to have a large community and good documentation.

* **Argument**: 
    -  If performance is the only consideration, then Redis could be a better option since it does not persist messages and it will deliver them faster. Due to its extremely fast service and in-memory database, it is good for short retention messages when persistence isn’t much important, and in situations where some level of loss could be handled.
    -   Kafka is a high-performance message broker and could handle up to one million messages per second. On the other hand, RabbitMQ could handle 50k messages per second. There has been a steady growth in the client library lists of both RabbitMQ and Kafka. As more languages and frameworks are becoming popular, finding a well-supported and complete library for RabbitMQ and Kafka has become easier. So, there is no need to worry about development resource availability. The client library implementation of Kafka and RabbitMQ has grown substantially, making it easier for developers to process and stream data. 
    -   Both RabbitMQ and Kafka provide built-in tools for managing security and operations. Plus, both platforms offer third-party tools that enhance monitoring metrics from nodes, clusters, queues, etc.

* **Positions**: The primary considerations of message brokers are highly scalable, fast, and ability to reread events. Even though Redis is highly scalable and fast, it lacks message retention as it is, at its core, an in-memory database. It also doesn’t support the producer-consumer messaging model. Even though RabbitMQ has the support for both Pub/Sub and Producer/Consumer messaging models, it did not have the support of major cloud provider stacks like AWS and Azure. RabbitMQ is also not a preferable option when we consider performance. Kafka managed to fulfil all the requirements needed and stands out from all others.

* **Implications**: 
     -  Kafka has a steep learning curve, and Engineers need extensive training to learn Kafka’s basic foundations and the core elements of an event streaming architecture. 
    -   Kafka uses Zookeeper to coordinate controller election and store information such as cluster membership, access control, and topic configs. Zookeeper itself is a distributed system that’s resilient to partial failures. Of course, we’ll need to deploy Zookeeper in a distributed fashion. Kafka stores the topics and partitions information in Zookeeper. Zookeeper’s availability can be enhanced by adding more instances, but its capacity is bottlenecked by individual nodes. So, when comes to deployment little bit of effort is needed when considering Kafka. 
    -   In RabbitMQ, performance lag is expected when in persistent mode.
    -   However, these implications could be manageable. The emergence of Kubernetes in recent times has led to allowing infrastructure operators to run both Kafka and RabbitMQ on Kubernetes.  

* **Related requirements**: Every backend engineers need to have some basic knowledge about docker, containers and images. It is essentitial not only for development of Kafka, But also required while implementing other message brokers.

* **Date** : 17-11-2022
* **Version**: 0.1
* **Changelog**: 
    - Initial version
