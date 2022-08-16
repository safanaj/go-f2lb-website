import {Empty} from "google-protobuf/google/protobuf/empty_pb";

export const doCallInPromise = (clients, queueName, methodName, destStore, responseFieldName) => {
  return new Promise((resolve, reject) => {
    clients[queueName][methodName](new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
  }).then(r => destStore.set(r.toObject()[responseFieldName]))
}
