export function MainFooter() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <span className="font-heading italic font-bold">V3-X AUDIO</span>
        <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Instagram</a>
        </div>
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">© 2026 V3-X AUDIO VIETNAM</p>
      </div>
    </footer>
  );
}
