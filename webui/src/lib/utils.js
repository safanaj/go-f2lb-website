import {Empty} from "google-protobuf/google/protobuf/empty_pb";

export const doCallInPromise = (clients, queueName, methodName, destStore, responseFieldName) => {
  return new Promise((resolve, reject) => {
    clients[queueName][methodName](new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
  }).then(r => r.toObject()).then(r => responseFieldName ? r[responseFieldName] : r).then(r => destStore.set(r))
}

export const waitFor = (condFn, maxTimeout) => {
  const checkAndMayBeWait = (condFn, until, resolve, reject) => {
    if (until < 0) { return reject(new Error("timeout expired")) }
    if (condFn()) { return resolve() }
    setTimeout(() => checkAndMayBeWait(condFn, until - 50, resolve, reject), 50)
  }
  return new Promise((resolve, reject) => { checkAndMayBeWait(condFn, maxTimeout * 1000, resolve, reject) })
}
