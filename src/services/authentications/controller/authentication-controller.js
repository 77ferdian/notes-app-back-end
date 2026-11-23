import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserRepositories from '../../users/repositories/user-repositories.js';
import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import { AuthenticationError, InvariantError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.validated;

    const user = await UserRepositories.getUserByUsername(username);
    if (!user) {
      return next(new AuthenticationError('Kredensial yang Anda berikan salah'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AuthenticationError('Kredensial yang Anda berikan salah'));
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_KEY,
    );

    await AuthenticationRepositories.addRefreshToken(refreshToken);

    return response(res, 201, 'Authentication berhasil ditambahkan', {
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.validated;

    const isTokenValid = await AuthenticationRepositories.verifyRefreshToken(token);
    if (!isTokenValid) {
      return next(new InvariantError('Refresh token tidak valid'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    } catch {
      return next(new InvariantError('Refresh token tidak valid'));
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: '15m' },
    );

    return response(res, 200, 'Access Token berhasil diperbarui', { accessToken });
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.validated;

    const isTokenValid = await AuthenticationRepositories.verifyRefreshToken(token);
    if (!isTokenValid) {
      return next(new InvariantError('Refresh token tidak valid'));
    }

    await AuthenticationRepositories.deleteRefreshToken(token);

    return response(res, 200, 'Refresh token berhasil dihapus', null);
  } catch (err) {
    return next(err);
  }
};
