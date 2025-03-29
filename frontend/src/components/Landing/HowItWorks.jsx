
import React from 'react';
import { Search, ThumbsUp, Bookmark } from "lucide-react";

const Step = ({ number, title, description, icon, direction }) => {
  return (
    <div className={`flex items-center gap-8 ${direction === 'right' ? 'md:flex-row-reverse text-right' : 'md:flex-row text-left'} flex-col`}>
      <div>
        <div className="w-24 h-24 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shadow-lg">
          {icon}
        </div>
      </div>
      <div>
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-500/40 text-white flex items-center justify-center font-bold mr-3">
            {number}
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-zinc-400 max-w-md">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-back">
      <div className="section-container">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            How It Works
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Start your music journey in three simple steps
          </p>
        </div>

        <div className="space-y-20">
          <Step
            number={1}
            title="Search for an album or track"
            description="Find music from Spotify's vast catalog using our powerful search feature."
            icon={<Search size={32} />}
            direction="left"
          />
          
          <Step
            number={2}
            title="Rate or review"
            description="Share your thoughts and give a rating from 1-5 stars to help others discover great music."
            icon={<ThumbsUp size={32} />}
            direction="right"
          />
          
          <Step
            number={3}
            title="Add to Listen Later"
            description="Save albums and tracks to your personal queue to revisit when you have time."
            icon={<Bookmark size={32} />}
            direction="left"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
