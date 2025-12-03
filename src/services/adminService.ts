import appClient,
  { listUsers as clientListUsers,
    getUser as clientGetUser,
    createUser as clientCreateUser,
    updateUser as clientUpdateUser,
    deleteUser as clientDeleteUser,
    listAdminArtists as clientListAdminArtists,
    listAdminBuyers as clientListAdminBuyers,
  } from '@/lib/appClient';

// Lightweight wrapper for admin functions with a small fallback
export async function listUsers(params?: Record<string, any>) {
  try {
    return await clientListUsers(params);
  } catch (err: any) {
    // If backend doesn't expose admin users but caller asked for artists, fallback to public artists
    if (params?.role === 'artist') {
      try {
        return await clientListAdminArtists(params);
      } catch (e) {
        // rethrow original
      }
    }
    throw err;
  }
}

export async function getUser(id: number) {
  return clientGetUser(id);
}

export async function createUser(payload: any) {
  return clientCreateUser(payload);
}

export async function updateUser(id: number, payload: any) {
  return clientUpdateUser(id, payload);
}

export async function deleteUser(id: number) {
  return clientDeleteUser(id);
}

export async function listArtists(params?: Record<string, any>) {
  try {
    return await clientListAdminArtists(params);
  } catch (err) {
    // bubble up
    throw err;
  }
}

export async function listBuyers(params?: Record<string, any>) {
  return clientListAdminBuyers(params);
}
