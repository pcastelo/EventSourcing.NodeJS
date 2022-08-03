//////////////////////////////////////
/// ESDB
//////////////////////////////////////

import { EventStoreDBClient } from '@eventstore/db-client';
import { Decider, Event } from './decider';
import { ETag } from './eTag';
import { AppendResult, appendToStream, readStream } from './streams';

export const CommandHandler =
  <State, Command, EventType extends Event>(
    getEventStore: () => EventStoreDBClient,
    toStreamId: (recordId: string) => string,
    decider: Decider<State, Command, EventType>
  ) =>
  async (
    recordId: string,
    command: Command,
    eTag: ETag | undefined = undefined
  ): Promise<AppendResult> => {
    const eventStore = getEventStore();

    const streamId = toStreamId(recordId);
    const events = await readStream<EventType>(eventStore, streamId);

    const state = events.reduce<State>(
      decider.evolve,
      decider.getInitialState()
    );

    const newEvents = decider.decide(command, state);

    const toAppend = Array.isArray(newEvents) ? newEvents : [newEvents];

    return appendToStream(eventStore, streamId, eTag, ...toAppend);
  };
