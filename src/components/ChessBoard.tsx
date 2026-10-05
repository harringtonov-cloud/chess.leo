return (
  <div className="flex justify-center">
    <div className="w-full max-w-[620px] mx-auto">
      <Chessboard
        position={chess.fen()}
        onSquareClick={onSquareClick}
        onPieceDrop={onPieceDrop}
        customSquareStyles={customSquareStyles}
        boardOrientation="white"
        customBoardStyle={{
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(6,182,212,.25)',
        }}
        customDarkSquareStyle={{
          backgroundColor: '#769656',
        }}
        customLightSquareStyle={{
          backgroundColor: '#eeeed2',
        }}
        animationDuration={200}
      />
    </div>
  </div>
);
