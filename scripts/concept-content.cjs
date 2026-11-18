/* Authoring-only concept data used by the legacy layout stage.
 * The final Production portfolio is replaced with approved data/portfolio.js.
 * This module is never published or loaded in a browser.
 */
const projects = [
  { id: 'in-the-making', title: 'In the making', category: 'Film', image: 'production', year: 'Concept', featured: true, videoUrl: '', description: 'A study in the art of storytelling. A visual direction for the future Otium film portfolio.', alt: 'Hands holding a clapperboard on an outdoor film set' },
  { id: 'after-hours', title: 'After hours', category: 'Events', image: 'events', year: 'Concept', featured: false, videoUrl: '', description: 'The energy of a moment, made unforgettable. An illustrative direction for live experience films.', alt: 'Concert crowd beneath a canopy of stage lights' },
  { id: 'another-perspective', title: 'Another perspective', category: 'Commercial', image: 'production-documentary', year: 'Concept', featured: false, videoUrl: '', description: 'Architecture, atmosphere, and a different point of view. An illustrative commercial treatment.', alt: 'A documentary crew filming on location in Doha' },
  { id: 'a-world-apart', title: 'A world apart', category: 'Branded content', image: 'events', year: 'Concept', featured: true, videoUrl: '', description: 'An invitation to see beyond the expected. An illustrative direction for location-led brand storytelling.', alt: 'An audience gathered for a live event' }
];
const services = [
  { title: 'Creative direction', description: 'Finding the idea, the visual language, and the point of view that bring a story together.' },
  { title: 'Film & commercial', description: 'Moving images shaped with intention, from the first treatment to the final frame.' },
  { title: 'Branded content', description: 'Stories that connect a brand with its audience through a distinctive voice.' },
  { title: 'Event production', description: 'Considered experiences that turn a shared moment into a lasting impression.' },
  { title: 'Post-production', description: 'The edit, the sound, the colour. Every detail working toward one complete picture.' }
];
module.exports = {projects, services};
