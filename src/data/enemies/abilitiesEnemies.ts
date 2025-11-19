import { EnemyAbility } from "../../types/enemies.types";

export const ENEMY_ABILITIES: EnemyAbility[] = [
  {
    id: 'basic_attack',
    name: 'Атака',
    description: 'Базовая атака',
    type: 'attack',
    cooldown: 0,
    chance: 1.0,
    effects: [
      {
        type: 'DAMAGE',
        target: 'player',
        value: 0, // будет рассчитываться от статов
        stat: 'strength'
      }
    ]
  },
  {
    id: 'strong_attack',
    name: 'Сильная атака',
    description: 'Мощный удар с перезарядкой',
    type: 'attack',
    cooldown: 2,
    chance: 0.6,
    effects: [
      {
        type: 'DAMAGE',
        target: 'player',
        value: 0,
        stat: 'strength'
      }
    ]
  },
  {
    id: 'poison_bite',
    name: 'Ядовитый укус',
    description: 'Наносит урон и снижает ловкость',
    type: 'debuff',
    cooldown: 3,
    chance: 0.7,
    effects: [
      {
        type: 'DAMAGE',
        target: 'player',
        value: 0,
        stat: 'strength'
      },
      {
        type: 'DEBUFF',
        target: 'player',
        stat: 'dexterity',
        value: -2,
        duration: 2
      }
    ]
  }
];