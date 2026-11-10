<img width="960" height="580" alt="image" src="https://github.com/user-attachments/assets/72faeeff-7db6-4472-ae0f-5d5865367930" />

# Deep Roots Navigator

Deep Roots Navigator helps KubeCon attendees discover open-source contribution paths, connect with communities, and participate in live event engagement activities.

## Features

- Personalized contribution recommendations
- Deep Roots Community Pulse dashboard
- CNCF project suggestions
- Region and community analytics
- Kubernetes-hosted application
- Elasticsearch attendee indexing

## Built With

- Kubernetes
- Radar
- Node.js
- Elasticsearch

## Challenge Story

While developing Community Pulse, we discovered an architectural issue where attendee submissions were stored in pod memory. Because Kubernetes load balanced requests across replicas, analytics became inconsistent.

We diagnosed the issue using Kubernetes runtime information and began migrating attendee storage to Elasticsearch, creating a shared data layer that supports future features such as:

- Mentor matching
- People Like You
- Talk recommendations
- Global Community Pulse analytics
