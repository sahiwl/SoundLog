
export const SocialProof = () => {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            From Music Lovers Like You
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {mockReviews.map((review) => (
            <div key={review.id} className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700/50">
              <p className="text-lg text-gray-300 italic mb-6">"{review.review}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={review.avatar} alt={review.user} className="w-12 h-12 rounded-full mr-4 border-2 border-green-500" />
                  <div>
                    <p className="font-semibold text-white">{review.user}</p>
                    <p className="text-sm text-green-400">{review.handle}</p>
                  </div>
                </div>
                <img src={review.albumArt} alt="Reviewed album" className="w-14 h-14 rounded-lg shadow-md hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const mockReviews = [
  {
    id: 1,
    user: "Sarah J.",
    handle: "@sarahjams",
    avatar: "https://placehold.co/100x100/7C3AED/white?text=SJ",
    review: "This is exactly what I've been looking for. It's like Letterboxd but for my music obsession. Finally, I can log all my listens!",
    albumArt: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png"
  },
  {
    id: 2,
    user: "Mike D.",
    handle: "@mikedrops",
    avatar: "https://placehold.co/100x100/059669/white?text=MD",
    review: "Creating and sharing lists of my favorite albums has never been easier. The community is great and I'm discovering so much new music.",
    albumArt: "https://upload.wikimedia.org/wikipedia/en/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg"
  }
];
