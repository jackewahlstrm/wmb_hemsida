'use client';

import RotatingText from './RotatingText';

export default function HeroHeading() {
  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 inline-flex flex-col">
      <span className="bg-wmb-red text-white whitespace-nowrap px-2">Måleri med fokus på</span>
      <RotatingText
        texts={['precision i varje drag', 'passion i varje detalj', 'kvalitet i varje lager', 'perfektion i varje yta']}
        mainClassName="bg-wmb-blue text-white px-2 min-w-full"
        rotationInterval={2500}
        staggerDuration={0.03}
        staggerFrom="first"
      />
    </h1>
  );
}
