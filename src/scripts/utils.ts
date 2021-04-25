/**
 *
 * @param collision Tell wether or not the collision was with the player
 */
export const isPlayerCollision = (collision: Phaser.Types.Physics.Matter.MatterCollisionData) => {
  if (collision.bodyB.gameObject?.data?.get('isPlayer') === true || collision.bodyA.gameObject?.data?.get('isPlayer') === true) {
    return true;
  }

  return false;
};

export const velocityToTarget = (from: { x: number; y: number }, to: { x: number; y: number }, speed = 1) => {
  const direction = Math.atan((to.x - from.x) / (to.y - from.y));
  const speed2 = to.y >= from.y ? speed : -speed;

  return { velX: speed2 * Math.sin(direction), velY: speed2 * Math.cos(direction) };
};

/**
 *
 * @param label
 * @returns
 */
export function shouldIgnoreMagnets(label: string) {
  const ignore = ['player', 'bullet'];

  if (ignore.indexOf(label) > -1) {
    return true;
  }
  return false;
}

/**
 * Return true if the given tag label can receive a magnet bullet
 * @param label
 * @returns
 */
export function shouldStickMagnet(label: string) {
  const ignore = ['player', 'bullet', 'cube', 'spike'];

  if (ignore.indexOf(label) > -1) {
    return false;
  }
  return true;
}
export function shouldBounce(label: string) {
  const bounce = ['bouncePanel'];

  if (bounce.indexOf(label) > -1) {
    return true;
  }
  return false;
}
