import { cp, mkdir } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()
const srcDir = path.join(projectRoot, 'src')
const distDir = path.join(projectRoot, 'dist')

await mkdir(distDir, { recursive: true })
await cp(path.join(srcDir, 'index.html'), path.join(distDir, 'index.html'))
await cp(path.join(srcDir, 'styles.css'), path.join(distDir, 'styles.css'))
