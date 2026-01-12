'use client'

import Image from 'next/image'

const customerLogos = [
  { src: '/assets/Postman.png', alt: 'Postman' },
  { src: '/assets/Doordash.png', alt: 'DoorDash' },
  { src: '/assets/Paloalto.png', alt: 'Palo Alto Networks' },
  { src: '/assets/HackerRank.png', alt: 'HackerRank' },
  { src: '/assets/Bain.png', alt: 'Bain & Company' },
  { src: '/assets/Clearcover.png', alt: 'Clearcover' },
  { src: '/assets/Cyera.png', alt: 'Cyera' },
  { src: '/assets/Elsevier.png', alt: 'Elsevier' },
  { src: '/assets/Internet 2.png', alt: 'Internet2' },
  { src: '/assets/PG&E.png', alt: 'PG&E' },
  { src: '/assets/Perficient.png', alt: 'Perficient' },
  { src: '/assets/Phreesia.png', alt: 'Phreesia' },
  { src: '/assets/Qoala.png', alt: 'Qoala' },
  { src: '/assets/Qure.png', alt: 'Qure.ai' },
  { src: '/assets/RVO Health.png', alt: 'RVO Health' },
  { src: '/assets/Snorkel.png', alt: 'Snorkel AI' },
  { src: '/assets/Syngenta.png', alt: 'Syngenta' },
]

export default function LogoRibbon() {
  return (
    <section className="py-16 overflow-hidden border-y border-border-primary">
      <div className="text-center mb-10">
        <p className="text-sm text-text-muted uppercase tracking-widest">
          Trusted by leading teams
        </p>
      </div>
      
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling Container */}
        <div className="flex animate-scroll-x">
          {/* First set of logos */}
          <div className="flex items-center gap-16 shrink-0 px-8">
            {customerLogos.map((logo, index) => (
              <div key={`logo-1-${index}`} className="flex items-center justify-center flex-shrink-0">
                <Image 
                  src={logo.src}
                  alt={logo.alt}
                  width={200}
                  height={100}
                  className="h-20 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
          
          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-16 shrink-0 px-8">
            {customerLogos.map((logo, index) => (
              <div key={`logo-2-${index}`} className="flex items-center justify-center flex-shrink-0">
                <Image 
                  src={logo.src}
                  alt={logo.alt}
                  width={200}
                  height={100}
                  className="h-20 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
