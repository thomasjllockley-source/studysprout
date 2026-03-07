const petEmojis = {
  hamster: '🐹',
  dog: '🐕',
  cat: '🐱',
  raccoon: '🦝',
};

const itemEmojis = {
  hat: '🎩',
  glasses: '👓',
  scarf: '🧣',
  collar: '📿',
  bow: '🎀',
  cape: '🦸',
};

export default function PetDisplay({ pet, equippedDetails = [], size = 'large' }) {
  if (!pet) return null;

  const emoji = petEmojis[pet.type] || '🐾';
  const sizeClass = size === 'large' ? 'pet-display-large' : 'pet-display-small';

  return (
    <div className={`pet-display ${sizeClass}`}>
      <div className="pet-emoji">{emoji}</div>
      {equippedDetails.length > 0 && (
        <div className="pet-items">
          {equippedDetails.map((item, i) => (
            <span key={i} className="pet-item-badge" title={item.name}>
              {itemEmojis[item.type] || '✨'}
            </span>
          ))}
        </div>
      )}
      <div className="pet-name">{pet.name}</div>
    </div>
  );
}
