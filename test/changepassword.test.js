import { jest } from '@jest/globals';

let changepassword, prisma, passComparer, passHashing;

await jest.unstable_mockModule('../prisma/client.js', () => ({
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}));

await jest.unstable_mockModule('../src/utils/passwordfunctions.js', () => ({
  passComparer: jest.fn(),
  passHashing: jest.fn()
}));

beforeAll(async () => {
  prisma = (await import('../prisma/client.js')).default;
  ({ changepassword } = await import('../src/authentication/changepassword.js'));
  ({ passComparer, passHashing } = await import('../src/utils/passwordfunctions.js'));
});

describe('Change Password Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        currentpassword: 'oldPassword123',
        newpassword: 'newPassword456'
      },
      user: {
        id: 1
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('should return 404 if user is not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await changepassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('should return 401 if current password is incorrect', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      password: 'hashedPassword'
    });

    passComparer.mockResolvedValue(false);

    await changepassword(req, res);

    expect(passComparer).toHaveBeenCalledWith('oldPassword123', 'hashedPassword');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'The current password is wrong' });
  });

  test('should update password if current password is correct', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      password: 'hashedPassword'
    });

    passComparer.mockResolvedValue(true);
    passHashing.mockResolvedValue('newHashedPassword');

    await changepassword(req, res);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { password: 'newHashedPassword' }
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
  });

  test('should handle unexpected errors', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('DB error'));

    await changepassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
  });
});
