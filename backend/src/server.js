import "dotenv/config";
import { createApp } from "./app.js";
import { buildRepositories } from "./infrastructure/buildRepositories.js";

const PORT = process.env.PORT || 5001;

async function main() {
  const repositories = await buildRepositories();

  if (!process.env.ADMIN_TOKEN) {
    console.warn(
      "[server] ADMIN_TOKEN not set — /api/posts, /api/gallery, /api/portfolio-projects, /api/cv (writes) and /api/contact (read) are disabled."
    );
  }

  const app = createApp({ ...repositories, clientOrigin: process.env.CLIENT_ORIGIN });

  app.listen(PORT, () => {
    console.log(`[server] Portfolio API running on http://localhost:${PORT}`);
  });
}

main();
