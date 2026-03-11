const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../app');

let server;
let baseUrl;

before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

// Helper to make HTTP requests without external dependencies
function request(method, path, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      headers: { 'Content-Type': 'application/json', ...headers },
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('DELETE restriction for claude role', () => {
  it('returns 403 when claude role attempts DELETE', async () => {
    const res = await request('DELETE', '/items/1', {
      headers: { 'X-Role': 'claude' },
    });
    assert.equal(res.status, 403);
    assert.equal(res.body.error, 'Forbidden');
  });

  it('allows DELETE for non-claude roles', async () => {
    const res = await request('DELETE', '/items/1', {
      headers: { 'X-Role': 'admin' },
    });
    assert.ok([204, 404].includes(res.status));
  });

  it('allows GET for claude role', async () => {
    const res = await request('GET', '/items', {
      headers: { 'X-Role': 'claude' },
    });
    assert.equal(res.status, 200);
  });

  it('allows POST for claude role', async () => {
    const res = await request('POST', '/items', {
      headers: { 'X-Role': 'claude' },
      body: { name: 'New Item' },
    });
    assert.equal(res.status, 201);
  });
});
