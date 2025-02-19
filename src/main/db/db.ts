import path from 'path'
import sqlite3 from 'sqlite3'

type Macro = {
  id: number
  nome: string
  descricao: string
}

const dbPath = path.resolve(__dirname, 'macro.db')
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados', err)
  } else {
    console.log('Conectado ao banco de dados SQLite')
    createTable()
  }
})

export function createTable(): void {
  const query = `
            CREATE TABLE IF NOT EXISTS macro (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `

  db.run(query, (err) => {
    if (err) {
      console.error('Erro ao criar tabela', err)
    } else {
      console.log('Tabela macro criada ou já existente')
    }
  })
}

export function getAllMacro(): Promise<Macro[]> {
  return new Promise((resolve, reject) => {
    db.all<Macro>('SELECT * FROM macro', [], (err, rows) => {
      if (err) {
        reject(err.message)
      } else {
        resolve(rows)
      }
    })
  })
}

export const getMacroById = async (id): Promise<Macro> => {
  const sql = 'SELECT * FROM macro WHERE id = ?'
  return new Promise<Macro>((resolve, reject) => {
    db.get<Macro>(sql, id, (err, row) => {
      if (err) reject(err)
      resolve(row)
    })
  })
}

export function insertMacro(title, message): string {
  if (!title || title == null || title == undefined) {
    throw new Error('O titulo é obrigatorio')
  }
  if (!message || message == null || message == undefined) {
    throw new Error('A menssagem é obrigatoria')
  }
  db.run('INSERT INTO macro (title, mensage, createdAt) VALUES (?, ?, ?)', [title, message])
  return 'ok'
}

module.exports = { db, createTable, getAllMacro, insertMacro }
