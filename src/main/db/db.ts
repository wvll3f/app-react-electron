/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import { title } from 'process'
import sqlite3 from 'sqlite3'

type requestMacro = {
  title: string
  message: string
}

const dbPath = path.resolve(__dirname, 'macro.db')

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

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados', err)
  } else {
    console.log('Conectado ao banco de dados SQLite')
    createTable()
  }
})

export function getAllMacro(): Promise<any> {
  return new Promise((resolve, reject) => {
    db.all<any>('SELECT * FROM macro', [], (err, rows) => {
      if (err) {
        reject(err.message)
      } else {
        resolve(rows)
      }
    })
  })
}

export const getMacroById = async (id): Promise<any> => {
  const sql = 'SELECT * FROM macro WHERE id = ?'
  return new Promise<any>((resolve, reject) => {
    db.get(sql, id, (err, row) => {
      if (err) reject(err)
      return resolve(row)
    })
  })
}
export const deleteMacroById = async (id): Promise<any> => {
  const sql = `DELETE FROM macro WHERE id = ?`
  return new Promise<any>((resolve, reject) => {
    db.run(sql, id, (err, row) => {
      if (err) reject(err)
      resolve(row)
    })
  })
}
export const updateMacroById = async (title, message, id): Promise<any> => {
  const sql = `UPDATE macro SET (title, message) = (?, ?) WHERE id = ?`
  const data = {
    title: title,
    message: message,
    id: id
  }
  return new Promise<any>((resolve, reject) => {
    db.run(sql, { title, message, id }, (err, row) => {
      if (err) reject(err)
      resolve(row)
    })
  })
}

export function insertMacro({ title, message }: requestMacro): void {
  if (!title) {
    throw new Error('O título é obrigatório')
  }
  if (!message) {
    throw new Error('A mensagem é obrigatória')
  }
  db.run('INSERT INTO macro (title, message) VALUES (?, ?)', [title, message])
}

