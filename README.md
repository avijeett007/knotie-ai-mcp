# Knotie AI Pro MCP Server

A Model Context Protocol (MCP) server that enables AI agents like Claude Desktop to interact with the Knotie AI Pro platform for automated customer and voice AI agent management.

## 🚀 Features

- **Customer Management**: Create customers, enable portal access, reset passwords
- **Agent Management**: Map AI agents to customers, update configurations, manage profit multipliers
- **Multi-Platform Support**: Works with Retell, VAPI, ElevenLabs, GoHighLevel
- **Secure Local Configuration**: API keys stored locally, never transmitted to third parties
- **Claude Desktop Integration**: Seamless integration with Claude Desktop and other MCP clients

## 📋 Prerequisites

- Node.js 18+ installed
- A Knotie AI Pro partner account with API access
- Claude Desktop or another MCP-compatible client

## 🚀 Quick Start

### For NPM Users (Recommended)

```bash
# 1. Install globally
npm install -g knotie-ai-mcp

# 2. Run interactive setup
npm run setup
# OR manually create config:
mkdir -p ~/.knotie
echo '{"apiKey":"your-key","partnerEmail":"your-email@example.com","baseUrl":"https://knotie-ai.pro"}' > ~/.knotie/config.json

# 3. Test the server
npx knotie-ai-mcp

# 4. Add to Claude Desktop config and restart Claude
```

### For Developers (From Source)

```bash
# 1. Clone and setup
git clone https://github.com/your-username/knotie-ai-mcp.git
cd knotie-ai-mcp
npm install && npm run build

# 2. Configure
cp config/knotie-config.example.json config/knotie-config.json
# Edit config/knotie-config.json with your credentials

# 3. Test
npm run dev

# 4. Add to Claude Desktop with full path to build/index.js
```

## 🛠️ Installation

```bash
# 1. Install globally
npm install -g knotie-ai-mcp

# 2. Run interactive setup
npm run setup
# OR manually create config:
mkdir -p ~/.knotie
echo '{"apiKey":"your-key","partnerEmail":"your-email@example.com","baseUrl":"https://knotie-ai.pro"}' > ~/.knotie/config.json

# 3. Test the server
npx knotie-ai-mcp

# 4. Add to Claude Desktop config and restart Claude
```

### For Developers (From Source)

```bash
# 1. Clone and setup
git clone https://github.com/your-username/knotie-ai-mcp.git
cd knotie-ai-mcp
npm install && npm run build

# 2. Configure
cp config/knotie-config.example.json config/knotie-config.json
# Edit config/knotie-config.json with your credentials

# 3. Test
npm run dev

# 4. Add to Claude Desktop with full path to build/index.js
```

## � Quick Start

### For NPM Users (Recommended)

```bash
# 1. Install globally
npm install -g knotie-ai-mcp

# 2. Run interactive setup
npm run setup
# OR manually create config:
mkdir -p ~/.knotie
echo '{"apiKey":"your-key","partnerEmail":"your-email@example.com","baseUrl":"https://knotie-ai.pro"}' > ~/.knotie/config.json

# 3. Test the server
npx knotie-ai-mcp

# 4. Add to Claude Desktop config and restart Claude
```

### For Developers (From Source)

```bash
# 1. Clone and setup
git clone https://github.com/your-username/knotie-ai-mcp.git
cd knotie-ai-mcp
npm install && npm run build

# 2. Configure
cp config/knotie-config.example.json config/knotie-config.json
# Edit config/knotie-config.json with your credentials

# 3. Test
npm run dev

# 4. Add to Claude Desktop with full path to build/index.js
```

## �🛠️ Installation

### Option 1: NPM Installation (Recommended)

```bash
# Install globally
npm install -g knotie-ai-mcp

# Or install locally
npm install knotie-ai-mcp
```

### Option 2: From Source

```bash
# Clone the repository
git clone https://github.com/knotie-ai/knotie-ai-mcp.git
cd knotie-ai-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## ⚙️ Configuration

The MCP server requires your Knotie AI Pro API credentials. You can configure these in two ways:

### Method 1: Environment Variables (Recommended)

Set environment variables directly in your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "knotie-ai-pro": {
      "command": "node",
      "args": ["/absolute/path/to/knotie-ai-mcp/build/index.js"],
      "env": {
        "KNOTIE_API_KEY": "your-api-key-here",
        "KNOTIE_PARTNER_EMAIL": "your-partner-email@example.com",
        "KNOTIE_BASE_URL": "https://analytics.knotie-ai.pro"
      }
    }
  }
}
```

**Environment Variables:**
- `KNOTIE_API_KEY` - Your partner API key (required)
- `KNOTIE_PARTNER_EMAIL` - Your registered partner email (required)
- `KNOTIE_BASE_URL` - Base URL for analytics service (optional, defaults to https://analytics.knotie-ai.pro)

**Benefits:**
- ✅ No config files needed
- ✅ Credentials stored securely in Claude Desktop
- ✅ Works with any installation method
- ✅ Similar to other MCP servers (GitHub, etc.)

### Method 2: Configuration Files (Alternative)

#### Option A: NPM Installation

If you installed via NPM (`npm install -g knotie-ai-mcp`):

1. **Create config directory:**
   ```bash
   mkdir -p ~/.knotie
   ```

2. **Create configuration file:**
   ```bash
   # Create the config file
   touch ~/.knotie/config.json
   ```

3. **Add your credentials:**
   ```json
   {
     "apiKey": "your-api-key-here",
     "partnerEmail": "your-partner-email@example.com",
     "baseUrl": "https://analytics.knotie-ai.pro"
   }
   ```

### Method 2: From Source (Cloned Repository)

If you cloned the repository:

1. **Copy the example config:**
   ```bash
   cp config/knotie-config.example.json config/knotie-config.json
   ```

2. **Edit the configuration:**
   ```bash
   # Edit the file with your credentials
   nano config/knotie-config.json
   # or
   code config/knotie-config.json
   ```

3. **Update with your credentials:**
   ```json
   {
     "apiKey": "your-actual-api-key",
     "partnerEmail": "your-actual-email@example.com",
     "baseUrl": "https://analytics.knotie-ai.pro"
   }
   ```

### Configuration File Locations (Priority Order)

The server looks for configuration in this order:
1. `./knotie-config.json` (current directory)
2. `~/.knotie/config.json` (home directory) - **Recommended for NPM installs**
3. `./config/knotie-config.json` (relative to installation) - **For source installs**

### Get Your API Credentials

1. Log in to your Knotie AI Pro partner dashboard
2. Navigate to Settings → API Keys
3. Create a new API key
4. Copy your API key and partner email to the config file

## 🔧 Claude Desktop Setup

### 1. Install Claude Desktop

Download and install [Claude Desktop](https://claude.ai/download) if you haven't already.

### 2. Configure Claude Desktop

Edit your Claude Desktop configuration file:

**macOS/Linux:**
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```bash
code %APPDATA%\Claude\claude_desktop_config.json
```

### 3. Add Knotie AI Pro Server

#### Option A: Environment Variables (Recommended)
```json
{
  "mcpServers": {
    "knotie-ai-pro": {
      "command": "node",
      "args": ["/Users/avijitsarkar/Projects/Knotie-AI/knotie-ai-pro/knotie-ai-mcp/build/index.js"],
      "env": {
        "KNOTIE_API_KEY": "pkt_48405b5a31fec30a3be3480f7d2a56552488bb61fc81d63100ab83e8d792d3b6",
        "KNOTIE_PARTNER_EMAIL": "avijeett007@gmail.com",
        "KNOTIE_BASE_URL": "https://analytics.knotie-ai.pro"
      }
    }
  }
}
```

#### Option B: NPM Installation with Config File
```json
{
  "mcpServers": {
    "knotie-ai-pro": {
      "command": "npx",
      "args": ["knotie-ai-mcp"]
    }
  }
}
```

#### Option C: From Source with Config File
```json
{
  "mcpServers": {
    "knotie-ai-pro": {
      "command": "node",
      "args": ["/absolute/path/to/knotie-ai-mcp/build/index.js"]
    }
  }
}
```

**Note:** Replace `/absolute/path/to/knotie-ai-mcp` with the actual path where you cloned the repository.

**Why index.js?** The TypeScript source (`src/index.ts`) is compiled to JavaScript (`build/index.js`) during the build process. Node.js runs the compiled JavaScript file.

### 4. Restart Claude Desktop

Restart Claude Desktop to load the new MCP server.

## 🎯 Available Tools

### System Tools

- **get-capabilities**: Get system capabilities and available features
- **get-health**: Check API health status

### Customer Management

- **create-customer**: Create a new customer account
  - `email` (required): Customer's email address
  - `businessName` (required): Customer's business name
  - `contactName` (optional): Primary contact name
  - `phone` (optional): Contact phone number
  - `subscriptionTier` (optional): starter, professional, or enterprise

- **enable-portal-access**: Enable portal access for a customer
  - `customerEmail` (required): Customer's email address
  - `sendWelcomeEmail` (optional): Send welcome email (default: true)

- **reset-customer-password**: Reset a customer's password
  - `customerEmail` (required): Customer's email address
  - `sendEmail` (optional): Send password reset email (default: true)

### Agent Management

- **map-agent**: Map an AI agent to a customer
  - `customerEmail` (required): Customer's email address
  - `agentId` (required): Agent ID from AI platform
  - `platform` (required): retell, vapi, elevenlabs, or gohighlevel
  - `profitMultiplier` (optional): Profit multiplier 1.0-10.0 (default: 1.5)
  - `agentName` (optional): Custom name for the agent

- **update-agent**: Update agent configuration
  - `customerEmail` (required): Customer's email address
  - `agentId` (required): Agent ID to update
  - `profitMultiplier` (optional): New profit multiplier
  - `agentName` (optional): New agent name
  - `isActive` (optional): Enable/disable the agent

- **unmap-agent**: Remove agent mapping from customer
  - `customerEmail` (required): Customer's email address
  - `agentId` (required): Agent ID to unmap

## 💡 Usage Examples

### In Claude Desktop

Once configured, you can use natural language commands in Claude Desktop:

```
"Create a new customer with email john@example.com and business name 'John's Restaurant'"

"Map a Retell agent with ID 'agent_123' to customer john@example.com with a 2.0 profit multiplier"

"Enable portal access for customer john@example.com and send them a welcome email"

"Check the health status of the Knotie AI Pro API"
```

### Command Line Testing

Test the server directly:

```bash
# Test the server
npm run dev

# Or if installed globally
knotie-ai-mcp
```

## 🔒 Security

- **Local Configuration**: API keys are stored locally and never transmitted to third parties
- **Secure Communication**: All API calls use HTTPS with proper authentication
- **Partner Verification**: Each request includes partner email verification
- **No Data Storage**: The MCP server doesn't store any customer or agent data

## 🐛 Troubleshooting

### Server Not Showing in Claude Desktop

1. Check your `claude_desktop_config.json` syntax
2. Ensure the path to the server is correct
3. Restart Claude Desktop completely
4. Check Claude's logs: `~/Library/Logs/Claude/mcp*.log`

### Configuration Errors

1. Verify your API key is correct
2. Ensure your partner email matches your account
3. Check that the config file is in a supported location
4. Validate JSON syntax in your config file

### API Connection Issues

**Important:** The MCP server connects to the **Analytics Service**, not the main Knotie AI Pro website.

**Correct Base URLs:**
- **Production:** `https://analytics.knotie-ai.pro`
- **Development:** `http://localhost:8000` (if running analytics service locally)

**Common Issues:**
1. **404 Not Found:** Using wrong base URL (should be analytics.knotie-ai.pro, not knotie-ai.pro)
2. **Connection Refused:** Analytics service may be down or URL incorrect
3. **401 Unauthorized:** Invalid API key or partner email
4. **403 Forbidden:** Valid credentials but insufficient permissions

**Debug Steps:**
1. Test your internet connection
2. Verify the base URL points to the analytics service
3. Check if your API key has the necessary permissions
4. Ensure your partner account is active
5. Try connecting to the health endpoint manually:
   ```bash
   curl -H "X-API-Key: your-api-key" \
        -H "X-Partner-Email: your-email@example.com" \
        https://analytics.knotie-ai.pro/health
   ```

## 📚 Documentation

- [Knotie AI Pro API Documentation](https://knotie-ai.pro/docs)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Claude Desktop Setup Guide](https://claude.ai/download)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- [GitHub Issues](https://github.com/knotie-ai/knotie-ai-mcp/issues)
- [Knotie AI Pro Support](https://knotie-ai.pro/support)
- [MCP Community](https://github.com/modelcontextprotocol)

---

**Made with ❤️ by the Knotie AI Pro team**
