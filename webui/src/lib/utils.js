export const waitFor = (condFn, maxTimeout) => {
  const checkAndMayBeWait = (condFn, until, resolve, reject) => {
    if (until < 0) { return reject(new Error("timeout expired")) }
    if (condFn()) { return resolve() }
    setTimeout(() => checkAndMayBeWait(condFn, until - 50, resolve, reject), 50)
  }
  return new Promise((resolve, reject) => { checkAndMayBeWait(condFn, maxTimeout * 1000, resolve, reject) })
}
