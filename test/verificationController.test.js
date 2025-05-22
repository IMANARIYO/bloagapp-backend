import { jest } from "@jest/globals";

let verifyEmail, prisma, catchAsync, isOTPValid;

// Mock the catchAsync middleware
await jest.unstable_mockModule(
    "../src/middlewares/globaleerorshandling.js",
    // C:\Users\B Sostene\Desktop\bloagapp-backend\src\middlewares
  () => ({
    catchAsync: jest.fn((fn) => fn), // Simple mock that just returns the function
  })
);

// Mock the password functions
await jest.unstable_mockModule("../src/utils/passwordfunctions.js", () => ({
  isOTPValid: jest.fn(),
}));

await jest.unstable_mockModule("../prisma/client.js", () => ({
  default: {
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

beforeAll(async () => {
  prisma = (await import("../prisma/client.js")).default;
  ({ catchAsync } = await import("../src/middlewares/globaleerorshandling.js"));
  ({ isOTPValid } = await import("../src/utils/passwordfunctions.js"));
  ({ verifyEmail } = await import(
    "../src/authentication/verificationcontroller.js"
  )); // Update this path
});
//C:\Users\B Sostene\Desktop\bloagapp-backend\src\authentication\verificationcontroller.js

describe("Email Verification Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe("verifyEmail", () => {
    test("should return 400 when token is not provided", async () => {
      req.query = {};

      await verifyEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Token is required for email verification.",
      });
    });

    test("should return 400 when token is empty string", async () => {
      req.query = { token: "" };

      await verifyEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Token is required for email verification.",
      });
    });

    test("should return 404 when user with token not found", async () => {
      req.query = { token: "invalid-token-123" };

      prisma.user.findFirst.mockResolvedValue(null);

      await verifyEmail(req, res, next);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { otp: "invalid-token-123" },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid token. User not found.",
      });
    });

    test("should verify email successfully with valid OTP", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        otp: "valid-otp-123",
        otpExpiresAt: new Date("2025-05-23T10:00:00Z"),
        verified: false,
      };

      req.query = { token: "valid-otp-123" };

      prisma.user.findFirst.mockResolvedValue(mockUser);
      isOTPValid.mockReturnValue(true);
      prisma.user.update.mockResolvedValue({
        ...mockUser,
        verified: true,
        otp: null,
        otpExpiresAt: null,
      });

      await verifyEmail(req, res, next);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { otp: "valid-otp-123" },
      });
      expect(isOTPValid).toHaveBeenCalledWith(
        "valid-otp-123",
        "valid-otp-123",
        mockUser.otpExpiresAt,
        res
      );
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          verified: true,
          otp: null,
          otpExpiresAt: null,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email verification successful. You can now login.",
      });
    });

    test("should return 400 when OTP is invalid", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        otp: "expired-otp-123",
        otpExpiresAt: new Date("2025-05-20T10:00:00Z"), // Past date
        verified: false,
      };

      req.query = { token: "expired-otp-123" };

      prisma.user.findFirst.mockResolvedValue(mockUser);
      isOTPValid.mockReturnValue(false);

      await verifyEmail(req, res, next);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { otp: "expired-otp-123" },
      });
      expect(isOTPValid).toHaveBeenCalledWith(
        "expired-otp-123",
        "expired-otp-123",
        mockUser.otpExpiresAt,
        res
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired OTP.",
      });
    });

    test("should return 400 when OTP is expired", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        otp: "valid-format-but-expired",
        otpExpiresAt: new Date("2025-05-20T10:00:00Z"), // Past date
        verified: false,
      };

      req.query = { token: "valid-format-but-expired" };

      prisma.user.findFirst.mockResolvedValue(mockUser);
      isOTPValid.mockReturnValue(false); // OTP validation failed due to expiration

      await verifyEmail(req, res, next);

      expect(isOTPValid).toHaveBeenCalledWith(
        "valid-format-but-expired",
        "valid-format-but-expired",
        mockUser.otpExpiresAt,
        res
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired OTP.",
      });
    });

    test("should handle different token formats", async () => {
      const testTokens = [
        "ABC123",
        "123456",
        "token-with-dashes",
        "token_with_underscores",
        "VeryLongTokenString123456789",
      ];

      for (const token of testTokens) {
        jest.clearAllMocks();

        const mockUser = {
          id: 1,
          email: "test@example.com",
          otp: token,
          otpExpiresAt: new Date("2025-05-23T10:00:00Z"),
          verified: false,
        };

        req.query = { token };

        prisma.user.findFirst.mockResolvedValue(mockUser);
        isOTPValid.mockReturnValue(true);
        prisma.user.update.mockResolvedValue({
          ...mockUser,
          verified: true,
          otp: null,
          otpExpiresAt: null,
        });

        await verifyEmail(req, res, next);

        expect(prisma.user.findFirst).toHaveBeenCalledWith({
          where: { otp: token },
        });
        expect(isOTPValid).toHaveBeenCalledWith(
          token,
          token,
          mockUser.otpExpiresAt,
          res
        );
      }
    });

    test("should handle already verified user attempting to verify again", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        otp: "valid-otp-123",
        otpExpiresAt: new Date("2025-05-23T10:00:00Z"),
        verified: true, // Already verified
      };

      req.query = { token: "valid-otp-123" };

      prisma.user.findFirst.mockResolvedValue(mockUser);
      isOTPValid.mockReturnValue(true);
      prisma.user.update.mockResolvedValue({
        ...mockUser,
        otp: null,
        otpExpiresAt: null,
      });

      await verifyEmail(req, res, next);

      // Should still proceed with verification process
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          verified: true,
          otp: null,
          otpExpiresAt: null,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should handle database error during user lookup", async () => {
      req.query = { token: "valid-token" };

      prisma.user.findFirst.mockRejectedValue(
        new Error("Database connection error")
      );

      // Since catchAsync is mocked to just return the function,
      // we expect the error to be thrown and not handled in this test
      await expect(verifyEmail(req, res, next)).rejects.toThrow(
        "Database connection error"
      );
    });

    test("should handle database error during user update", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        otp: "valid-otp-123",
        otpExpiresAt: new Date("2025-05-23T10:00:00Z"),
        verified: false,
      };

      req.query = { token: "valid-otp-123" };

      prisma.user.findFirst.mockResolvedValue(mockUser);
      isOTPValid.mockReturnValue(true);
      prisma.user.update.mockRejectedValue(new Error("Update failed"));

      // Since catchAsync is mocked to just return the function,
      // we expect the error to be thrown and not handled in this test
      await expect(verifyEmail(req, res, next)).rejects.toThrow(
        "Update failed"
      );
    });

    test("should not call update when isOTPValid returns non-boolean falsy value", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        otp: "some-otp",
        otpExpiresAt: new Date("2025-05-23T10:00:00Z"),
        verified: false,
      };

      req.query = { token: "some-otp" };

      prisma.user.findFirst.mockResolvedValue(mockUser);
      isOTPValid.mockReturnValue(null); // Falsy but not boolean false

      await verifyEmail(req, res, next);

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired OTP.",
      });
    });
  });
});
