import { Button } from '@/Components/ui/button'
import { Link } from 'react-router-dom'

export default function CallToAction() {
  return (
    <section id="get-started" className="py-16 sm:py-24 bg-rose-50 dark:bg-gradient-to-br from-rose-600 to-rose-500 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-rose-600 dark:bg-rose-50 p-8 sm:p-12 text-white dark:text-background text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to make management sweeter?</h3>
          <p className="mt-2 text-rose-100 dark:text-muted-foreground">Join now and set up your shop in minutes.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant={'outline'} className='dark:font-semibold dark:bg-rose-500 dark:text-primary bg-background text-rose-500   hover:text-rose-500' asChild>
              <Link to="/signup">Create Account</Link>
            </Button>
            {/* <Button variant="outline" className='hover:text-rose-500' size="lg" asChild>
              <a href="#demo">View Demo</a>
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
}
