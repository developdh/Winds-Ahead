export default function LoadingScene() {
  return (
    <div className="loading-scene" role="status" aria-live="polite">
      <div className="loading-emblem" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>鏡</span>
      </div>
      <p className="loading-wordmark">WINDS AHEAD</p>
      <p className="loading-caption">
        Following the wind <span>·</span> 바람을 따라가는 중
      </p>
      <div className="loading-line" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
