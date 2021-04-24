/**
 *
 * @param collision Tell wether or not the collision was with the player
 */
export const isPlayerCollision = (collision: Phaser.Types.Physics.Matter.MatterCollisionData) => {
  try {
    if (collision.bodyA.gameObject.getData('isPlayer')) {
      return true;
    }
    if (collision.bodyB.gameObject.getData('isPlayer')) {
      return true;
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.warn(error);
    return false;
  }

  return false;
};

export const velocityToTarget = (from: any, to: { x: number; y: number }, speed = 1) => {
  const direction = Math.atan((to.x - from.x) / (to.y - from.y));
  const speed2 = to.y >= from.y ? speed : -speed;

  return { velX: speed2 * Math.sin(direction), velY: speed2 * Math.cos(direction) };
};
