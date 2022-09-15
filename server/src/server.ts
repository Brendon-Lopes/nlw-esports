import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import convertHourStringToMinutes from './utils/convert-hour-string-to-minutes';
import convertMinutestoHourString from './utils/convert-minutes-to-hour-string';

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient({
  log: ['query']
});

app.get('/games', async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        }
      }
    }
  });

  return response.status(200).json(games);
});

app.post('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id;
  const data: any = request.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: data.name,
      yearsPlaying: data.yearsPlaying,
      discord: data.discord,
      weekDays: data.weekDays.join(','),
      hourStart: convertHourStringToMinutes(data.hourStart),
      hourEnd: convertHourStringToMinutes(data.hourEnd),
      useVoiceChannel: data.useVoiceChannel,
      createdAt: data.createdAt,
    }
  });

  return response.status(201).json(ad);
});

app.get('/games/:id/ads/', async (request, response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatedAds = ads.map((ad) => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutestoHourString(ad.hourStart),
      hourEnd: convertMinutestoHourString(ad.hourEnd),
    };
  });

  return response.status(200).json(formatedAds);
});

app.get('/ads/:id/discord/', async (request, response) => {
  const adId = request.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });

  return response.status(200).json({ discord: ad.discord });
});

app.listen(3333);
