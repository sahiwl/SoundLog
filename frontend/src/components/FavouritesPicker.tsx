import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import AlbumImage from "./AlbumImage";
import { X, Plus, Search as SearchIcon } from "lucide-react";
import type { AlbumCard } from "../types/album";
import type { SpotifyImage } from "../types/spotify";

const MAX_FAVOURITES = 4;

export interface FavouriteAlbum {
  albumId: string;
  name: string;
  images?: SpotifyImage[];
  artists?: { name: string }[];
}

interface SearchPickerProps {
  onPick: (album: AlbumCard) => void;
  onClose: () => void;
  excludeIds?: string[];
}

const SearchPicker = ({
  onPick,
  onClose,
  excludeIds = [],
}: SearchPickerProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AlbumCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get<{ albums?: AlbumCard[] }>(
          "/releases/search",
          { params: { query, limit: 10 } }
        );
        setResults(res.data?.albums || []);
      } catch (err) {
        console.error("Album search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#181D23] border border-white/10 rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 p-3 border-b border-white/10">
          <SearchIcon size={18} className="text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search albums..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <p className="p-4 text-sm text-gray-400">Searching...</p>
          )}
          {!loading && query && results.length === 0 && (
            <p className="p-4 text-sm text-gray-400">No albums found.</p>
          )}
          {results.map((album) => {
            const alreadyAdded = excludeIds.includes(album.id);
            return (
              <button
                key={album.id}
                type="button"
                disabled={alreadyAdded}
                onClick={() => onPick(album)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <AlbumImage
                  src={album.images?.[0]?.url}
                  alt={album.name}
                  size={48}
                  className="w-12 h-12 rounded object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{album.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {album.artists?.map((a) => a.name).join(", ")}
                  </p>
                </div>
                {alreadyAdded && (
                  <span className="ml-auto text-xs text-gray-500">added</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface FavouritesPickerProps {
  value?: FavouriteAlbum[];
  onChange: (albums: FavouriteAlbum[]) => void;
}

const FavouritesPicker = ({
  value = [],
  onChange,
}: FavouritesPickerProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handlePick = (album: AlbumCard) => {
    const next: FavouriteAlbum[] = [
      ...value,
      {
        albumId: album.id,
        name: album.name,
        images: album.images,
        artists: album.artists?.map((a) => ({ name: a.name })),
      },
    ].slice(0, MAX_FAVOURITES);
    onChange(next);
    setPickerOpen(false);
  };

  const removeAt = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const slots = Array.from({ length: MAX_FAVOURITES });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-gray-300 text-sm">
          Favourite Albums ({value.length}/{MAX_FAVOURITES})
        </label>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {slots.map((_, i) => {
          const album = value[i];
          if (album) {
            return (
              <div key={album.albumId} className="relative group">
                <AlbumImage
                  src={album.images?.[0]?.url}
                  alt={album.name}
                  size={200}
                  className="w-full aspect-square rounded object-cover ring-1 ring-white/10"
                />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-black/80 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  aria-label="Remove"
                >
                  <X size={12} />
                </button>
                <p className="mt-1 text-[11px] text-gray-300 truncate">
                  {album.name}
                </p>
              </div>
            );
          }
          return (
            <button
              key={`slot-${i}`}
              type="button"
              onClick={() => setPickerOpen(true)}
              className="aspect-square rounded border border-dashed border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <Plus size={20} />
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Pick up to 4 albums that define your taste.
      </p>

      {pickerOpen && (
        <SearchPicker
          onPick={handlePick}
          onClose={() => setPickerOpen(false)}
          excludeIds={value.map((a) => a.albumId)}
        />
      )}
    </div>
  );
};

export default FavouritesPicker;
