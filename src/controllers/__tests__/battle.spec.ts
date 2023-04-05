import app from '../../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

const server = app.listen();

beforeAll(async () => jest.useFakeTimers());
afterAll(async () => server.close());

describe('BattleController', () => {
  describe('List', () => {
    test('should list all battles', async () => {
      const response = await request(server).get('/battle');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Battle', () => {
    test('should fail when trying a battle of monsters with an undefined monster', async () => {
      const response = await request(server)
        .post(`/battle/start-battle`)
        .send(undefined);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test('should fail when trying a battle of monsters with an inexistent monster', async () => {
      const response = await request(server)
        .post(`/battle/start-battle`)
        .send({ IdMonsterA: 1, IdMonsterB: 1231241 });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe('MonsterA or MonsterB inexistent');
    });

    test('should insert a battle of monsters successfully with monster 1 winning', async () => {
      const monster1 = await request(server).post(`/monsters`).send({
        createdAt: null,
        updatedAt: null,
        name: "Random Monster",
        imageUrl: 'url',
        attack: 3,
        defense: 3,
        hp: 3,
        speed: 1,
      });

      const monster2 = await request(server).post(`/monsters`).send({
        createdAt: null,
        updatedAt: null,
        name: "Random Monster",
        imageUrl: 'url',
        attack: 2,
        defense: 2,
        hp: 2,
        speed: 2,
      });

      expect(monster1.status).toBe(StatusCodes.CREATED);
      expect(monster2.status).toBe(StatusCodes.CREATED);

      const response = await request(server)
        .post(`/battle/start-battle`)
        .send({ IdMonsterA: monster1.body.id, IdMonsterB: monster2.body.id });

      console.log(response.body);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.winner).toStrictEqual(monster1.body);
    });

    test('should insert a battle of monsters successfully with monster 2 winning', async () => {
      const monster1 = await request(server).post(`/monsters`).send({
        createdAt: null,
        updatedAt: null,
        name: "Random Monster",
        imageUrl: 'url',
        attack: 10,
        defense: 10,
        hp: 10,
        speed: 10,
      });

      const monster2 = await request(server).post(`/monsters`).send({
        createdAt: null,
        updatedAt: null,
        name: "Random Monster",
        imageUrl: 'url',
        attack: 80,
        defense: 20,
        hp: 70,
        speed: 10,
      });

      expect(monster1.status).toBe(StatusCodes.CREATED);
      expect(monster2.status).toBe(StatusCodes.CREATED);

      const response = await request(server)
        .post(`/battle/start-battle`)
        .send({ IdMonsterA: monster1.body.id, IdMonsterB: monster2.body.id });

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.winner).toStrictEqual(monster2.body);
    });
  });

  describe('Delete Battle', () => {
    test('should delete a battle successfully', async () => {
      const response = await request(server).get('/battle');

      const deleteResponse = await request(server).delete(
        `/battle/delete-battle/${response.body[0].id}`
      );
      expect(deleteResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    test("should return 404 if the battle doesn't exists", async () => {
      const response = await request(server).delete(
        `/battle/delete-battle/9999`
      );
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
