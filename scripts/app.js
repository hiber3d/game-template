import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('../', import.meta.url))

const server = await createServer({
  root: __dirname,
  configLoader: 'runner',
})
await server.listen()

// const server = await preview({
//   root: __dirname,
//   configLoader: 'runner',
// })

server.printUrls()
// server.bindCLIShortcuts({ print: true })

process.parentPort?.postMessage({ message: 'ready', url: server.resolvedUrls.local[0] })