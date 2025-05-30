#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration interface
interface KnotieConfig {
  apiKey: string;
  partnerEmail: string;
  baseUrl?: string;
}

// Default configuration
const DEFAULT_BASE_URL = "https://analytics.knotie-ai.pro";
const DEVELOPMENT_MODE = process.env.NODE_ENV === "development" || process.env.MCP_DEV_MODE === "true";

// Load configuration
function loadConfig(): KnotieConfig {
  // First, try to load from environment variables
  const envApiKey = process.env.KNOTIE_API_KEY;
  const envPartnerEmail = process.env.KNOTIE_PARTNER_EMAIL;
  const envBaseUrl = process.env.KNOTIE_BASE_URL;

  if (envApiKey && envPartnerEmail) {
    return {
      apiKey: envApiKey,
      partnerEmail: envPartnerEmail,
      baseUrl: envBaseUrl || DEFAULT_BASE_URL
    };
  }

  // Fallback to config file
  const configPaths = [
    join(process.cwd(), "knotie-config.json"),
    join(__dirname, "..", "config", "knotie-config.json"),
    join(process.env.HOME || process.env.USERPROFILE || "", ".knotie", "config.json")
  ];

  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      try {
        const configData = JSON.parse(readFileSync(configPath, "utf-8"));
        return {
          baseUrl: DEFAULT_BASE_URL,
          ...configData
        };
      } catch (error) {
        console.error(`Error reading config from ${configPath}:`, error);
      }
    }
  }

  throw new Error(`
Configuration not found. Please either:

1. Set environment variables:
   KNOTIE_API_KEY=your-api-key
   KNOTIE_PARTNER_EMAIL=your-partner-email@example.com
   KNOTIE_BASE_URL=https://analytics.knotie-ai.pro (optional)

2. Create a config file with:
{
  "apiKey": "your-api-key",
  "partnerEmail": "your-partner-email@example.com",
  "baseUrl": "https://analytics.knotie-ai.pro"
}

Supported config file locations:
- ./knotie-config.json (current directory)
- ~/.knotie/config.json (home directory)
- ./config/knotie-config.json (relative to installation)
  `);
}

// API client
class KnotieApiClient {
  private config: KnotieConfig;

  constructor(config: KnotieConfig) {
    this.config = config;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      "X-API-Key": this.config.apiKey,
      "X-Partner-Email": this.config.partnerEmail,
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to connect to Knotie AI Pro API: ${error.message}`);
      }
      throw error;
    }
  }

  // System endpoints
  async getCapabilities() {
    return this.makeRequest("/mcp/capabilities");
  }

  async getHealth() {
    return this.makeRequest("/health");
  }

  // Customer management
  async createCustomer(data: any) {
    return this.makeRequest("/mcp/customers", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  async enablePortalAccess(data: any) {
    return this.makeRequest("/mcp/customers/portal-access", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  async resetPassword(data: any) {
    return this.makeRequest("/mcp/customers/reset-password", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  // Agent management
  async mapAgent(data: any) {
    return this.makeRequest("/mcp/agents/map", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  async updateAgent(data: any) {
    return this.makeRequest("/mcp/agents/update", {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  async unmapAgent(data: any) {
    return this.makeRequest(`/mcp/agents/${data.agentId}/mapping?agent_type=${data.agentType}`, {
      method: "DELETE"
    });
  }

  async updateCustomerFeatures(data: any) {
    return this.makeRequest("/mcp/customers/features", {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }
}

// Create MCP server
async function createServer() {
  // Load configuration
  const config = loadConfig();
  const apiClient = new KnotieApiClient(config);

  // Test connection
  try {
    await apiClient.getCapabilities();
    console.error("✅ Connected to Knotie AI Pro API successfully");
  } catch (error) {
    console.error("❌ Failed to connect to Knotie AI Pro API:", error);
    process.exit(1);
  }

  // Create server instance
  const server = new McpServer({
    name: "knotie-ai-pro",
    version: "1.0.0",
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  // System tools
  server.tool(
    "get-capabilities",
    "Get system capabilities and available features",
    {},
    async () => {
      try {
        const result = await apiClient.getCapabilities();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  );

  server.tool(
    "get-health",
    "Check API health status",
    {},
    async () => {
      try {
        const result = await apiClient.getHealth();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  );

  // Customer management tools
  server.tool(
    "create-customer",
    "Create a new customer account",
    {
      email: z.string().email().describe("Customer's email address"),
      first_name: z.string().describe("Customer's first name"),
      last_name: z.string().describe("Customer's last name"),
      company_name: z.string().describe("Customer's company name")
    },
    async ({ email, first_name, last_name, company_name }) => {
      try {
        const result = await apiClient.createCustomer({
          email,
          first_name,
          last_name,
          company_name
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ Customer created successfully!\n\n${JSON.stringify(result, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error creating customer: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  );

  server.tool(
    "enable-portal-access",
    "Enable portal access for a customer",
    {
      customer_id: z.string().describe("Customer ID"),
      send_email: z.boolean().optional().describe("Send welcome email with login instructions (default: false)")
    },
    async ({ customer_id, send_email }) => {
      try {
        const result = await apiClient.enablePortalAccess({
          customer_id,
          send_email: send_email || false
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ Portal access enabled successfully!\n\n${JSON.stringify(result, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error enabling portal access: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  );

  server.tool(
    "reset-customer-password",
    "Reset a customer's password",
    {
      customer_id: z.string().describe("Customer ID"),
      send_email: z.boolean().optional().describe("Send password reset email (default: false)")
    },
    async ({ customer_id, send_email }) => {
      try {
        const result = await apiClient.resetPassword({
          customer_id,
          send_email: send_email || false
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ Password reset initiated successfully!\n\n${JSON.stringify(result, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error resetting password: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  );

  // Agent management tools
  server.tool(
    "map-agent",
    "Map an AI agent to a customer",
    {
      agent_id: z.string().describe("Agent ID from the AI platform (Retell, VAPI, etc.)"),
      customer_id: z.string().describe("Customer ID"),
      agent_type: z.enum(["retell", "vapi"]).describe("Agent type (retell or vapi)"),
      profit_multiplier: z.number().min(1).max(10).optional().describe("Profit multiplier for pricing (1.0-10.0, default: 1.5)")
    },
    async ({ agent_id, customer_id, agent_type, profit_multiplier }) => {
      try {
        const result = await apiClient.mapAgent({
          agent_id,
          customer_id,
          agent_type,
          profit_multiplier: profit_multiplier || 1.5
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ Agent mapped successfully!\n\n${JSON.stringify(result, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error mapping agent: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  );

  server.tool(
    "update-agent",
    "Update agent configuration",
    {
      customerEmail: z.string().email().describe("Customer's email address"),
      agentId: z.string().describe("Agent ID to update"),
      profitMultiplier: z.number().min(1).max(10).optional().describe("New profit multiplier (1.0-10.0)"),
      agentName: z.string().optional().describe("New agent name"),
      isActive: z.boolean().optional().describe("Enable/disable the agent")
    },
    async ({ customerEmail, agentId, profitMultiplier, agentName, isActive }) => {
      try {
        const updateData: any = { customerEmail, agentId };
        if (profitMultiplier !== undefined) updateData.profitMultiplier = profitMultiplier;
        if (agentName !== undefined) updateData.agentName = agentName;
        if (isActive !== undefined) updateData.isActive = isActive;

        const result = await apiClient.updateAgent(updateData);
        return {
          content: [
            {
              type: "text",
              text: `✅ Agent updated successfully!\n\n${JSON.stringify(result, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error updating agent: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  );

  server.tool(
    "unmap-agent",
    "Remove agent mapping from customer",
    {
      agentId: z.string().describe("Agent ID to unmap"),
      agentType: z.enum(["retell", "vapi"]).describe("Agent type (retell or vapi)")
    },
    async ({ agentId, agentType }) => {
      try {
        const result = await apiClient.unmapAgent({
          agentId,
          agentType
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ Agent unmapped successfully!\n\n${JSON.stringify(result, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error unmapping agent: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  );

  server.tool(
    "update-customer-features",
    "Update customer feature settings and permissions",
    {
      customerId: z.string().describe("Customer ID"),
      features: z.object({
        enableAdvancedAnalytics: z.boolean().optional().describe("Enable advanced analytics"),
        enableDetailedCallAnalysis: z.boolean().optional().describe("Enable detailed call analysis"),
        enableActionPointAnalysis: z.boolean().optional().describe("Enable action point analysis"),
        enableApiAccess: z.boolean().optional().describe("Enable API access"),
        showKnowledgeBase: z.boolean().optional().describe("Show knowledge base section"),
        showIntegration: z.boolean().optional().describe("Show integration section"),
        showDocsAndMedia: z.boolean().optional().describe("Show docs and media section"),
        showScheduleMeeting: z.boolean().optional().describe("Show schedule meeting section"),
        showApiKeys: z.boolean().optional().describe("Show API keys section"),
        showPricingInformation: z.boolean().optional().describe("Show pricing information"),
        enableTeamMembers: z.boolean().optional().describe("Enable team member management"),
        maxTeamMembers: z.number().min(1).max(100).optional().describe("Maximum number of team members")
      }).describe("Feature settings to update")
    },
    async ({ customerId, features }) => {
      try {
        const result = await apiClient.updateCustomerFeatures({
          customer_id: customerId,
          features
        });
        return {
          content: [
            {
              type: "text",
              text: `✅ Customer features updated successfully!\n\n${JSON.stringify(result, null, 2)}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error updating customer features: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  );

  return server;
}

// Main function
async function main() {
  try {
    const server = await createServer();

    // Create transport
    const transport = new StdioServerTransport();

    // Connect server to transport
    await server.connect(transport);

    console.error("🚀 Knotie AI Pro MCP Server started successfully");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle process termination
process.on("SIGINT", () => {
  console.error("👋 Shutting down Knotie AI Pro MCP Server");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.error("👋 Shutting down Knotie AI Pro MCP Server");
  process.exit(0);
});

// Start server
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
