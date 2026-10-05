return (
  <div className="flex justify-center">
    <div className="w-full max-w-[650px]">
      <Chessboard
        position={chess.fen()}
        onSquareClick={onSquareClick}
        onPieceDrop={onPieceDrop}
        customSquareStyles={customSquareStyles}
        boardOrientation="white"
        customBoardStyle={{
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
        customDarkSquareStyle={{
          backgroundColor: '#B58863',
        }}
        customLightSquareStyle={{
          backgroundColor: '#F0D9B5',
        }}
        animationDuration={200}
      />
    </div>
  </div>
);
