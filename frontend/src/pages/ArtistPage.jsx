import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../lib/axios.js"

// Sample albums data for demonstration
const sampleAlbums = [
  { id: 1, title: "Whole Lotta Red", year: "2020", criticScore: 75, userScore: 82, image: "/placeholder.svg" },
  { id: 2, title: "Die Lit", year: "2018", criticScore: 79, userScore: 84, image: "/placeholder.svg" },
  { id: 3, title: "Playboi Carti", year: "2017", criticScore: 72, userScore: 80, image: "/placeholder.svg" },
]

const ArtistPage = () => {
  const { artistId } = useParams()
  const [artistData, setArtistData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [albums, setAlbums] = useState(sampleAlbums)

  const fetchArtistDetails = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await axiosInstance.get(`/pages/artists/${artistId}`, {
        withCredentials: true,
      })
      if (response.data && response.data.artist) {
        setArtistData(response.data.artist)
      } else {
        setError("Invalid response format")
      }
    } catch (err) {
      console.error("Error fetching artist:", err)
      setError(err.response?.data?.message || "Error fetching artist details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (artistId) fetchArtistDetails()
  }, [artistId])

  if (loading) return <p className="text-white">Loading artist details...</p>
  if (error) return <p className="text-white">{error}</p>
  if (!artistData) return <p className="text-white">No artist data found.</p>

  return (
    <div className="bg-neutral-900 pt-16 md:pt-28 text-white min-h-screen min-w-screen px-4 md:px-8">
      {/* Artist Name at top */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{artistData.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-6 md:gap-8">
          {/* Left Column - Artist Image */}
          <div className="flex justify-center md:block">
            <img
              src={artistData.images?.[0]?.url || "/placeholder.svg"}
              alt={artistData.name}
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full"
            />
          </div>

          {/* Right Column - Artist Details */}
          <div className="space-y-4 md:space-y-6">
            {/* Scores Section */}
            <div className="bg-grids p-4 md:p-6 rounded-md">
              <div className="mb-4 md:mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase mb-2">CRITIC SCORE</h2>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                  <span className="text-4xl md:text-5xl font-bold">71</span>
                  <span className="text-sm text-gray-400">Based on 228 reviews</span>
                </div>
                <div className="h-1 bg-green-500 w-1/3 mt-2"></div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase mb-2">USER SCORE</h2>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                  <span className="text-4xl md:text-5xl font-bold">78</span>
                  <span className="text-sm text-gray-400">
                    Based on {artistData.followers?.total?.toLocaleString()} ratings
                  </span>
                </div>
                <div className="h-1 bg-green-500 w-1/3 mt-2"></div>
              </div>
            </div>

            {/* Follow Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* <button className="w-full sm:w-auto px-6 py-2 border border-white hover:bg-white hover:text-black transition-colors uppercase font-medium">
                FOLLOW
              </button> */}
              <span className="text-gray-400">{artistData.followers?.total?.toLocaleString()} Followers (Spotify)</span>
            </div>

            {/* Details Section */}
            <div className="bg-grids p-4 md:p-6 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">DETAILS</h2>
                {/* <button className="text-sm md:text-base text-gray-400 hover:text-white">SUBMIT CORRECTION</button> */}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white break-words">{artistData.name}</p>
                  <p className="text-gray-400 text-sm">/ also known as</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    {artistData.genres?.map((genre) => (
                      <span key={genre} className="text-white capitalize">
                        {genre}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">/ genre</p>
                </div>

                <div>
                  <a 
                    href={artistData.external_urls?.spotify} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline break-words"
                  >
                    {artistData.external_urls?.spotify?.replace("https://", "")}
                  </a>
                  <p className="text-gray-400 text-sm">/ website</p>
                </div>

                <div>
                  <p className="text-gray-400 mb-2">tags</p>
                  <div className="flex flex-wrap gap-2">
                    {artistData.genres?.map((genre) => (
                      <span key={genre} className="px-3 py-1 bg-[#333] rounded-full text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;

