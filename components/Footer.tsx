export default function Footer() {
  return (
    <footer className="text-center px-[clamp(32px,7vw,130px)] py-7 text-faint text-xs border-t border-cobalt/10 relative z-[2]">
      © {new Date().getFullYear()} Isaac · Built with care &amp; cobalt.
    </footer>
  );
}
