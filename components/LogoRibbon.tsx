'use client'

import Image from 'next/image'

export default function LogoRibbon() {
  return (
    <section className="py-12 overflow-hidden border-y border-border-color bg-bg-secondary/30">
      <div className="text-center mb-8">
        <p className="text-sm text-text-muted uppercase tracking-wider">
          Trusted by leading companies
        </p>
      </div>
      
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10"></div>
        
        {/* Scrolling Container */}
        <div className="flex logo-ribbon">
          {/* First set of logos */}
          <div className="flex items-center gap-0 shrink-0">
            <Image 
              src="/assets/customer-logo-ribbon-1.png" 
              alt="Customer logos" 
              width={1200}
              height={60}
              className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
            <Image 
              src="/assets/customer-logo-ribbon-2.png" 
              alt="Customer logos" 
              width={1200}
              height={60}
              className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
            <Image 
              src="/assets/customer-logo-ribbon-3.png" 
              alt="Customer logos" 
              width={1200}
              height={60}
              className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
          </div>
          
          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-0 shrink-0">
            <Image 
              src="/assets/customer-logo-ribbon-1.png" 
              alt="Customer logos" 
              width={1200}
              height={60}
              className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
            <Image 
              src="/assets/customer-logo-ribbon-2.png" 
              alt="Customer logos" 
              width={1200}
              height={60}
              className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
            <Image 
              src="/assets/customer-logo-ribbon-3.png" 
              alt="Customer logos" 
              width={1200}
              height={60}
              className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

