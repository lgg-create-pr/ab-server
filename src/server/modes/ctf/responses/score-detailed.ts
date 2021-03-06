import { ServerPackets, SERVER_PACKETS } from '@airbattle/protocol';
import { RESPONSE_SCORE_DETAILED, CONNECTIONS_SEND_PACKET } from '@/events';
import { System } from '@/server/system';
import { MainConnectionId } from '@/types';

export default class ScoreDetailedResponse extends System {
  constructor({ app }) {
    super({ app });

    this.listeners = {
      [RESPONSE_SCORE_DETAILED]: this.onScoreDetailed,
    };
  }

  /**
   * CTF scores.
   * Sent in response to a client request.
   *
   * @param connectionId player connection id
   */
  onScoreDetailed(сonnectionId: MainConnectionId): void {
    const scores: ServerPackets.ScoreDetailedCtfScore[] = [];

    for (let idIndex = 0; idIndex < this.storage.playerRankings.byBounty.length; idIndex += 1) {
      if (this.storage.playerList.has(this.storage.playerRankings.byBounty[idIndex])) {
        const player = this.storage.playerList.get(this.storage.playerRankings.byBounty[idIndex]);

        scores.push({
          id: player.id.current,
          level: player.level.current,
          captures: player.captures.current,
          score: player.score.current,
          kills: player.kills.current,
          deaths: player.deaths.current,
          damage: player.damage.current,
          ping: player.ping.current,
        } as ServerPackets.ScoreDetailedCtfScore);
      }
    }

    this.emit(
      CONNECTIONS_SEND_PACKET,
      {
        c: SERVER_PACKETS.SCORE_DETAILED_CTF,
        scores,
      } as ServerPackets.ScoreDetailedCtf,
      сonnectionId
    );
  }
}
