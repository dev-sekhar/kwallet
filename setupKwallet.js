const fs = require('fs');
const path = require('path');

const dirs = [
  'apps/mobile',
  'apps/backend',
  'packages/core',
  'packages/ui',
  'packages/i18n',
  'packages/utils',
  'packages/database',
  'packages/scripts',
  'docs'
];

// Helper to make nested directories and placeholder READMEs
dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  fs.mkdirSync(fullPath, { recursive: true });
  fs.writeFileSync(path.join(fullPath, 'README.md'), `# ${dir.split('/').pop()}\n\nThis is the ${dir} package.`);
});

// Create root files
const rootFiles = {
  'package.json': JSON.stringify({
    name: "kwallet-monorepo",
    private: true,
    workspaces: [
      "apps/*",
      "packages/*"
    ]
  }, null, 2),
  '.gitignore': `node_modules\nlogs\n.env\n.DS_Store\n.env.*\ndist\n*.log\n__pycache__\n`,
  'README.md': '# kWallet Monorepo\n\nSee /docs for the kWallet_Project_Blueprint_v2.docx.\n'
}

Object.entries(rootFiles).forEach(([filename, content]) => {
  fs.writeFileSync(filename, content);
});

// Create minimal Dockerfile and FastAPI starter in backend
const dockerfile = `
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install fastapi uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
`;

const fastapiMain = `
from fastapi import FastAPI
app = FastAPI()
@app.get("/")
def read_root():
    return {"message": "Hello from kWallet backend!"}
`;

fs.writeFileSync('apps/backend/Dockerfile', dockerfile.trim());
fs.writeFileSync('apps/backend/main.py', fastapiMain.trim());

// Create React Native placeholder in mobile
const rnReadme = `
# Mobile App

To bootstrap React Native in this folder:
\`\`\`
npx react-native init MobileApp
\`\`\`
`;

fs.writeFileSync('apps/mobile/README.md', rnReadme.trim());

console.log("kWallet monorepo structure created. Next steps:");
console.log("1. Review generated folders and files.");
console.log("2. Initialize Yarn workspaces and individual package projects.");
console.log("3. Bootstrap React Native in apps/mobile.");
