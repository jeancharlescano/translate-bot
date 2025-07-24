export default function getTimestamp() {
  return new Date().toLocaleTimeString('fr-FR', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}