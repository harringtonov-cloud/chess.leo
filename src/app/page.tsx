'use client';

export default function Home() {
  const controls = [
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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
      <header className="border-b border-slate-800 bg-black/40 backdrop-blur">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
          <h1 className="text-3xl font-bold text-cyan-400">
            ♟ ChessUZ
          </h1>

          <nav className="hidden md:flex gap-8 text-slate-300">
            <button className="hover:text-cyan-400">Играть</button>
            <button className="hover:text-cyan-400">Турниры</button>
            <button className="hover:text-cyan-400">Обучение</button>
            <button className="hover:text-cyan-400">Рейтинг</button>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-[280px_1fr] gap-6">

        <aside className="space-y-4">
          <button className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 font-bold hover:scale-105 transition">
            Создать игру
          </button>

          <button className="w-full rounded-2xl bg-slate-800 p-4 hover:bg-slate-700 transition">
            Играть с другом
          </button>

          <button className="w-full rounded-2xl bg-orange-500 p-4 hover:bg-orange-400 transition">
            Играть с ИИ
          </button>

          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700">
            <h3 className="font-bold text-cyan-400 mb-2">
              Профиль
            </h3>

            <div>Рейтинг: 1500?</div>
            <div>Партий: 0</div>
            <div>Побед: 0</div>
            <div>Поражений: 0</div>
          </div>
        </aside>

        <section>
          <h2 className="text-2xl font-bold mb-6">
            Быстрый старт
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            {controls.map((control) => (
              <button
                key={control}
                className="
                  h-32
                  rounded-3xl
                  bg-slate-800
                  hover:bg-slate-700
                  hover:scale-105
                  transition
                  text-4xl
                  font-bold
                "
              >
                {control}
              </button>
            ))}

          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">

            <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
              <h3 className="text-xl text-cyan-400 font-bold mb-2">
                ChessUZ AI
              </h3>

              <p className="text-slate-400">
                Скоро будет подключён Stockfish 17.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
              <h3 className="text-xl text-cyan-400 font-bold mb-2">
                Турниры
              </h3>

              <p className="text-slate-400">
                Скоро будут доступны онлайн-турниры.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
