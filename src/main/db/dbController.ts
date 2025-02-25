/* eslint-disable @typescript-eslint/explicit-function-return-type */
import path from 'path'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

interface IMacro {
  id: number
  title: string
  message: string
  createdAt: string
}

const dbPath = path.resolve(__dirname, '..', 'macro.db')

export async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

export async function createTable() {
  openDb().then((db) => {
    db.exec(
      `
            CREATE TABLE IF NOT EXISTS macros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `
    ).then(() => {
      console.log('Tabela criada com sucesso!')
    })
  })
}

export async function selectMacros(): Promise<IMacro[]> {
  const db = await openDb()
  const macros = await db.all('SELECT * FROM macros')
  return macros
}

export async function selectMacroById(id): Promise<IMacro> {
  const db = await openDb()
  const macro = await db.get('SELECT * FROM macros WHERE id=?', [id])
  return macro
}

export async function insertMacro(macro) {
  openDb()
    .then((db) => {
      db.run('INSERT INTO macros (title, message) VALUES (?,?)', [macro.title, macro.message])
    })
    .then((res) => {
      return res
    })
}

export async function updateMacro(macro) {
  openDb().then((db) => {
    db.run('UPDATE macros SET title=?, message=? WHERE id=?', [
      macro.title,
      macro.message,
      macro.id
    ])
  })
}

export async function deleteMacro(id) {
  openDb().then((db) => {
    db.get('DELETE FROM macros WHERE id=?', [id]).then((res) => res)
  })
}
