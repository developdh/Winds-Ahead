"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="page not-found">
    <p className="eyebrow">WINDS AHEAD</p>
    <h1>잠시 불러오지 못했어요<br />This page could not load</h1>
    <p className="intro">다시 시도하거나 도감으로 돌아갈 수 있어요.<br />Try again or return to the archive.</p>
    <div className="button-row">
      <button className="primary-button" onClick={reset}>다시 시도 · Try again</button>
      <a className="outline-button" href="/">도감으로 · Open archive</a>
    </div>
  </main>;
}
