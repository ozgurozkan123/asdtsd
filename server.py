import os
import subprocess
from fastmcp import FastMCP

# Create the MCP server
mcp = FastMCP("amass-mcp")


@mcp.tool()
def amass(
    subcommand: str,
    domain: str = "",
    intel_whois: bool = False,
    intel_organization: str = "",
    enum_type: str = "",
    enum_brute: bool = False,
    enum_brute_wordlist: str = ""
) -> str:
    """
    Advanced subdomain enumeration and reconnaissance tool using OWASP Amass.

    Args:
        subcommand: Specify the Amass operation mode - 'enum' for subdomain enumeration and network mapping, or 'intel' for gathering intelligence about target domains
        domain: Target domain to perform reconnaissance against (e.g., example.com)
        intel_whois: Whether to include WHOIS data in intelligence gathering (true/false)
        intel_organization: Organization name to search for during intelligence gathering (e.g., 'Example Corp')
        enum_type: Enumeration approach type - 'active' includes DNS resolution and network interactions, 'passive' only uses third-party sources
        enum_brute: Whether to perform brute force subdomain discovery (true/false)
        enum_brute_wordlist: Path to custom wordlist file for brute force operations
    """
    if subcommand not in ["enum", "intel"]:
        return f"Error: subcommand must be 'enum' or 'intel', got '{subcommand}'"

    amass_args = ["amass", subcommand]

    # Handle enum subcommand
    if subcommand == "enum":
        if not domain:
            return "Error: Domain parameter is required for 'enum' subcommand"
        
        amass_args.extend(["-d", domain])
        
        # Handle enum type
        if enum_type == "passive":
            amass_args.append("-passive")
        # Active is default
        
        # Handle brute force options
        if enum_brute:
            amass_args.append("-brute")
            if enum_brute_wordlist:
                amass_args.extend(["-w", enum_brute_wordlist])

    # Handle intel subcommand
    elif subcommand == "intel":
        if not domain and not intel_organization:
            return "Error: Either domain or organization parameter is required for 'intel' subcommand"
        
        if domain:
            amass_args.extend(["-d", domain])
            if not intel_whois:
                return "Error: For domain parameter, whois is required (set intel_whois=true)"
        
        if intel_organization:
            amass_args.extend(["-org", intel_organization])
        
        if intel_whois:
            amass_args.append("-whois")

    # Execute amass command
    try:
        command_str = " ".join(amass_args)
        print(f"Executing: {command_str}")
        
        result = subprocess.run(
            amass_args,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        output = result.stdout
        if result.stderr:
            output += "\n" + result.stderr
        
        if result.returncode != 0:
            return f"Amass exited with code {result.returncode}.\nCommand: {command_str}\nOutput: {output}"
        
        return output if output.strip() else "Amass completed but produced no output."
        
    except subprocess.TimeoutExpired:
        return f"Error: Amass command timed out after 300 seconds. Command: {' '.join(amass_args)}"
    except FileNotFoundError:
        return "Error: Amass binary not found. Please ensure amass is installed."
    except Exception as e:
        return f"Error executing amass: {str(e)}"


# Run the server with streamable-http transport for standard HTTP POST
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    
    mcp.run(
        transport="streamable-http",
        host="0.0.0.0",
        port=port,
        path="/mcp"
    )
