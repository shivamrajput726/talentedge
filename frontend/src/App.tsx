import { useState } from 'react';

const Navbar = () => (
  <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
    <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
      TalentEdge
    </div>
    <div className="flex gap-8 text-sm font-medium text-gray-400">
      <a href="#" className="hover:text-white transition-colors">Analyzer</a>
      <a href="#" className="hover:text-white transition-colors">Portfolio</a>
      <a href="#" className="hover:text-white transition-colors">Resources</a>
    </div>
    <button className="glow-button px-6 py-2 rounded-full text-sm font-bold">
      Contact Me
    </button>
  </nav>
);

const Hero = () => {
  const [repoUrl, setRepoUrl] = useState('');

  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-12 px-6 text-center">
      <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-indigo-400 uppercase glass-card">
        AI-Powered Capability Mapping
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
        Your GitHub, <br />
        <span className="text-indigo-500">Intelligently Decoded.</span>
      </h1>
      <p className="max-w-2xl text-lg text-gray-400 mb-10">
        Stop telling recruiters what you can do. Show them with AI-driven analysis
        of your repositories, skill heatmaps, and technical depth scores.
      </p>

      <div className="w-full max-w-lg relative group">
        <input
          type="text"
          placeholder="Paste repository URL (e.g. github.com/user/repo)"
          className="w-full px-6 py-4 rounded-2xl glass-card outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm pr-32"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <button className="absolute right-2 top-2 bottom-2 glow-button px-6 rounded-xl text-sm font-bold">
          Analyze
        </button>
      </div>
    </div>
  );
};

const SkillCard = ({ title, score, icon }: { title: string, score: number, icon: string }) => (
  <div className="glass-card p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
        {icon}
      </div>
      <div className="text-xl font-bold">{score}%</div>
    </div>
    <div>
      <h3 className="font-semibold text-gray-200">{title}</h3>
      <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
        <div
          className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Hero />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 pb-20 mt-12">
          <SkillCard title="Backend Systems" score={94} icon="⚡" />
          <SkillCard title="Frontend Architecture" score={88} icon="🎨" />
          <SkillCard title="AI / ML Integration" score={82} icon="🤖" />
          <SkillCard title="DevOps & Cloud" score={91} icon="☁️" />
        </div>

        <div className="px-6 pb-24">
          <div className="glass-card p-8 md:p-12 border-indigo-500/20">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">The Recruiter's Edge</h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  "TalentEdge doesn't just list technologies; it provides a direct window into
                  an engineer's problem-solving patterns and technical evolution."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
                  <div>
                    <div className="font-bold">Sarah Chen</div>
                    <div className="text-xs text-gray-500 uppercase">Lead Technical Recruiter @ Anthropic</div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 aspect-video bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl border border-white/5 flex items-center justify-center">
                <div className="text-5xl opacity-20 font-bold italic">Analytics Visualization</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-12 text-center text-sm text-gray-500 border-t border-white/5">
        &copy; 2026 TalentEdge. Built for the future of technical hiring.
      </footer>
    </div>
  );
}

export default App;
