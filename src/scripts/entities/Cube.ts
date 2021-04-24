import GameplayEntitie, { gameplayItemName, offset } from './GameplayEntitie';

/**
 * Represent an entitie that is not related to gameplay (like a bloc)
 */
export default class Cube extends GameplayEntitie {
  name: gameplayItemName = 'cube';
}
