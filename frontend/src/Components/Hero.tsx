import { Button } from '@/Components/ui/button'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function Hero() {
  const scope = useRef<HTMLDivElement | null>(null)

  useGSAP(() => {
    // used to animate all elements at once
    const items = gsap.utils.toArray<HTMLElement>('[data-animate]')
    if (items.length) {
      gsap.from(items, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
      })
    }

    // Subtle floating animation for the donut
    gsap.to('[data-float]', {
      y: -6,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, { scope }) // makes sure we only select elements inside this scope 
  return (
    <section id="home" ref={scope} className="relative pt-32 pb-20 scroll-mt-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute -top-24 left-1/2 -translate-x-1/2 h-[28rem] w-[80rem] text-rose-100" viewBox="0 0 1155 678" fill="none" aria-hidden="true">
          <path fill="currentColor" d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c35.531-49.779 110.59-63.31 164.876-29.239l215.396 136.928 122.393-122.393V0H0v438.341l317.219 80.634z" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span data-animate className="inline-flex items-center gap-2 rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-medium ring-1 ring-inset ring-rose-200">
              New
              <span className="hidden sm:inline">— Manage your sweet shop effortlessly</span>
            </span>
            <h1 data-animate className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Delightful shop management for busy owners
            </h1>
            <p data-animate className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl">
              Track inventory, manage orders, and analyze sales with a beautiful, simple interface. Built for sweet shops that value both flavor and efficiency.
            </p>
            <div data-animate className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link to="/signup">Signup</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/#features">See Features</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div data-animate className="rounded-2xl border border-rose-100 bg-white/80 shadow-xl p-4 sm:p-6 lg:p-8">
              <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-rose-100 via-white to-rose-50 grid place-items-center text-rose-600">
                <div className="text-center">
                  <div data-float className="text-6xl mb-4">🍩</div>
                  <p className="font-semibold">Inventory, Orders, Analytics</p>
                  <p className="text-sm text-gray-500">A sweet dashboard preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
