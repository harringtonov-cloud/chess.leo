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
      {/* Верхняя панель */}
      <header className="border-b border-slate-800 backdrop-blur">
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

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-[260px_1fr] gap-6">

        {/* Левая колонка */}
        <aside className="space-y-4">
          <button className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 font-bold hover:scale-105 transition">
            Создать игру
          </button>

          <button className="w-full rounded-2xl bg-slate-800 p-4 hover:bg-slate-700 transition">
            Играть с другом
          </button>

          <button className="w-full rounded-2xl bg-orange-600 p-4 hover:bg-orange-500 transition">
            Играть с ИИ
          </button>

          <div className="bg-slate-900 rounded-2xl p-4">
            <h3 className="font-bold mb-2 text-cyan-400">
              Профиль
            </h3>

            <p>Рейтинг: 1500?</p>
            <p>Партий: 0</p>
          </div>
        </aside>

        {/* Центр */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Быстрый старт
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            {controls.map((item) => (
              <button
                key={item}
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
                {item}
              </button>
            ))}

          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-2">
                Последние новости
              </h3>
              <p className="text-slate-400">
                Скоро появятся турниры и рейтинг.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-2">
                ChessUZ AI
              </h3>
              <p className="text-slate-400">
                ИИ на базе Stockfish 17.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
