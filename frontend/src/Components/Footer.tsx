import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contact" className="py-10 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground"> {new Date().getFullYear()} Kata Sweet Shop. All rights reserved.</div>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/#privacy" className="text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400">Privacy</Link>
          <Link to="/#terms" className="text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400">Terms</Link>
          <Link to="/#support" className="text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400">Support</Link>
        </div>
      </div>
    </footer>
  );
}
