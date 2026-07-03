import { ImageResponse } from 'next/og';

// Split title into lines for display
function splitTitle(title: string): string[] {
  const words = title.split(' ');
  if (words.length <= 3) {
    return [title];
  }
  if (words.length <= 5) {
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }
  // For longer titles, split into 3 lines
  const third = Math.ceil(words.length / 3);
  return [
    words.slice(0, third).join(' '),
    words.slice(third, third * 2).join(' '),
    words.slice(third * 2).join(' '),
  ];
}

interface EventInfo {
  date: string;
  venue: string;
  city: string;
}

export async function generateBlueprintOgImage(
  title: string,
  _slug?: string,
  category?: string,
  author?: { name: string; title: string; image?: string },
  event?: EventInfo,
) {
  const lines = splitTitle(title);
  const label = category || 'ARTICLE';

  // Load Inter fonts from jsdelivr CDN (TTF format required for @vercel/og)
  const interBold = await fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf',
  ).then((res) => res.arrayBuffer());

  const interSemiBold = await fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.ttf',
  ).then((res) => res.arrayBuffer());

  const interRegular = await fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf',
  ).then((res) => res.arrayBuffer());

  // Unikko palette
  const PAPER = '#FBFAF6';
  const INK = '#15130F';
  const POPPY = '#E2342B';
  const PALETTE = [POPPY, '#1B4DE4', '#F5C518', '#0F8F6B']; // poppy, sky, sun, mint

  // Deterministic-but-varied flower arrangement per article.
  // Same slug → same composition; different slugs → different colours/places.
  const seedStr = _slug || title;
  let seed = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    seed ^= seedStr.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  const rng = (() => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  })();
  const shuffled = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Candidate slots are placed at the edges so they frame the headline
  // (which is left-aligned) rather than cover it.
  // All slots sit clear of the top row (label + wordmark) and the left
  // headline column, so flowers frame the composition without covering text.
  const SLOTS = [
    { size: 460, style: { right: -110, bottom: -150 } },
    { size: 320, style: { right: -150, top: 250 } },
    { size: 300, style: { left: -120, bottom: -150 } },
    { size: 340, style: { left: 560, bottom: -180 } },
    { size: 260, style: { right: -40, top: 170 } },
  ];
  const colorOrder = shuffled(PALETTE);
  const slotOrder = shuffled(SLOTS);
  const flowerCount = 1 + (seed % 3); // 1–3 flowers
  const flowers = slotOrder.slice(0, flowerCount).map((slot, i) => ({
    ...slot,
    color: colorOrder[i % colorOrder.length],
    rotate: Math.floor(rng() * 80) - 40,
  }));

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter',
        position: 'relative',
        background: PAPER,
      }}
    >
      {/* Hard ink frame — Marimekko poster */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `14px solid ${INK}`,
        }}
      />

      {/* Signature poppies — colour, count and placement vary per article */}
      {flowers.map((f, i) => (
        <svg
          key={i}
          width={f.size}
          height={f.size}
          viewBox='0 0 100 100'
          style={{ position: 'absolute', ...f.style }}
        >
          <g transform={`translate(50,50) rotate(${f.rotate})`} fill={f.color}>
            <ellipse rx='44' ry='17' />
            <ellipse rx='44' ry='17' transform='rotate(60)' />
            <ellipse rx='44' ry='17' transform='rotate(120)' />
            <circle r='11' fill={INK} />
            <circle r='6.5' fill={PAPER} />
          </g>
        </svg>
      ))}

      {/* Content container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          padding: '60px 70px',
          position: 'relative',
        }}
      >
        {/* Top row: Label and Branding */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Label chip */}
          <span
            style={{
              display: 'flex',
              fontSize: 20,
              fontWeight: 700,
              color: PAPER,
              backgroundColor: POPPY,
              padding: '8px 18px',
              borderRadius: 999,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>

          {/* Branding */}
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: INK,
            }}
          >
            react-native.fi
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '82%',
          }}
        >
          {/* Headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
            }}
          >
            {lines.map((line, i) => (
              <span
                key={i}
                style={{
                  fontSize: 76,
                  fontWeight: 700,
                  color: INK,
                  lineHeight: 1.04,
                  letterSpacing: '-2px',
                }}
              >
                {line}
              </span>
            ))}
          </div>

          {/* Author section */}
          {author && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginTop: '12px',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  backgroundColor: PAPER,
                  border: `3px solid ${INK}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {author.image && (
                  <img
                    src={author.image}
                    width={72}
                    height={72}
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>
                  {author.name}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 400,
                    color: 'rgba(21,19,15,0.6)',
                  }}
                >
                  {author.title}
                </span>
              </div>
            </div>
          )}

          {/* Event section */}
          {event && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '28px',
                marginTop: '12px',
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>
                {event.date}
              </span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 400,
                  color: 'rgba(21,19,15,0.7)',
                }}
              >
                {event.venue}, {event.city}
              </span>
            </div>
          )}
        </div>

        {/* Bottom spacer */}
        <div style={{ display: 'flex', height: 10 }} />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interBold,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Inter',
          data: interSemiBold,
          style: 'normal',
          weight: 600,
        },
        {
          name: 'Inter',
          data: interRegular,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  );
}
