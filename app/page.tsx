export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Arjun MCP Server</h1>
      <p>This is an MCP server for Arjun - HTTP parameter discovery tool.</p>
      <h2>MCP Endpoint</h2>
      <code style={{ background: '#f4f4f4', padding: '0.5rem', borderRadius: '4px' }}>/mcp</code>
      <h2>Available Tools</h2>
      <ul>
        <li><strong>do-arjun</strong> - Generate Arjun command to discover hidden HTTP parameters</li>
      </ul>
    </main>
  );
}
