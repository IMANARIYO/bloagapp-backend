import { jest } from '@jest/globals'
import {
  AppError,
  catchAsync,
  badroutes,
  errosingeneral,
  handleCastErrorDb,
  sendErrorDev,
  sendErrorpro
} from '../src/middlewares/globaleerorshandling'
describe('AppError', () => {
  test('should create an operational error with correct properties', () => {
    const message = 'Test error message'
    const statusCode = 400
    const error = new AppError(message, statusCode)

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe(message)
    expect(error.statusCode).toBe(statusCode)
    expect(error.status).toBe('fail')
    expect(error.isOperational).toBe(true)
  })

  test('should set status to "error" when status code starts with 5', () => {
    const error = new AppError('Server error', 500)

    expect(error.status).toBe('error')
  })
})

describe('catchAsync', () => {
  test('should return a function', () => {
    const fn = jest.fn()
    const catchAsyncResult = catchAsync(fn)

    expect(typeof catchAsyncResult).toBe('function')
  })

  test('should call the provided function with req, res, next parameters', async () => {
    const fn = jest.fn().mockResolvedValue('result')
    const wrapped = catchAsync(fn)

    const req = {}
    const res = {}
    const next = jest.fn()

     wrapped(req, res, next)

    expect(fn).toHaveBeenCalledWith(req, res, next)
  })

  test('should call next with error when function rejects', async () => {
    const error = new Error('Test error')
    const fn = jest.fn().mockRejectedValue(error)
    const wrapped = catchAsync(fn)

    const req = {}
    const res = {}
    const next = jest.fn()

    await wrapped(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })
})

describe('badroutes', () => {
  test('should call next with AppError', () => {
    const req = { originalUrl: '/test/url' }
    const res = {}
    const next = jest.fn()

    badroutes(req, res, next)

    expect(next).toHaveBeenCalled()
    const error = next.mock.calls[0][0]
    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe(`Can't find /test/url on this server!`)
    expect(error.statusCode).toBe(404)
  })
})

describe('errosingeneral', () => {
  test('should send response with error details when error is operational', () => {
    const err = new AppError('Operational error', 400)
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    const next = jest.fn()

    errosingeneral(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Operational error'
    })
  })

  test('should send generic error response when error is not operational', () => {
    const err = new Error('Non-operational error')
    err.name = 'TestError'
    err.value = 'invalid-value'

    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    const next = jest.fn()

    errosingeneral(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Something went wrong!',
      error: 'Non-operational error',
      errorname: 'TestError',
      errorvalue: 'invalid-value',
      reason: 'invalid value invalid-value'
    })
  })

  test('should use default status code and status when not provided', () => {
    const err = new Error('Generic error')
    err.isOperational = true

    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    const next = jest.fn()

    errosingeneral(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Generic error'
    })
  })
})

describe('handleCastErrorDb', () => {
  test('should return AppError with correct message and status code', () => {
    const err = { value: 'invalidId' }
    const appError = handleCastErrorDb(err)

    expect(appError).toBeInstanceOf(AppError)
    expect(appError.message).toBe('invalid invalidId.')
    expect(appError.statusCode).toBe(404)
  })
})

describe('sendErrorDev', () => {
  test('should send detailed error response in development', () => {
    const err = new AppError('Dev error', 400)
    err.stack = 'Error stack trace'

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    sendErrorDev(err, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      error: err,
      message: 'Dev error',
      stack: 'Error stack trace'
    })
  })
})

