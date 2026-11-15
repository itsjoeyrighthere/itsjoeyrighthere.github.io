export function initHeroCharacter(signal: AbortSignal) {
  const character = document.querySelector<HTMLButtonElement>('[data-hero-character]');
  const hero = character?.closest<HTMLElement>('.hero');
  const letter = document.querySelector<HTMLElement>('[data-hero-o]');
  if (!character || !hero || !letter) return;
  const eyes = [...character.querySelectorAll<HTMLElement>('[data-eye]')];
  const dot = hero.querySelector<HTMLElement>('[data-hero-dot]');
  const salute = letter.querySelector<HTMLElement>('[data-hero-salute]');
  const hello = letter.querySelector<HTMLElement>('[data-hero-hello]');
  const trail = letter.querySelector<SVGPathElement>('[data-hero-trail]');
  const status = hero.querySelector<HTMLElement>('[data-hero-character-status]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const animations = new Set<Animation>();
  let inView = false;
  let idleBudget = 2;
  let lastLaunch = -1;
  let blinkTimer: number | undefined;
  let helloTimer: number | undefined;
  let frame = 0;
  let pointer = { x: 0, y: 0 };

  const animate = (target: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    const motion = target.animate(frames, options);
    animations.add(motion);
    void motion.finished.catch(() => {}).finally(() => animations.delete(motion));
  };
  const cancelAnimations = () => {
    animations.forEach(motion => motion.cancel());
    animations.clear();
  };
  const resetGaze = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    character.style.removeProperty('--gaze-x');
    character.style.removeProperty('--gaze-y');
  };
  const canMove = () => !signal.aborted && inView && !document.hidden && !reduced.matches;
  const blink = (single = false) => {
    if (!canMove()) return;
    cancelAnimations();
    (single ? eyes.slice(0, 1) : eyes).forEach(eye => animate(eye, [
      { transform: 'scaleY(1)', offset: 0 },
      { transform: 'scaleY(.08)', offset: .35 },
      { transform: 'scaleY(.08)', offset: .6 },
      { transform: 'scaleY(1)', offset: 1 },
    ], { duration: single ? 320 : 170, easing: 'ease-in-out' }));
  };
  const scheduleBlink = () => {
    clearTimeout(blinkTimer);
    if (!canMove() || idleBudget <= 0) return;
    blinkTimer = window.setTimeout(() => {
      if (canMove()) {
        if (!document.documentElement.hasAttribute('data-theme-transition')) {
          blink();
          idleBudget--;
        }
        scheduleBlink();
      }
    }, 4200 + Math.random() * 2600);
  };
  const pause = () => {
    clearTimeout(blinkTimer);
    clearTimeout(helloTimer);
    delete letter.dataset.greeting;
    delete letter.dataset.staticGreeting;
    if (status) status.textContent = '';
    cancelAnimations();
    resetGaze();
  };
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) scheduleBlink(); else pause();
  }, { threshold: .2 });
  observer.observe(character);

  hero.addEventListener('pointermove', event => {
    if (!canMove() || !finePointer.matches || event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!canMove() || !finePointer.matches) return;
      const box = character.getBoundingClientRect();
      const dx = pointer.x - box.left - box.width / 2;
      const dy = pointer.y - box.top - box.height / 2;
      const distance = Math.hypot(dx, dy) || 1;
      const eyeWidth = eyes[0].getBoundingClientRect().width;
      const travel = eyeWidth * .17 * Math.min(distance / (eyeWidth * 4), 1);
      character.style.setProperty('--gaze-x', `${dx / distance * travel}px`);
      character.style.setProperty('--gaze-y', `${dy / distance * travel}px`);
    });
  }, { signal, passive: true });
  hero.addEventListener('pointerenter', () => { idleBudget = 2; scheduleBlink(); }, { signal });
  hero.addEventListener('pointerleave', resetGaze, { signal });
  const flyHello = () => {
    if (!hello || !salute || !trail) return;
    delete letter.dataset.staticGreeting;
    const bounds = hero.getBoundingClientRect();
    const eye = eyes[eyes.length - 1].getBoundingClientRect();
    const leftEye = eyes[0].getBoundingClientRect();
    const letterBounds = letter.getBoundingClientRect();
    const width = hello.offsetWidth;
    const height = hello.offsetHeight;
    const gap = Math.max(8, eye.width * .25);
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(Math.max(min, max), value));
    const captionBottom = hero.querySelector('.hero-caption')?.getBoundingClientRect().bottom ?? bounds.top;
    const limits = {
      left: bounds.left + 12, right: bounds.right - width - 16,
      top: Math.max(bounds.top + 16, captionBottom + 12),
      bottom: Math.max(bounds.top + 16, captionBottom + 12, eye.top - height * .6),
    };
    const slots = [
      { x: (leftEye.left + eye.right - width) / 2, y: eye.top - height - gap },
      { x: eye.right + gap, y: eye.top - height * .7 },
      { x: leftEye.left - width - gap, y: eye.top - height - gap },
    ];
    // Never repeat the same launch zone twice; the jitter stays close to the eyes.
    const slot = lastLaunch < 0 ? Math.floor(Math.random() * slots.length)
      : (lastLaunch + 1 + Math.floor(Math.random() * (slots.length - 1))) % slots.length;
    lastLaunch = slot;
    const x = clamp(slots[slot].x + (Math.random() - .5) * Math.min(24, eye.width * .4), limits.left, limits.right);
    const y = clamp(slots[slot].y + (Math.random() - .5) * 10, limits.top, limits.bottom);
    salute.style.left = `${x - letterBounds.left}px`;
    salute.style.top = `${y - letterBounds.top}px`;
    const origin = salute.getBoundingClientRect();
    if (!canMove()) { letter.dataset.staticGreeting = 'true'; return; }
    let direction = Math.random() < .5 ? -1 : 1;
    const room = (sign: number) => sign < 0 ? origin.left - limits.left : limits.right - origin.left;
    if (room(direction) < 55) direction *= -1;
    const dx = direction * Math.max(0, Math.min(room(direction), 60 + Math.random() * Math.min(200, innerWidth * .18)));
    const dy = limits.top + Math.random() * (limits.bottom - limits.top) - origin.top;
    const c1 = { x: dx * (.15 + Math.random() * .15), y: clamp(origin.top + (Math.random() - .5) * 35, limits.top, limits.bottom) - origin.top };
    const c2 = { x: dx * (.5 + Math.random() * .25), y: clamp(origin.top + dy - 20 - Math.random() * 35, limits.top, limits.bottom) - origin.top };
    const tilt = -18 + Math.random() * 22;
    const point = (t: number) => ({
      x: 3 * (1 - t) ** 2 * t * c1.x + 3 * (1 - t) * t ** 2 * c2.x + t ** 3 * dx,
      y: 3 * (1 - t) ** 2 * t * c1.y + 3 * (1 - t) * t ** 2 * c2.y + t ** 3 * dy,
    });
    const frames: Keyframe[] = [
      { opacity: 0, transform: `translate(0px,8px) rotate(${tilt - 8}deg) scale(.65)`, offset: 0 },
      { opacity: 1, transform: `translate(0px,0px) rotate(${tilt}deg) scale(1)`, offset: .12 },
      { opacity: 1, transform: `translate(0px,0px) rotate(${tilt}deg) scale(1)`, offset: .4 },
    ];
    for (let i = 1; i <= 30; i++) {
      const t = i / 30;
      const p = point(t);
      const ahead = point(Math.min(1, t + .015));
      let tangent = Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180 / Math.PI;
      if (tangent > 90) tangent -= 180;
      if (tangent < -90) tangent += 180;
      const blend = 1 - (1 - t) ** 2;
      const angle = tilt * (1 - blend) + clamp(tangent, -38, 38) * blend;
      frames.push({ opacity: t < .7 ? 1 : (1 - t) / .3,
        transform: `translate(${p.x}px,${p.y}px) rotate(${angle}deg) scale(${1 - t * .28})`, offset: .4 + t * .6 });
    }
    // The path starts at the signature's baseline; both use the same cubic curve.
    const startX = width * .32;
    const startY = hello.offsetHeight * .8;
    trail.setAttribute('d', `M ${startX} ${startY} C ${startX + c1.x} ${startY + c1.y}, ${startX + c2.x} ${startY + c2.y}, ${startX + dx} ${startY + dy}`);
    animate(hello, frames, { duration: 1600, easing: 'linear' });
    animate(trail, [
      { strokeDashoffset: '1', opacity: 0, offset: 0 },
      { strokeDashoffset: '.95', opacity: .5, offset: .1 },
      { strokeDashoffset: '.15', opacity: .4, offset: .75 },
      { strokeDashoffset: '0', opacity: 0, offset: 1 },
    ], { delay: 680, duration: 1000, easing: 'linear' });
  };
  character.addEventListener('click', () => {
    clearTimeout(helloTimer);
    resetGaze();
    blink(true);
    if (canMove() && dot) animate(dot, [
      { transform: 'translateY(0) scale(1)' },
      { transform: 'translateY(.018em) scale(1.08,.88)', offset: .35 },
      { transform: 'translateY(-.012em) scale(.98,1.04)', offset: .7 },
      { transform: 'translateY(0) scale(1)' },
    ], { duration: 420, easing: 'ease-out' });
    letter.dataset.greeting = 'true';
    flyHello();
    if (status) status.textContent = '你好呀，保持好奇。';
    helloTimer = window.setTimeout(() => {
      delete letter.dataset.greeting;
      delete letter.dataset.staticGreeting;
      if (status) status.textContent = '';
    }, 1800);
    idleBudget = 1;
    scheduleBlink();
  }, { signal });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else scheduleBlink(); }, { signal });
  reduced.addEventListener('change', () => { pause(); if (!reduced.matches) scheduleBlink(); }, { signal });
  finePointer.addEventListener('change', resetGaze, { signal });
  window.addEventListener('resize', () => { pause(); scheduleBlink(); }, { signal, passive: true });
  signal.addEventListener('abort', () => { pause(); observer.disconnect(); }, { once: true });
}
