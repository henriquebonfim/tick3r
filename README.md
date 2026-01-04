# Tick3r

A modern, fast, and secure tool to extract frames from videos directly in your browser. All processing is done client-side, ensuring your videos truly stay on your device.

<img width="1161" height="901" alt="image" src="https://github.com/user-attachments/assets/2e1ca309-6908-4bb7-b3ad-95bbea24052a" />

## Features

- **100% Secure & Private**: Client-side processing means your videos never leave your device.
- **Offline Capable**: Works completely without an internet connection after the first load.
- **Flexible Extraction**: Capture the current frame instantly or extract a sequence of frames based on custom settings.
- **Bulk Download**: Download all extracted frames as a ZIP archive or save them individually.
- **Customization**: Adjust output format (e.g., JPEG) and quality levels to suit your needs.
- **Modern Interface**: Built with a sleek, responsive design using Tailwind CSS and Radix UI.
- **Video Player**: Integrated player to preview and seek through your video for precise frame selection.
- **SEO Optimizations**: 100% scored.
  <img width="741" height="948" alt="image" src="https://github.com/user-attachments/assets/35b2db1a-f4a6-48e8-b000-d11ff8653f6d" />

## Technologies Used

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `jszip`, `ffmpeg` (optional/future)
- **PWA**: Fully installable Progressive Web App with offline support via Service Workers
- **Hooks**: Custom hooks for online status detection (`useOnlineStatus`)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [Bun](https://bun.sh/) (recommended) or npm/yarn/pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tick3r
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun dev
   ```

4. Open your browser and visit `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

- `src/components`: UI components and feature-specific logic.
  - `editors`: Video editing and frame selection interfaces.
  - `extract-frames`: Components for managing frame extraction settings and results.
  - `upload-video`: Components for handling video file input.
  - `ui`: Reusable design system components (buttons, sliders, etc.).
- `src/pages`: Application views.
- `src/lib`: Utility functions, hooks, and shared helpers.

## Scripts

- `bun dev`: Start development server.
- `bun run build`: Build for production.
- `bun run preview`: Preview the production build locally.
- `bun run lint`: Run ESLint.
- `bun run format`: Run Prettier.

## License

MIT
