#!/usr/bin/env node

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('🚀 Knotie AI Pro MCP Server Setup\n');

  // Get configuration from user
  const apiKey = await question('Enter your Knotie AI Pro API key: ');
  const partnerEmail = await question('Enter your partner email: ');
  const baseUrl = await question('Enter base URL (press Enter for default): ') || 'https://analytics.knotie-ai.pro';

  // Create configuration object
  const config = {
    apiKey: apiKey.trim(),
    partnerEmail: partnerEmail.trim(),
    baseUrl: baseUrl.trim()
  };

  // Determine config file location
  const homeDir = process.env.HOME || process.env.USERPROFILE || '';
  const configDir = join(homeDir, '.knotie');
  const configPath = join(configDir, 'config.json');

  // Create .knotie directory if it doesn't exist
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  // Write configuration file
  try {
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`\n✅ Configuration saved to: ${configPath}`);
  } catch (error) {
    console.error(`\n❌ Error saving configuration: ${error.message}`);
    process.exit(1);
  }

  // Test connection
  console.log('\n🔍 Testing connection to Knotie AI Pro...');

  try {
    const response = await fetch(`${config.baseUrl}/api/mcp/health`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'X-Partner-Email': config.partnerEmail
      }
    });

    if (response.ok) {
      console.log('✅ Connection successful!');
    } else {
      console.log(`❌ Connection failed: ${response.status} ${response.statusText}`);
      console.log('Please check your API key and partner email.');
    }
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    console.log('Please check your internet connection and base URL.');
  }

  // Determine installation method
  const isGlobalInstall = process.argv[0].includes('npx') || process.argv[0].includes('npm');
  const currentDir = process.cwd();

  // Claude Desktop configuration instructions
  console.log('\n📋 Next Steps:');
  console.log('1. Install Claude Desktop: https://claude.ai/download');
  console.log('2. Add this to your Claude Desktop config:');
  console.log('\n   macOS/Linux: ~/Library/Application Support/Claude/claude_desktop_config.json');
  console.log('   Windows: %APPDATA%\\Claude\\claude_desktop_config.json');

  if (isGlobalInstall) {
    console.log('\n   Configuration (NPM Installation):');
    console.log('   {');
    console.log('     "mcpServers": {');
    console.log('       "knotie-ai-pro": {');
    console.log('         "command": "npx",');
    console.log('         "args": ["knotie-ai-mcp"]');
    console.log('       }');
    console.log('     }');
    console.log('   }');
  } else {
    console.log('\n   Configuration (Source Installation):');
    console.log('   {');
    console.log('     "mcpServers": {');
    console.log('       "knotie-ai-pro": {');
    console.log('         "command": "node",');
    console.log(`         "args": ["${currentDir}/build/index.js"]`);
    console.log('       }');
    console.log('     }');
    console.log('   }');
  }

  console.log('\n3. Restart Claude Desktop');
  console.log('4. Look for the tools icon in Claude Desktop to confirm the server is connected');

  console.log('\n🎉 Setup complete! You can now use Knotie AI Pro tools in Claude Desktop.');

  rl.close();
}

setup().catch((error) => {
  console.error('Setup failed:', error);
  process.exit(1);
});
