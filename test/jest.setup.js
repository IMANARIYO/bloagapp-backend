// Mock environment variables needed for tests
process.env = {
  ...process.env,
  saltRounds: '10',
  JWT_SECRET: 'test-secret-key'
}


