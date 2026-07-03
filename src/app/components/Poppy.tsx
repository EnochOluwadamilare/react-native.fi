type PoppyProps = {
  className?: string;
  /** Petal/nucleus colour. Defaults to ink. */
  color?: string;
  /** Colour of the dot at the centre. Defaults to paper. */
  centerColor?: string;
};

/**
 * The signature motif of the redesign: a Marimekko-style poppy whose three
 * petals are React's orbital ellipses and whose centre is the nucleus. One
 * shape that says "Finnish print heritage" and "React Native" at once.
 */
export const Poppy = ({
  className,
  color = 'rgb(var(--ink))',
  centerColor = 'rgb(var(--paper))',
}: PoppyProps) => (
  <svg
    viewBox='0 0 100 100'
    className={className}
    aria-hidden='true'
    focusable='false'
  >
    <g transform='translate(50,50)' fill={color}>
      <ellipse rx='44' ry='17' />
      <ellipse rx='44' ry='17' transform='rotate(60)' />
      <ellipse rx='44' ry='17' transform='rotate(120)' />
      <circle r='11' />
      <circle r='6.5' fill={centerColor} />
    </g>
  </svg>
);

/**
 * A scattered field of poppies for use as a hero backdrop. `seed` lets two
 * fields differ without relying on randomness at render time.
 */
export const PoppyField = ({ className }: { className?: string }) => (
  <svg
    viewBox='0 0 400 400'
    preserveAspectRatio='xMidYMid slice'
    className={className}
    aria-hidden='true'
    focusable='false'
  >
    {[
      { x: -30, y: -30, s: 120 },
      { x: 150, y: 20, s: 150 },
      { x: 300, y: -20, s: 120 },
      { x: 40, y: 180, s: 160 },
      { x: 250, y: 220, s: 180 },
      { x: -40, y: 300, s: 130 },
    ].map((p, i) => (
      <g key={i} transform={`translate(${p.x},${p.y})`}>
        <g
          transform={`translate(${p.s / 2},${p.s / 2}) scale(${p.s / 100})`}
          fill='rgb(var(--ink))'
        >
          <g transform='translate(-50,-50)'>
            <g transform='translate(50,50)'>
              <ellipse rx='44' ry='17' />
              <ellipse rx='44' ry='17' transform='rotate(60)' />
              <ellipse rx='44' ry='17' transform='rotate(120)' />
              <circle r='11' />
              <circle r='6.5' fill='rgb(var(--poppy))' />
            </g>
          </g>
        </g>
      </g>
    ))}
  </svg>
);
