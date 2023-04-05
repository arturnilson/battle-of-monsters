import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Id } from 'objection';
import { Battle, Monster } from '../models';

const list = async (req: Request, res: Response): Promise<Response> => {
  const battles = await Battle.query();
  return res.status(StatusCodes.OK).json(battles);
};

function calculateDamage(attack: number, defense: number) {
  return attack - defense <= 0 ? 1 : attack - defense;
}

function battleWinner(monster1: Monster, monster2: Monster) {
  const firstAttacker =
    monster1.speed > monster2.speed ||
    (monster1.speed === monster2.speed && monster1.attack > monster2.attack)
      ? monster1
      : monster2;

  const secondAttacker = firstAttacker === monster1 ? monster2 : monster1;
  let firstAttackerHP = firstAttacker.hp;
  let secondAttackerHP = secondAttacker.hp;
  let damage;

  while (firstAttackerHP > 0 && secondAttackerHP > 0) {
    damage = calculateDamage(firstAttacker.attack, secondAttacker.defense);

    secondAttackerHP -= damage;

    if (secondAttackerHP <= 0) {
      return firstAttacker;
    }

    damage = calculateDamage(secondAttacker.attack, firstAttacker.defense);

    firstAttackerHP -= damage;

    if (firstAttackerHP <= 0) {
      return secondAttacker;
    }
  }
}

const startBattle = async (req: Request, res: Response): Promise<Response> => {
  const { IdMonsterA, IdMonsterB } = req.body;

  if (!IdMonsterA || !IdMonsterB) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'IdMonsterA and IdMonsterB required.',
    });
  }

  const monster = await Promise.all([
    Monster.query().findById(IdMonsterA),
    Monster.query().findById(IdMonsterB),
  ]);

  const monsterA = monster[0];
  const monsterB = monster[1];

  if (!monsterA || !monsterB) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'MonsterA or MonsterB inexistent' });
  }

  const insertBattle = await Battle.query().insert({
    monsterA,
    monsterB,
    winner: battleWinner(monsterA, monsterB),
  });

  return res.status(StatusCodes.CREATED).json(insertBattle);
};

const deleteBattle = async (req: Request, res: Response): Promise<Response> => {
  const id: Id = req.params.id;

  const deletedBattle = await Battle.query().deleteById(id);

  if (!deletedBattle) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }

  return res.sendStatus(StatusCodes.NO_CONTENT);
};

export const BattleController = {
  list,
  startBattle,
  deleteBattle,
};
