import axios from 'axios';
import { spotifyAuthConfig } from './spotify-config';

const getSpotifyToken = async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(
          `${spotifyAuthConfig.clientId}:${spotifyAuthConfig.clientSecret}`
        )}`,
      },
    }
  );
  return response.data.access_token;
};

export const getPlaylistTracks = async (playlistId: string) => {
  const token = await getSpotifyToken();
  const response = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.items;
};
