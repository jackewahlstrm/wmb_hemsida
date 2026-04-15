'use client'

import { useEffect, useRef, useState } from 'react'
import { Award, Clock, Heart, Target } from 'lucide-react'
import WithSkeleton from '@/components/WithSkeleton'
import { AboutSkeleton } from '@/components/PageSkeleton'

const values = [
  { icon: Award, title: 'Kvalitet', description: 'Vi kompromissar aldrig med kvaliteten.' },
  { icon: Clock, title: 'Punktlighet', description: 'Alltid i tid och inom budget.' },
  { icon: Heart, title: 'Passion', description: 'Måleri är vår passion.' },
  { icon: Target, title: 'Precision', description: 'Detaljer gör skillnaden.' },
]

const clients = ['Företag 1', 'Företag 2', 'Företag 3', 'Företag 4', 'Företag 5', 'Företag 6']

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

interface SplitProps {
  imageSrc: string | null
  imageOnLeft: boolean
  eyebrow: string
  title: string
  bgClass?: string
  children: React.ReactNode
}

function SplitSection({ imageSrc, imageOnLeft, eyebrow, title, bgClass = '', children }: SplitProps) {
  const image = (
    <div className="relative h-96 lg:h-screen lg:max-h-[700px] overflow-hidden">
      {imageSrc ? (
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-wmb-red/10 via-transparent to-wmb-blue/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-zinc-400 dark:text-zinc-600 text-sm">Bild kommer</span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
    </div>
  )

  const text = (
    <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-20">
      <div className="max-w-xl w-full">
        <p className="text-wmb-blue font-semibold text-sm uppercase tracking-widest mb-4">{eyebrow}</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
          {title}
        </h2>
        <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  )

  return (
    <section className={`grid grid-cols-1 lg:grid-cols-2 ${bgClass}`}>
      {imageOnLeft ? (
        <>
          <Reveal>{image}</Reveal>
          <Reveal delay={0.15}>{text}</Reveal>
        </>
      ) : (
        <>
          <div className="order-2 lg:order-1">
            <Reveal delay={0.15}>{text}</Reveal>
          </div>
          <div className="order-1 lg:order-2">
            <Reveal>{image}</Reveal>
          </div>
        </>
      )}
    </section>
  )
}

export default function OmOssPage() {
  return (
    <WithSkeleton skeleton={<AboutSkeleton />}>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="/IMG_3838 (1).jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-white/70 font-semibold text-sm uppercase tracking-widest mb-3">Om oss</p>
          <h1 className="text-4xl sm:text-6xl font-bold text-white max-w-3xl leading-tight">
            Hantverk med <span className="text-wmb-red">hjärta och själ</span>
          </h1>
        </div>
      </section>

      {/* Historia (bild vänster) */}
      <SplitSection
        imageSrc="/bluehouse_wmb.webp"
        imageOnLeft={true}
        eyebrow="Vår historia"
        title="Från en idé till ett etablerat företag"
      >
        <p>
          Wahlströms Måleri & Bygg grundades med en enkel vision — att leverera måleriarbeten av
          högsta kvalitet med personlig service och omtanke om varje kund.
        </p>
        <p>
          Sedan starten har vi vuxit från ett litet familjeföretag till ett av Stockholms mest
          pålitliga måleriföretag, med hundratals genomförda projekt för både privatpersoner
          och företag.
        </p>
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <p className="text-3xl font-bold text-wmb-red">15+</p>
            <p className="text-xs text-zinc-500 mt-1">Års erfarenhet</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-wmb-red">500+</p>
            <p className="text-xs text-zinc-500 mt-1">Projekt</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-wmb-red">200+</p>
            <p className="text-xs text-zinc-500 mt-1">Nöjda kunder</p>
          </div>
        </div>
      </SplitSection>

      {/* VD (bild höger) */}
      <SplitSection
        imageSrc="/tomas_wmb.webp"
        imageOnLeft={false}
        eyebrow="VD & Grundare"
        title="Tomas Wahlström"
        bgClass="bg-zinc-50 dark:bg-zinc-900/50"
      >
        <p>
          Tomas, född 1967, har hantverket i blodet. Efter utbildning på Västberga gymnasium
          började han arbeta i branschen redan 1983 — bara 16 år gammal. Sex år senare, 1989,
          startade han eget som 21-åring, efter att en kund uttryckligen velat fortsätta
          jobba med honom.
        </p>
        <blockquote className="border-l-4 border-wmb-red pl-5 py-2 italic text-zinc-700 dark:text-zinc-300 my-6">
          &ldquo;Jag tror på att göra saker rätt från början. Det handlar inte bara om att måla en
          vägg — det handlar om att skapa en miljö där människor trivs.&rdquo;
        </blockquote>
        <p>
          Med över fyra decenniers erfarenhet inom måleri och bygg är Tomas hjärnan och själen
          bakom företaget. När han inte leder teamet spenderar han gärna tiden på ishockeyn —
          en passion sedan barnsben, både som spelare och supporter.
        </p>
      </SplitSection>

      {/* Värderingar (bild vänster) */}
      <SplitSection
        imageSrc={null}
        imageOnLeft={true}
        eyebrow="Våra värderingar"
        title="Det som driver oss framåt"
      >
        <p>
          Vi behandlar varje hem och varje projekt som om det vore vårt eget. Det är därför
          våra kunder kommer tillbaka — och det är därför vi har ett rykte om att leverera
          resultat som överträffar förväntningarna.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4">
          {values.map((v) => (
            <div key={v.title} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-wmb-blue/10 dark:bg-wmb-blue-dark/30 text-wmb-blue rounded-lg flex items-center justify-center shrink-0">
                <v.icon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-0.5">{v.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SplitSection>

      {/* Kunder (bild höger) */}
      <SplitSection
        imageSrc={null}
        imageOnLeft={false}
        eyebrow="Kända kunder"
        title="Företag som litar på oss"
        bgClass="bg-zinc-50 dark:bg-zinc-900/50"
      >
        <p>
          Genom åren har vi haft förmånen att samarbeta med både privatpersoner och välkända
          företag i Stockholmsregionen. Vårt rykte bygger på varje uppdrag vi levererar.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
          {clients.map((client) => (
            <div
              key={client}
              className="h-20 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center"
            >
              <span className="text-zinc-400 dark:text-zinc-500 text-xs font-medium">{client}</span>
            </div>
          ))}
        </div>
      </SplitSection>
    </WithSkeleton>
  )
}
