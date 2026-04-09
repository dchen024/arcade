import { Bird, Blocks, Gamepad2, GitCommit, Grid3x3, Play, Trophy, Users } from 'lucide-react';

const games = [
  {
    id: 'tictactoe',
    path: '/tictactoe',
    title: 'Tic-Tac-Toe',
    description: 'The classic X and O showdown. Challenge a friend or beat the CPU!',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500',
    glowColor: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]',
    bgGradient: 'from-cyan-950/40 to-slate-900',
    icon: Grid3x3,
    players: '1-2 Players',
    highscore: 'Win Streak: 5'
  },
  {
    id: 'tetris',
    path: '/tetris',
    title: 'Tetris',
    description: 'Clear the lines before the blocks stack up. A puzzle legend.',
    color: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500',
    glowColor: 'group-hover:shadow-[0_0_30px_rgba(217,70,239,0.5)]',
    bgGradient: 'from-fuchsia-950/40 to-slate-900',
    icon: Blocks,
    players: '1 Player',
    highscore: 'Score: 14,200'
  },
  {
    id: 'snake',
    path: '/snake',
    title: 'Snake',
    description: 'Eat the apples, grow longer, but never bite your own tail!',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    glowColor: 'group-hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]',
    bgGradient: 'from-emerald-950/40 to-slate-900',
    icon: GitCommit,
    players: '1 Player',
    highscore: 'Score: 245'
  },
  {
    id: 'flappybird',
    path: '/flappybird',
    title: 'Flappy Bird',
    description: 'Tap to flap. Navigate through the pipes. Sounds easy, right?',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500',
    glowColor: 'group-hover:shadow-[0_0_30px_rgba(250,204,21,0.5)]',
    bgGradient: 'from-yellow-950/40 to-slate-900',
    icon: Bird,
    players: '1 Player',
    highscore: 'Score: 89'
  }
];

export function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans relative overflow-hidden flex flex-col">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}>
      </div>

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03]"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 3px 100%'
        }}>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col max-w-6xl mx-auto w-full p-6 sm:p-12">

        {/* Header */}
        <header className="flex flex-col items-center mb-16 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-900 border border-slate-700 shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-4">
            <Gamepad2 className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            NEON ARCADE
          </h1>
          <p className="text-slate-400 max-w-lg text-lg">
            Insert coin to continue. Select a classic game to start playing.
          </p>
        </header>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {games.map((game) => (
            <a
              key={game.id}
              href={game.path}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block text-left bg-gradient-to-br ${game.bgGradient} p-6 sm:p-8 rounded-2xl border-2 border-slate-800 hover:${game.borderColor} transition-all duration-300 ${game.glowColor} overflow-hidden`}
            >
              {/* Background Glow Effect inside card */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500"></div>

              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  <game.icon className={`w-12 h-12 mb-4 ${game.color} drop-shadow-[0_0_8px_currentColor]`} />
                  <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">{game.title}</h2>
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed max-w-xs">
                    {game.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{game.players}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-4 h-4" />
                      <span>{game.highscore}</span>
                    </div>
                  </div>
                </div>

                <div className={`w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center bg-slate-900 group-hover:scale-110 group-hover:bg-slate-800 transition-all duration-300`}>
                  <Play className={`w-5 h-5 ${game.color} ml-1`} fill="currentColor" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}