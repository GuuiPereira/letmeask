import { useEffect, useState } from "react";

import { database } from '../services/firebase';
import { useAuth } from "./useAuth";

type QuestionsType = {
  id: string,
  author: {
    name: string,
    avatar: string
  }
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean,
  likeCount: number,
  likeId: string | undefined
}

type FireBaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  }
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean
  likes: Record<string, {
    authorId: string
  }>
}>

export function useRoom(roomId: string) {

  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionsType[]>([]);
  const [title, setTitle] = useState('');
  const [endedAt, setEndedAt] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {

      const databaseRoom = room.val();
      const fireBaseQuestions: FireBaseQuestions = databaseRoom.questions;
      const fireBaseEndedAt = databaseRoom.endedAt;

      const parsedQuestions = Object.entries(fireBaseQuestions || {}).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
      setEndedAt(fireBaseEndedAt)

    });

    return () => {
      roomRef.off('value');
    }

  }, [roomId, user?.id]);

  return { questions, title, endedAt }
}