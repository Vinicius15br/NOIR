import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listApplicationsTool from "./tools/list-applications";
import getApplicationTool from "./tools/get-application";
import deleteApplicationTool from "./tools/delete-application";

const projectRef =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "noir-sessions-mcp",
  title: "Noir Sessions MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Noir Sessions mentorship landing page. Use `list_applications` to review incoming leads, `get_application` to inspect one, and `delete_application` to remove one. All tools require admin authentication.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listApplicationsTool, getApplicationTool, deleteApplicationTool],
});
