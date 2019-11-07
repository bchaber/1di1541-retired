#
# Build stage
#
FROM maven:3.6.0-jdk-11-slim AS build
COPY pom.xml /home/app/
RUN mvn -f /home/app/pom.xml verify clean --fail-never
COPY src /home/app/src
RUN mvn -f /home/app/pom.xml clean package

#
# Package stage
#
FROM openjdk:11-jre-slim
COPY --from=build /home/app/target/soap-api-0.0.1-SNAPSHOT.jar /usr/local/lib/stos-api.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/usr/local/lib/stos-api.jar"]
