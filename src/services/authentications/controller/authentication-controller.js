import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import UserRepositories from '../../users/repositories/user-repositories.js';
import TokenManager from '../../../security/token-manager.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthenticationError from '../../../exceptions/authentication-error.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.validated;
    const userId = await UserRepositories.verifyUserCredential(username, password);

    if (!userId) {
      return next(new AuthenticationError('Kredensial yang Anda berikan salah'));
    }

    const accessToken = TokenManager.generateAccessToken({ id: userId });
    const refreshToken = TokenManager.generateRefreshToken({ id: userId });

    await AuthenticationRepositories.addRefreshToken(refreshToken);

    return response(res, 201, 'Authentication berhasil ditambahkan', {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.validated;

    const result = await AuthenticationRepositories.verifyRefreshToken(token);

    if (!result) {
      return next(new InvariantError('Refresh token tidak valid'));
    }

    const { id } = TokenManager.verifyRefreshToken(token);
    const accessToken = TokenManager.generateAccessToken({ id });

    return response(res, 200, 'Access Token berhasil diperbarui', { accessToken });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.validated;

    const result = await AuthenticationRepositories.verifyRefreshToken(token);

    if (!result) {
      return next(new InvariantError('Refresh token tidak valid'));
    }

    await AuthenticationRepositories.deleteRefreshToken(token);

    return response(res, 200, 'Refresh token berhasil dihapus');
  } catch (error) {
    return next(error);
  }
};
