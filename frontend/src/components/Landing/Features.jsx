
import React from 'react';
import { Star, FileText, Clock, Music } from "lucide-react";

const Feature = ({ title, description, icon }) => {
  return (
    <div className="feature-card bg-grids">
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-20 bg-zi-900">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Key Features
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Everything you need to track, rate, and discover your next favorite album.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature
            title="Rate Your Music"
            description="Add numeric ratings from 0-100 to tracks and albums you've listened to."
            icon={<Star size={24} />}
          />
          <Feature
            title="Write Reviews"
            description="Share your thoughts with short, meaningful reviews of albums."
            icon={<FileText size={24} />}
          />
          <Feature
            title="Listen Later"
            description="Save albums and tracks to revisit when you have more time."
            icon={<Clock size={24} />}
          />
          <Feature
            title="New Releases"
            description="Stay updated with the latest albums from your favorite artists."
            icon={<Music size={24} />}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
