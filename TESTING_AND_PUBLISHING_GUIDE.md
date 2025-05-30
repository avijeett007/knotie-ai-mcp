# Testing and Publishing Guide for Knotie AI MCP Server

## 🧪 Testing Before Publishing

### 1. Local Testing (From Source)

#### Prerequisites
- Node.js 18+ installed
- Valid Knotie AI Pro partner account with API access
- API key and partner email

#### Step-by-Step Testing

1. **Clone and Setup:**
   ```bash
   # Clone the repository
   git clone https://github.com/your-username/knotie-ai-mcp.git
   cd knotie-ai-mcp

   # Install dependencies
   npm install

   # Build the project
   npm run build
   ```

2. **Configure Credentials (Choose One Method):**

   **Method A: Environment Variables (Recommended):**
   ```bash
   # Set environment variables
   export KNOTIE_API_KEY="your-api-key"
   export KNOTIE_PARTNER_EMAIL="your-email@example.com"
   export KNOTIE_BASE_URL="https://analytics.knotie-ai.pro"
   ```

   **Method B: Config File:**
   ```bash
   # Copy example config
   cp config/knotie-config.example.json config/knotie-config.json

   # Edit with your actual credentials
   nano config/knotie-config.json
   ```

3. **Test Connection:**
   ```bash
   # Test the server directly
   npm run dev

   # You should see:
   # ✅ Connected to Knotie AI Pro API successfully
   # 🚀 Knotie AI Pro MCP Server started successfully
   ```

4. **Test with Claude Desktop:**

   a. **Install Claude Desktop** (if not already installed)

   b. **Configure Claude Desktop (Choose One Method):**

   **Method A: Environment Variables (Recommended):**
   ```json
   // Add to claude_desktop_config.json
   {
     "mcpServers": {
       "knotie-ai-pro": {
         "command": "node",
         "args": ["/absolute/path/to/knotie-ai-mcp/build/index.js"],
         "env": {
           "KNOTIE_API_KEY": "your-api-key",
           "KNOTIE_PARTNER_EMAIL": "your-email@example.com",
           "KNOTIE_BASE_URL": "https://analytics.knotie-ai.pro"
         }
       }
     }
   }
   ```

   **Method B: Config File:**
   ```json
   // Add to claude_desktop_config.json
   {
     "mcpServers": {
       "knotie-ai-pro": {
         "command": "node",
         "args": ["/absolute/path/to/knotie-ai-mcp/build/index.js"]
       }
     }
   }
   ```

   c. **Restart Claude Desktop**

   d. **Test Commands:**
   - "Check the health of the Knotie AI Pro API"
   - "Get system capabilities"
   - "Create a test customer with email test@example.com"

### 2. NPM Package Testing (Local)

#### Test NPM Package Locally

1. **Create NPM Package:**
   ```bash
   # In the knotie-ai-mcp directory
   npm pack

   # This creates knotie-ai-mcp-1.0.0.tgz
   ```

2. **Test Global Installation:**
   ```bash
   # Install the package globally from the tarball
   npm install -g ./knotie-ai-mcp-1.0.0.tgz

   # Configure credentials
   mkdir -p ~/.knotie
   echo '{
     "apiKey": "your-api-key",
     "partnerEmail": "your-email@example.com",
     "baseUrl": "https://analytics.knotie-ai.pro"
   }' > ~/.knotie/config.json

   # Test the command
   npx knotie-ai-mcp
   ```

3. **Test Claude Desktop with NPM:**
   ```json
   // Update claude_desktop_config.json
   {
     "mcpServers": {
       "knotie-ai-pro": {
         "command": "npx",
         "args": ["knotie-ai-mcp"]
       }
     }
   }
   ```

### 3. Comprehensive Test Checklist

#### ✅ Pre-Publishing Tests

- [ ] **Build Success:** `npm run build` completes without errors
- [ ] **TypeScript Compilation:** No TypeScript errors
- [ ] **Package Creation:** `npm pack` creates valid package
- [ ] **Local Installation:** Global install from tarball works
- [ ] **Configuration Loading:** All config file locations work
- [ ] **API Connection:** Successfully connects to Knotie AI Pro API
- [ ] **Error Handling:** Graceful handling of invalid credentials
- [ ] **Claude Desktop Integration:** Server appears in Claude Desktop
- [ ] **Tool Execution:** All 8 MCP tools work correctly
- [ ] **Documentation:** README instructions are accurate

#### ✅ Tool-Specific Tests

Test each MCP tool individually:

- [ ] **get-capabilities:** Returns system capabilities
- [ ] **get-health:** Returns API health status
- [ ] **create-customer:** Creates customer successfully
- [ ] **enable-portal-access:** Enables portal access
- [ ] **reset-customer-password:** Resets password
- [ ] **map-agent:** Maps agent to customer
- [ ] **update-agent:** Updates agent configuration
- [ ] **unmap-agent:** Removes agent mapping

## 📦 Publishing to NPM

### 1. Prepare for Publishing

#### Update Package Information

1. **Verify package.json:**
   ```json
   {
     "name": "knotie-ai-mcp",
     "version": "1.0.0",
     "description": "Model Context Protocol server for Knotie AI Pro",
     "repository": {
       "type": "git",
       "url": "https://github.com/your-username/knotie-ai-mcp.git"
     },
     "bugs": {
       "url": "https://github.com/your-username/knotie-ai-mcp/issues"
     },
     "homepage": "https://github.com/your-username/knotie-ai-mcp#readme"
   }
   ```

2. **Update README.md:**
   - Replace placeholder URLs with actual repository URLs
   - Ensure all installation instructions are accurate
   - Add badges for NPM version, downloads, etc.

3. **Verify Files:**
   ```bash
   # Check what will be published
   npm pack --dry-run
   ```

### 2. NPM Account Setup

1. **Create NPM Account:**
   - Go to https://www.npmjs.com/signup
   - Create account or login

2. **Login to NPM CLI:**
   ```bash
   npm login
   # Enter your NPM credentials
   ```

3. **Verify Login:**
   ```bash
   npm whoami
   # Should show your NPM username
   ```

### 3. Publishing Process

#### First-Time Publishing

1. **Final Build:**
   ```bash
   npm run build
   ```

2. **Version Check:**
   ```bash
   # Check current version
   npm version

   # If needed, update version
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

3. **Publish:**
   ```bash
   # Publish to NPM
   npm publish

   # For scoped packages (if needed)
   npm publish --access public
   ```

4. **Verify Publication:**
   ```bash
   # Check if package is available
   npm view knotie-ai-mcp

   # Test installation
   npm install -g knotie-ai-mcp
   ```

### 4. Post-Publishing Testing

#### Test NPM Installation

1. **Clean Environment Test:**
   ```bash
   # Create a new directory for testing
   mkdir test-npm-install
   cd test-npm-install

   # Install from NPM
   npm install -g knotie-ai-mcp

   # Configure
   mkdir -p ~/.knotie
   echo '{
     "apiKey": "your-api-key",
     "partnerEmail": "your-email@example.com",
     "baseUrl": "https://analytics.knotie-ai.pro"
   }' > ~/.knotie/config.json

   # Test
   npx knotie-ai-mcp
   ```

2. **Claude Desktop Test:**
   ```json
   // Test with NPM-installed version
   {
     "mcpServers": {
       "knotie-ai-pro": {
         "command": "npx",
         "args": ["knotie-ai-mcp"]
       }
     }
   }
   ```

## 🔄 Update and Maintenance

### Updating the Package

1. **Make Changes:**
   - Update source code
   - Update documentation
   - Test changes locally

2. **Version Bump:**
   ```bash
   npm version patch  # Bug fixes
   npm version minor  # New features
   npm version major  # Breaking changes
   ```

3. **Republish:**
   ```bash
   npm run build
   npm publish
   ```

### Monitoring

1. **NPM Statistics:**
   - Check download stats on npmjs.com
   - Monitor issues and feedback

2. **GitHub Issues:**
   - Respond to user issues
   - Update documentation based on feedback

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **NPM Publish Fails:**
   ```bash
   # Check if package name is available
   npm view knotie-ai-mcp

   # If name is taken, update package.json name
   ```

3. **Claude Desktop Not Finding Server:**
   - Check config file path in claude_desktop_config.json
   - Verify NPM global installation: `npm list -g knotie-ai-mcp`
   - Check Claude Desktop logs

### Debug Commands

```bash
# Check NPM configuration
npm config list

# Check global packages
npm list -g --depth=0

# Test package locally
npm link
npm link knotie-ai-mcp

# Check Claude Desktop logs (macOS)
tail -f ~/Library/Logs/Claude/mcp*.log
```

## ✅ Final Checklist

Before publishing to NPM:

- [ ] All tests pass locally
- [ ] Package builds successfully
- [ ] README is accurate and complete
- [ ] Version number is appropriate
- [ ] Repository URLs are correct
- [ ] License is included
- [ ] .gitignore excludes sensitive files
- [ ] NPM account is set up and logged in
- [ ] Package name is available on NPM

After publishing:

- [ ] Package is available on npmjs.com
- [ ] Global installation works
- [ ] Claude Desktop integration works
- [ ] All MCP tools function correctly
- [ ] Documentation is accessible
- [ ] GitHub repository is public (if open source)

---

**Ready to publish!** 🚀

Once you've completed all tests and checks, your Knotie AI MCP Server will be ready for the community to use!
