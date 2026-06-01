import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <a
          href="/"
          className="text-xl font-bold tracking-tighter text-white"
        >
          Sound<span className="text-soundlog-purple">Log</span>
        </a>

        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} SoundLog · Made by{" "}
          <a
            href="https://github.com/sahiwl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Sahil
          </a>
        </p>

        <div className="flex items-center gap-4 text-zinc-400">
          <a
            href="https://linkedin.com/in/sahilkr04"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-white transition-colors"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://github.com/sahiwl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-white transition-colors"
          >
            <Github size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
