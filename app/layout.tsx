export const metadata = {
  title: 'Arjun MCP Server',
  description: 'MCP server for Arjun HTTP parameter discovery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
