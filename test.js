import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const server = await createServer({
  // any valid user config options, plus `mode` and `configFile`
//   configFile: false,
  root: __dirname,
  configLoader: 'runner',
  server: {
    port: 1337,
    host: true
  },
})
await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
