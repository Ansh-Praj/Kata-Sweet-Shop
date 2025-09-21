export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 scroll-mt-24 dark:bg-[oklch(0.2_0_0)] ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold">Everything you need, baked in</h2>
          <p className="mt-3 text-muted-foreground">Streamline your daily operations with tools designed for small shops.</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border p-6 bg-card shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            <div className="text-2xl">📦</div>
            <h3 className="mt-3 font-semibold text-foreground">Smart Inventory</h3>
            <p className="mt-1 text-sm text-muted-foreground">Track stock levels, get low stock alerts, and auto-calculate costs.</p>
          </div>
          <div className="rounded-xl border border-border p-6 bg-card shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            <div className="text-2xl">🧾</div>
            <h3 className="mt-3 font-semibold text-foreground">Order Management</h3>
            <p className="mt-1 text-sm text-muted-foreground">Create, manage, and fulfill orders quickly with minimal clicks.</p>
          </div>
          <div className="rounded-xl border border-border p-6 bg-card shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            <div className="text-2xl">📈</div>
            <h3 className="mt-3 font-semibold text-foreground">Sales Analytics</h3>
            <p className="mt-1 text-sm text-muted-foreground">Visualize trends and understand what delights your customers.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
