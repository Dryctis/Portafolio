// app/loading.tsx
export default function Loading() {
  return (
    <main className="pt-8 lg:pt-10 pb-10 lg:pb-12">
      <div className="mx-auto max-w-[115rem] 2xl:max-w-[120rem] px-6 lg:px-10">
        <div className="mb-3 h-[36px] rounded-lg bg-foreground/10 animate-pulse" />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-6">
          <div className="xl:col-span-3 space-y-4">
            <div className="h-64 rounded-lg bg-foreground/10 animate-pulse" />
            <div className="h-56 rounded-lg bg-foreground/10 animate-pulse" />
          </div>
          <div className="xl:col-span-6 space-y-4">
            <div className="h-80 rounded-lg bg-foreground/10 animate-pulse" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 rounded-lg bg-foreground/10 animate-pulse" />
              <div className="h-20 rounded-lg bg-foreground/10 animate-pulse" />
              <div className="h-20 rounded-lg bg-foreground/10 animate-pulse" />
            </div>
          </div>
          <div className="xl:col-span-3 space-y-4">
            <div className="h-64 rounded-lg bg-foreground/10 animate-pulse" />
            <div className="h-64 rounded-lg bg-foreground/10 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
