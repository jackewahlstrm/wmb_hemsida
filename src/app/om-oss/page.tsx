'use client'

import { Award, Clock, Heart, Target } from 'lucide-react'
import WithSkeleton from '@/components/WithSkeleton'
import { AboutSkeleton } from '@/components/PageSkeleton'

const values = [
  {
    icon: Award,
    title: 'Kvalitet',
    description: 'Vi kompromissar aldrig med kvaliteten. Varje projekt utförs med de bästa materialen och metoderna.',
  },
  {
    icon: Clock,
    title: 'Punktlighet',
    description: 'Vi håller det vi lovar — alltid i tid och inom budget. Tydlig kommunikation genom hela projektet.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Måleri är vår passion. Vi älskar det vi gör och det syns i resultatet av varje projekt.',
  },
  {
    icon: Target,
    title: 'Precision',
    description: 'Detaljer gör skillnaden. Vi lägger extra tid på finishen för att leverera perfekta resultat.',
  },
]

export default function OmOssPage() {
  return (
    <WithSkeleton skeleton={<AboutSkeleton />}>
      {/* Hero */}
      <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">Om oss</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            Wahlströms Måleri & Bygg
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Med över 15 års erfarenhet levererar vi professionellt måleri och byggarbete
            i hela Stockholmsområdet.
          </p>
        </div>
      </section>

      {/* About the company */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image placeholder */}
            <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-wmb-red/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-zinc-400 dark:text-zinc-600 text-sm">Bild på teamet</span>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Vår historia</h2>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                  Wahlströms Måleri & Bygg grundades med en enkel vision — att leverera
                  måleriarbeten av högsta kvalitet med personlig service och omtanke om
                  varje kund.
                </p>
                <p>
                  Sedan starten har vi vuxit från ett litet familjeföretag till ett av
                  Stockholms mest pålitliga måleriföretag. Vi har genomfört hundratals
                  projekt för både privatpersoner och företag.
                </p>
                <p>
                  Vår filosofi är enkel: vi behandlar varje hem och varje projekt som om
                  det vore vårt eget. Det är därför våra kunder kommer tillbaka, och det
                  är därför vi har ett rykte om att leverera resultat som överträffar
                  förväntningarna.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">VD & Grundare</p>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Namn Wahlström</h2>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                  Med en livslång passion för hantverk och byggnation startade Namn
                  Wahlströms Måleri & Bygg för att erbjuda stockholmarna en måleritjänst
                  de verkligen kan lita på.
                </p>
                <p>
                  &ldquo;Jag tror på att göra saker rätt från början. Det handlar inte bara om
                  att måla en vägg — det handlar om att skapa en miljö där människor trivs
                  och känner sig hemma.&rdquo;
                </p>
                <p>
                  Med gedigen utbildning och mångårig erfarenhet inom måleri leder Namn
                  teamet med samma engagemang och kvalitetskrav som den allra
                  första dagen.
                </p>
              </div>
            </div>

            {/* CEO Image */}
            <div className="order-1 lg:order-2 h-96 rounded-2xl relative overflow-hidden">
              <img src="/tomas_wmb.webp" alt="Tomas Wahlström" className="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">Våra värderingar</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Det som driver oss framåt
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-wmb-blue/10 dark:bg-wmb-blue-dark/30 text-wmb-blue rounded-xl mb-4">
                  <value.icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notable clients */}
      <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">Kända kunder</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-12">
            Företag som litar på oss
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Kund 1', 'Kund 2', 'Kund 3', 'Kund 4'].map((client) => (
              <div
                key={client}
                className="h-24 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center"
              >
                <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">{client}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </WithSkeleton>
  )
}
