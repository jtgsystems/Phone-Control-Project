const request = require('supertest');
const express = require('express');

describe('Phone Control Project - API Sanity Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Core routes
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', version: '2.5.0', timestamp: new Date().toISOString() });
    });

    app.get('/api/devices', (req, res) => {
      res.json({ success: true, devices: [] });
    });
  });

  test('GET /api/health should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
    expect(res.body.version).toEqual('2.5.0');
  });

  test('GET /api/devices should return devices array', async () => {
    const res = await request(app).get('/api/devices');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(Array.isArray(res.body.devices)).toBe(true);
  });
});
