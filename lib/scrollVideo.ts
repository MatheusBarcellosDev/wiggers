/**
 * Seek helper for scroll-scrubbed video.
 * Never call video.play() — only set currentTime, coalesced via rAF.
 * See PLAYBOOK-SCROLL-VIDEO.md §4.
 */
export function bindScrollVideo(el: HTMLVideoElement) {
  let targetTime = 0;
  let rafId = 0;

  const flush = () => {
    rafId = 0;
    if (!el.duration || el.seeking) return;
    const next = Math.min(Math.max(targetTime, 0), el.duration - 0.001);
    if (Math.abs(el.currentTime - next) < 0.001) return;
    el.currentTime = next;
  };

  const onSeeked = () => {
    if (Math.abs(el.currentTime - targetTime) > 0.03 && !rafId) {
      rafId = requestAnimationFrame(flush);
    }
  };

  el.addEventListener("seeked", onSeeked);

  return {
    set(progress: number) {
      if (!el.duration) return;
      targetTime = progress * el.duration;
      if (!rafId) rafId = requestAnimationFrame(flush);
    },
    reset() {
      el.pause();
      targetTime = 0;
      try {
        el.currentTime = 0;
      } catch {
        /* ignore seek before ready */
      }
    },
    destroy() {
      el.removeEventListener("seeked", onSeeked);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    },
  };
}

export type ScrollVideoSeek = ReturnType<typeof bindScrollVideo>;

/** Resolves when the video can seek reliably (readyState >= 2). */
export function whenVideoReady(el: HTMLVideoElement): Promise<void> {
  if (el.readyState >= 2 && Number.isFinite(el.duration) && el.duration > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const done = () => {
      el.removeEventListener("loadeddata", done);
      el.removeEventListener("loadedmetadata", done);
      resolve();
    };
    el.addEventListener("loadeddata", done);
    el.addEventListener("loadedmetadata", done);
  });
}
