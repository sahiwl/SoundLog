const Features = () => {
  
const RatingStar = ({ filled }) => (
  <svg className={`w-7 h-7 ${filled ? 'text-green-500' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
  return (
    <section className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 space-y-24">

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Log, rate, and review.</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Keep a diary of your music listening. Rate albums on a five-star scale, write detailed reviews, and log the dates you listen. Never forget an album again.
            </p>
          </div>

          <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700/50 transform transition-transform duration-300 hover:scale-105 hover:shadow-purple-500/20">
            <div className="flex items-center space-x-5">
              <img src="https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a" alt="Album Art: SOUR by Olivia Rodrigo" className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg shadow-md shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold">SOUR</h3>
                <p className="text-lg text-gray-400 mb-3">Olivia Rodrigo</p>
                <div className="flex items-center space-x-1">
                  <RatingStar filled={true} />
                  <RatingStar filled={true} />
                  <RatingStar filled={true} />
                  <RatingStar filled={true} />
                  <RatingStar filled={false} />
                </div>
              </div>
            </div>
            <textarea 
              className="w-full bg-gray-700 rounded-lg p-3 mt-6 text-sm text-gray-300 placeholder-gray-500"
              rows="2"
              placeholder="Add your review..."
              defaultValue="A true modern classic. The songwriting is just next-level."
            />
            <button className="mt-4 w-full bg-green-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors shadow-lg">
              Save Review
            </button>
          </div>
        </div>


        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="text-center md:text-left md:order-last">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Curate beautiful lists.</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Compile and share lists of albums for any occasion. Your all-time favorites, the best of 2025, or the perfect soundtrack for a rainy day.
            </p>
          </div>
 
          <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700/50 transform transition-transform duration-300 hover:scale-105 hover:shadow-green-500/20">
            <h3 className="text-xl sm:text-2xl font-semibold mb-5">My life is a movie</h3>
            <div className="flex items-center -space-x-5">
              <img src="https://realgroovy-media.s3.ap-southeast-2.amazonaws.com/product/194399969915/194399969915.jpg" alt="The Melodic Blue" className="w-20 h-20 rounded-full object-cover border-4 border-gray-800 shadow-lg" />
              <img src="https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" alt="Abbey Road cover" className="w-20 h-20 rounded-full object-cover border-4 border-gray-800 shadow-lg" />
              <img src="https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a" alt="SOUR album cover" className="w-20 h-20 rounded-full object-cover border-4 border-gray-800 shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG563E6p5rw9Qg98N8M53jGTyu2tiAj9oHQA&s" alt="Back in Black cover" className="w-20 h-20 rounded-full object-cover border-4 border-gray-800 shadow-lg" />
            </div>
            <p className="text-sm text-gray-400 mt-5 italic">+ many more trending albums</p>
            <button className="mt-5 w-full bg-gray-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors">
              See the full list
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;