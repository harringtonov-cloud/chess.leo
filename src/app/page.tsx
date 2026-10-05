'use client';

export default function Home() {
  const timeControls = [
    '1+0',
    '2+1',
    '3+0',
    '3+2',
    '5+0',
    '5+3',
    '10+0',
    '10+5',
    '15+10',
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <header className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
          <h1 className="text-3xl font-bold text-cyan-400">
            ♟ ChessUZ
          </h1>

          <nav className="flex gap-6 text-slate-300">
            #Играть</a>
            #Турниры</a>
            <aбучение</a>
            #Рейтинг</a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[250px_1fr] gap-6 p-6">
        <aside className="space-y-3">
          <button className="w-full p-4 rounded-xl bg-emerald-600 hover:bg-emerald-500">
            Создать игру
          </button>

          <button className="w-full p-4 rounded-xl bg-cyan-600 hover:bg-cyan-500">
            Играть с другом
          </button>

          <button className="w-full p-4 rounded-xl bg-orange-600 hover:bg-orange-500">
            Играть с ИИ
          </button>
        </aside>

        <section>
          <h2 className="text-xl mb-4 font-bold">
            Быстрый старт
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {timeControls.map((item) => (
              <button
                key={item}
                className="h-32 rounded-2xl bg-slate-800 hover:bg-slate-700 transition text-4xl font-bold"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
