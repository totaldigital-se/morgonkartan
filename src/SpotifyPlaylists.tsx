import { useState, useEffect } from 'react';
import './SpotifyPlaylists.css';
import { getPlaylistTracks } from './spotify-api';

const SpotifyPlaylists = () => {
  const [lastTrack, setLastTrack] = useState<string | null>(null);
  const playlistId = '74uiwlvKO6lelIaVMWQtZh';

  useEffect(() => {
    const fetchLastTrack = async () => {
      try {
        const tracks = await getPlaylistTracks(playlistId);
        if (tracks.length > 0) {
          const lastTrackId = tracks[tracks.length - 1].track.id;
          setLastTrack(lastTrackId);
        }
      } catch (error) {
        console.error('Error fetching playlist tracks:', error);
      }
    };

    fetchLastTrack();
  }, [playlistId]);

  return (
    <div className="spotify-container">
      <iframe
        className="spotify-iframe"
        src={`https://open.spotify.com/embed/playlist/${playlistId}`}
        width="100%"
        height="280"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      {lastTrack ? (
        <iframe
          className="spotify-iframe"
          src={`https://open.spotify.com/embed/track/${lastTrack}`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      ) : (
        <p>Loading last track...</p>
      )}
    </div>
  );
};

export default SpotifyPlaylists;
