# Vercel TUI

A beautiful Terminal User Interface (TUI) for managing Vercel deployments, built with Bun and OpenTUI.

## Features

- 📋 View and filter deployments by branch
- 🔍 Search deployments with real-time updates
- 📊 View deployment details and build logs
- 🎨 Catppuccin theme with syntax highlighting
- ⚡ Real-time log streaming for active builds
- 🚀 Fast and lightweight single executable

## Installation

```bash
# Using npm
npm install -g @nivalis/vercel-tui

# Using bun
bun add -g @nivalis/vercel-tui

# Using npx (no installation)
npx @nivalis/vercel-tui
```

## Usage

Run the TUI from any Vercel project directory:

```bash
vercel-tui
```

Or use npx:

```bash
npx @nivalis/vercel-tui
```

The TUI will automatically detect your project from the `.vercel/project.json` file.

## Keyboard Shortcuts

### Global

- `?` - Show help panel
- `Q` / `ESC` - Quit application
- `Ctrl+K` - Toggle console

### Deployments List

- `↑` / `↓` - Navigate deployments
- `TAB` - Cycle branch filter forward
- `Shift+TAB` - Cycle branch filter backward
- `ENTER` - View deployment details
- `O` - Open deployment in Vercel dashboard
- `R` - Refresh deployments list

### Deployment Details

- `BACKSPACE` - Go back to list
- `O` - Open in Vercel dashboard

## Development

```bash
# Clone the repository
git clone https://github.com/nivalis/vercel-tui.git
cd vercel-tui

# Install dependencies
bun install

# Run in development mode
bun run dev

# Build executable
bun run build

# Type check
bun run ts

# Lint
bun run lint
```

## Requirements

- Node.js 18+ or Bun 1.0+
- A Vercel project with `.vercel/project.json` configured

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
