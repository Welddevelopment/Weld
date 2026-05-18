import fs from 'node:fs'
import path from 'node:path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Avoid parallel webpack worker on Windows — intermittent PageNotFoundError
  // ("Cannot find module for page") during "Collecting page data" / production builds.
  experimental: {
    webpackBuildWorker: false
  }
}

// #region agent log
;(function _agentNextChunkAudit() {
  const cwd = process.cwd()
  const serverRoot = path.join(cwd, '.next', 'server')
  const wp = path.join(serverRoot, 'webpack-runtime.js')
  const doc = path.join(serverRoot, 'pages', '_document.js')
  let webpackRefs8948 = false
  let documentRequiresNumeric = []
  try {
    if (fs.existsSync(wp)) {
      webpackRefs8948 = fs.readFileSync(wp, 'utf8').includes('8948')
    }
    if (fs.existsSync(doc)) {
      const t = fs.readFileSync(doc, 'utf8')
      documentRequiresNumeric = [...t.matchAll(/require\(['"]\.\/(\d+)\.js['"]\)/g)].map((m) => m[1])
    }
  } catch (e) {
    documentRequiresNumeric = [`read_error:${String(e)}`]
  }
  const chunkExists = (id) => ({
    root: fs.existsSync(path.join(serverRoot, `${id}.js`)),
    chunks: fs.existsSync(path.join(serverRoot, 'chunks', `${id}.js`)),
  })
  const missingFromDocument = documentRequiresNumeric.filter((id) => {
    const c = chunkExists(id)
    return !c.root && !c.chunks
  })
  const entry = {
    sessionId: 'b9c3cb',
    hypothesisId: 'A_stale_or_partial_next',
    location: 'next.config.mjs:_agentNextChunkAudit',
    message: 'next_config_load_chunk_audit',
    data: {
      pid: process.pid,
      serverRootExists: fs.existsSync(serverRoot),
      webpackRuntimeExists: fs.existsSync(wp),
      documentJsExists: fs.existsSync(doc),
      chunk8948: chunkExists('8948'),
      webpackRuntimeReferences8948: webpackRefs8948,
      documentNumericRequires: documentRequiresNumeric,
      missingNumericChunksFromDocument: missingFromDocument,
      nodeEnv: process.env.NODE_ENV,
    },
    timestamp: Date.now(),
    runId: 'pre-fix',
  }
  try {
    fs.appendFileSync(path.join(cwd, 'debug-b9c3cb.log'), `${JSON.stringify(entry)}\n`)
  } catch (_) {}
  void fetch('http://127.0.0.1:7800/ingest/4871e34b-6d73-41cf-b5ee-06e5fbc2063e', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b9c3cb' },
    body: JSON.stringify(entry),
  }).catch(() => {})
})()
// #endregion

export default nextConfig
