export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial',
      }}
    >
      <h1
        style={{
          fontSize: '64px',
          marginBottom: '20px',
        }}
      >
        ♟ ChessUZ
      </h1>

      <h2>Cloudflare Pages Works!</h2>

      <p>Сайт успешно запущен.</p>
    </main>
  );
}
