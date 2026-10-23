// Vanilla port of the portal's AnimatedGridPattern background: a 40px grid
// where random cells fade in and out, then move elsewhere.
const SIZE = 40;
const SQUARES = 35;
const MAX_OPACITY = 0.15;
const DURATION = 3; // seconds per fade direction
const REPEAT_DELAY = 1;

export function mountGrid(svg) {
  if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = svg.querySelector("[data-squares]");
  const place = (rect) => {
    const { width, height } = svg.getBoundingClientRect();
    rect.setAttribute("x", String(Math.floor((Math.random() * width) / SIZE) * SIZE + 1));
    rect.setAttribute("y", String(Math.floor((Math.random() * height) / SIZE) * SIZE + 1));
  };
  for (let i = 0; i < SQUARES; i++) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", String(SIZE - 1));
    rect.setAttribute("height", String(SIZE - 1));
    rect.setAttribute("fill", "currentColor");
    rect.style.opacity = "0";
    place(rect);
    layer.appendChild(rect);
    const cycle = (DURATION * 2 + REPEAT_DELAY) * 1000;
    const animate = () => {
      const animation = rect.animate(
        [
          { opacity: 0 },
          { opacity: MAX_OPACITY, offset: DURATION / (DURATION * 2 + REPEAT_DELAY) },
          { opacity: MAX_OPACITY, offset: (DURATION + REPEAT_DELAY) / (DURATION * 2 + REPEAT_DELAY) },
          { opacity: 0 },
        ],
        { duration: cycle, delay: i * 100, easing: "ease-in-out" },
      );
      animation.onfinish = () => {
        place(rect);
        animate();
      };
    };
    animate();
  }
}
