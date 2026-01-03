'use client'

import Image from 'next/image'

export default function LogoRibbon() {
  return (
    <section className="py-12 overflow-hidden border-y border-border-secondary bg-bg-primary/50">
      <div className="text-center mb-8">
        <p className="text-sm text-text-muted uppercase tracking-widest">
          Trusted by leading teams
        </p>
      </div>
      
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling Container */}
        <div className="flex animate-scroll-x">
          {/* First set of logos */}
          <div className="flex items-center shrink-0">
            <Image 
              src="/assets/customer-logo-ribbon-1.png" 
              alt="Customer logos" 
              width={1400}
              height={64}
              className="h-16 w-auto opacity-40 hover:opacity-70 transition-opacity grayscale"
            />
            <Image 
              src="/assets/customer-logo-ribbon-2.png" 
              alt="Customer logos" 
              width={1400}
              height={64}
              className="h-16 w-auto opacity-40 hover:opacity-70 transition-opacity grayscale"
            />
            <Image 
              src="/assets/customer-logo-ribbon-3.png" 
              alt="Customer logos" 
              width={1400}
              height={64}
              className="h-16 w-auto opacity-40 hover:opacity-70 transition-opacity grayscale"
            />
          </div>
          
          {/* Duplicate for seamless loop */}
          <div className="flex items-center shrink-0">
            <Image 
              src="/assets/customer-logo-ribbon-1.png" 
              alt="Customer logos" 
              width={1400}
              height={64}
              className="h-16 w-auto opacity-40 hover:opacity-70 transition-opacity grayscale"
            />
            <Image 
              src="/assets/customer-logo-ribbon-2.png" 
              alt="Customer logos" 
              width={1400}
              height={64}
              className="h-16 w-auto opacity-40 hover:opacity-70 transition-opacity grayscale"
            />
            <Image 
              src="/assets/customer-logo-ribbon-3.png" 
              alt="Customer logos" 
              width={1400}
              height={64}
              className="h-16 w-auto opacity-40 hover:opacity-70 transition-opacity grayscale"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
