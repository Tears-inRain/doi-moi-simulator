# GAME ARCHITECTURE: DOI MOI POLICY SIMULATOR

## 1. Concept Overview
An interactive decision-making simulator where the classroom acts as a "Strategic Council". 
The Host advances through 5 historical crisis scenarios (1986 - 2021).
Players vote via mobile on policy decisions, directly impacting 3 Live National Metrics.

## 2. Global State Engine
The backend maintains a central state object for the nation:
```json
{
  "year": 1986,
  "metrics": {
    "economyGDP": 50,      // Scale 0 - 100
    "qualityOfLife": 30,   // Scale 0 - 100
    "globalStatus": 20     // Scale 0 - 100
  },
  "inflationRate": 774.7,  // Initial 1986 inflation
  "currentScenarioIndex": 0,
  "votingState": "IDLE"    // IDLE, VOTING, RESULT
}
## 3. Realtime Socket Event Flow
host:start_scenario -> Broadcasts scenario details & options to all players.

player:cast_vote -> Payload: { scenarioId, optionId }.

Server aggregates votes in real-time -> Emits host:vote_distribution (Bar chart percentages).

host:reveal_outcome ->

Calculates the winning option (majority vote).

Updates metrics according to predefined delta values.

Triggers UI chart animations on Host screen (e.g., Inflation drops, GDP rockets).

Shows historical breakdown based on textbook verified data.
