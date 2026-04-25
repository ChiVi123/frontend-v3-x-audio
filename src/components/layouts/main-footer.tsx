export function MainFooter() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <span className="font-heading italic font-bold text-primary">V3-X AUDIO</span>
        <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          <a href="/#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="/#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <a href="/#" className="hover:text-primary transition-colors">
            Instagram
          </a>
        </div>
        <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
          © 2026 V3-X AUDIO VIETNAM
        </p>
      </div>
    </footer>
  );
}
