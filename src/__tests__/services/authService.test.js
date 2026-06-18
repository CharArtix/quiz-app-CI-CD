/**
 * Test untuk services/authService.js
 */
import axios from 'axios';
import { loginWithGoogle } from '../../services/authService';

jest.mock('axios');

const API_URL = 'http://localhost:3000';

describe('authService - loginWithGoogle', () => {
  const mockUser = {
    googleId: 'gid-123',
    name: 'Andi',
    email: 'andi@gmail.com',
    picture: 'https://example.com/photo.jpg',
  };

  beforeEach(() => jest.clearAllMocks());

  it('harus POST ke /api/auth/google dengan credential', async () => {
    axios.post.mockResolvedValueOnce({ data: { user: mockUser } });
    const result = await loginWithGoogle('test-credential');
    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/api/auth/google`, {
      credential: 'test-credential',
    });
    expect(result).toEqual(mockUser);
  });

  it('harus mengembalikan data user dari response.data.user', async () => {
    axios.post.mockResolvedValueOnce({ data: { user: mockUser } });
    const result = await loginWithGoogle('any-credential');
    expect(result.googleId).toBe('gid-123');
    expect(result.name).toBe('Andi');
  });

  it('harus melempar error jika credential tidak valid', async () => {
    axios.post.mockRejectedValueOnce(new Error('Unauthorized'));
    await expect(loginWithGoogle('bad-credential')).rejects.toThrow('Unauthorized');
  });

  it('harus melempar error jika server tidak bisa dijangkau', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
    await expect(loginWithGoogle('credential')).rejects.toThrow('Network Error');
  });
});
