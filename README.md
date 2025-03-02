# Fiesta x Fiasco - Space-Themed Clothing Brand

A React-based interactive landing page for a clothing brand with a space theme. This project features a "slide to escape" interaction, dynamic galaxy background, and 3D model integration.

## Features

- ✨ Dynamic galaxy background with twinkling stars
- 🚀 Interactive "Slide to Escape" functionality 
- 🌌 3D model integration using Three.js
- 📱 Fully responsive design
- ⚡ Fast loading and optimized performance

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or later)
- npm (v6.0.0 or later) or [Yarn](https://yarnpkg.com/) (v1.22.0 or later)

## Installation

1. Clone this repository
   ```bash
   git clone https://github.com/your-username/fiestaxfiasco.git
   cd fiestaxfiasco
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
fiestaxfiasco/
├── public/
│   ├── index.html
│   ├── logo.svg
│   ├── models/
│   │   └── model.glb           # 3D model file (you need to add this)
│   └── ...
├── src/
│   ├── components/
│   │   ├── GalaxyBackground.jsx
│   │   ├── GalaxyBackground.css
│   │   ├── SlideToEscape.jsx
│   │   └── SlideToEscape.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── ...
├── package.json
├── README.md
└── ...
```

## Customization

### Changing the 3D Model

1. Add your GLB file to the `public/models` folder
2. Update the model path in the `App.jsx` file:

```jsx
<Model path="/models/your-model.glb" />
```

### Updating the Logo

1. Replace the `logo.svg` file in the `public` folder with your own logo
2. Make sure your logo has a transparent background for best results

### Modifying Text and Colors

- Edit the inspirational text in the `App.jsx` file
- Change colors and styles in the CSS files

## Dependencies

- [React](https://reactjs.org/) - UI library
- [Three.js](https://threejs.org/) - 3D library
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [React Three Drei](https://github.com/pmndrs/drei) - Useful helpers for React Three Fiber

## Development

### Adding Pages

To add more pages after the landing page:

1. Create new components in the `components` folder
2. Set up routing using React Router
3. Add navigation in the main content area

## Deployment

### Building for Production

```bash
npm run build
# or
yarn build
```

This creates a `build` directory with production-ready optimized files.

### Deployment Options

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.