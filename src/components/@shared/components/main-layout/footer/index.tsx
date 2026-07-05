'use client';

export default function Footer() {
  return (
    <footer className="flex justify-between py-2 mt-4 border-t border-border">
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Rhotta Fleet Management</p>
      <p className="text-xs text-muted-foreground">v1.0.0</p>
    </footer>
  );
}
