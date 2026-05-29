const LoadingScreen = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background text-white relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-30"
                    style={{ background: "radial-gradient(circle, #6E59A5 0%, transparent 70%)" }} />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-30"
                    style={{ background: "radial-gradient(circle, #1EAEDB 0%, transparent 70%)" }} />
            </div>

            <div className="relative z-10 text-center px-6">
                <div className="text-3xl font-semibold tracking-wide">SoundLog</div>
                <div className="mt-3 text-sm text-gray-300">Server is booting up...</div>
                <div className="mt-6 flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse [animation-delay:300ms]" />
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;