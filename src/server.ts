import { app } from './app'

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT)

console.log(`🚀 Cross Gen API running at http://localhost:${PORT}`)
console.log('📖 Swagger docs available at http://localhost:%s/swagger', PORT)